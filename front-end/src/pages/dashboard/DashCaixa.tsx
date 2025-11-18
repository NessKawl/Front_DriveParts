import { useState, useEffect } from "react";
import CardEstatistica from "../../components/cards/CardEstatistica";
import GraficoLinhas from "../../components/graficos/GraficoLinhas";
import GraficoPizza from "../../components/graficos/GraficoPizza";
import NavBarDashboard from "../../components/navbar/NavBarDashboard";
import TabelaLista from "../../components/tabelas/TabelaLista";
import { X } from "lucide-react";
import FormGenerator from "../../components/forms/FormGenerator";
import { dashboardCaixaService } from "../../services/dashboardCaixaService";

interface Movimentacao {
  tipo: "Entrada" | "Saida";
  descricao: string;
  valor: number;
  data: Date;
}

interface VendaPorPagamento {
  formaPagamento: string;
  valor: number;
}

interface FluxoMov {
  name: string;
  [key: string]: string | number;
}

function normalizarData(dataStr: string): Date {
  const fix = dataStr.replace(" ", "T");
  const d = new Date(fix);
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
  return d;
}

function formatReaisSinalDepois(valor: number) {
  const fmt = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  if (valor < 0) {
    return fmt.format(Math.abs(valor)).replace("R$", "R$ -");
  }

  return fmt.format(valor);
}

export default function DashCaixa() {
  const [isOpen, setIsOpen] = useState(false);
  const [tipoMovimentacao, setTipoMovimentacao] = useState<"Entrada" | "Saida" | null>(null);
  const [caixaAtual, setCaixaAtual] = useState<number>(0);
  const [vendasPorPagamento, setVendasPorPagamento] = useState<{ name: string; value: number }[]>([]);
  const [filtroMov, setFiltroMov] = useState("Mensal");
  const [fluxoMovimentacao, setFluxoMovimentacao] = useState<FluxoMov[]>([]);
  const [movsRaw, setMovsRaw] = useState<Movimentacao[]>([]);

  const [form, setForm] = useState({
    tipo: "",
    descricao: "",
    valor: "",
    data: "",
  });

  useEffect(() => {
    dashboardCaixaService
      .getVendasPorPagamento()
      .then((data: VendaPorPagamento[]) => {
        const formatado = data.map((item: VendaPorPagamento) => ({
          name: item.formaPagamento,
          value: item.valor,
        }));
        setVendasPorPagamento(formatado);
      })
      .catch((err) => console.error("Erro ao carregar vendas por pagamento:", err));
  }, []);

  useEffect(() => {
    let mounted = true;

    dashboardCaixaService
      .getMovimentacoes()
      .then((movs: Movimentacao[]) => {
        if (!mounted) return;

        const normalized = movs.map((m: Movimentacao) => ({
          ...m,
          valor: Number(m.valor),
          data: normalizarData(m.data.toString()),
        }));
        setMovsRaw(normalized);
      })
      .catch((err) => {
        console.error("Erro ao buscar movimentações:", err);
        setMovsRaw([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const hoje = new Date();
    const hojeISO = hoje.toISOString().slice(0, 10);
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

    function formatDia(d: Date) {
      const ano = d.getFullYear();
      const mes = String(d.getMonth() + 1).padStart(2, "0");
      const dia = String(d.getDate()).padStart(2, "0");
      return `${ano}-${mes}-${dia}`;
    }

    if (movsRaw.length === 0) {
      gerarGraficoZerado();
      return;
    }

    function gerarGraficoZerado() {
      if (filtroMov === "Diario") {
        setFluxoMovimentacao([{ name: "Hoje", caixa: 0 }]);
        return;
      }

      if (filtroMov === "Semanal") {
        const dias: FluxoMov[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(hoje.getDate() - i);
          dias.push({
            name: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
            caixa: 0,
          });
        }
        setFluxoMovimentacao(dias);
        return;
      }

      if (filtroMov === "Mensal") {
        const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
        const dias: FluxoMov[] = [];
        for (let d = 1; d <= ultimoDia; d++) dias.push({ name: String(d).padStart(2, "0"), caixa: 0 });
        setFluxoMovimentacao(dias);
        return;
      }

      if (filtroMov === "Semestral") {
        const inicio = hoje.getMonth() < 6 ? 0 : 6;
        const fim = inicio + 5;
        const arr: FluxoMov[] = [];
        for (let m = inicio; m <= fim; m++) arr.push({ name: meses[m], caixa: 0 });
        setFluxoMovimentacao(arr);
        return;
      }

      if (filtroMov === "Anual") {
        setFluxoMovimentacao(meses.map((m) => ({ name: m, caixa: 0 })));
        return;
      }
    }

    if (filtroMov === "Diario") {
      const filtrados = movsRaw.filter((m) => formatDia(m.data) === hojeISO);
      const total = filtrados.reduce((acc, m) => acc + (m.tipo === "Entrada" ? m.valor : -m.valor), 0);
      setFluxoMovimentacao([{ name: "Hoje", caixa: total }]);
      return;
    }

    if (filtroMov === "Semanal") {
      const mapa: Record<string, number> = {};
      const dias: string[] = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(hoje.getDate() - i);
        const key = formatDia(d);
        dias.push(key);
        mapa[key] = 0;
      }

      movsRaw.forEach((m) => {
        const key = formatDia(m.data);
        if (key in mapa) mapa[key] += m.tipo === "Entrada" ? m.valor : -m.valor;
      });

      setFluxoMovimentacao(dias.map((key) => ({ name: key.slice(5), caixa: mapa[key] })));
      return;
    }

    if (filtroMov === "Mensal") {
      const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
      const dias: Record<number, number> = {};
      for (let d = 1; d <= ultimoDia; d++) dias[d] = 0;

      movsRaw.forEach((m) => {
        if (m.data.getMonth() === hoje.getMonth() && m.data.getFullYear() === hoje.getFullYear()) {
          const d = m.data.getDate();
          dias[d] += m.tipo === "Entrada" ? m.valor : -m.valor;
        }
      });

      setFluxoMovimentacao(Object.keys(dias).map((d) => ({ name: d.padStart(2, "0"), caixa: dias[Number(d)] })));
      return;
    }

    if (filtroMov === "Semestral") {
      const inicio = hoje.getMonth() < 6 ? 0 : 6;
      const fim = inicio + 5;
      const grupo: Record<number, number> = {};
      for (let m = inicio; m <= fim; m++) grupo[m] = 0;

      movsRaw.forEach((m) => {
        const mes = m.data.getMonth();
        if (mes >= inicio && mes <= fim) grupo[mes] += m.tipo === "Entrada" ? m.valor : -m.valor;
      });

      setFluxoMovimentacao(Object.keys(grupo).map((m) => ({ name: meses[Number(m)], caixa: grupo[Number(m)] })));
      return;
    }

    if (filtroMov === "Anual") {
      const grupo: Record<number, number> = {};
      for (let m = 0; m < 12; m++) grupo[m] = 0;

      movsRaw.forEach((m) => {
        if (m.data.getFullYear() === hoje.getFullYear()) {
          grupo[m.data.getMonth()] += m.tipo === "Entrada" ? m.valor : -m.valor;
        }
      });

      setFluxoMovimentacao(Object.keys(grupo).map((m) => ({ name: meses[Number(m)], caixa: grupo[Number(m)] })));
    }
  }, [movsRaw, filtroMov]);

  useEffect(() => {
    dashboardCaixaService
      .getCaixaAtual()
      .then((data: { caixa: number }) => setCaixaAtual(data.caixa))
      .catch((err) => console.error(err));
  }, []);

  const fields = [
    {
      name: "tipo",
      type: "select",
      placeholder: "Selecione o tipo de movimentação",
      options:
        tipoMovimentacao === "Saida"
          ? [
            { label: "Sangria", value: "Sangria" },
            { label: "Pagamento", value: "Pagamento" },
            { label: "Outros", value: "Outros" },
          ]
          : [
            { label: "Venda", value: "Venda" },
            { label: "Investimento", value: "Investimento" },
            { label: "Devolução", value: "Devolucao" },
            { label: "Outros", value: "Outros" },
          ],
    },
    { name: "valor", type: "number", placeholder: "Valor da movimentação (R$)", required: true },
    { name: "data", type: "date", placeholder: "Data da movimentação" },
    { name: "descricao", type: "text", placeholder: "Descrição" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tipo || !form.descricao || !form.data || !form.valor) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    alert(`${tipoMovimentacao} registrada com sucesso!`);
    setIsOpen(false);
  };

  const colunasHistoricoCaixa = [
    { chave: "tipo", titulo: "Tipo", size: "sm" },
    { chave: "descricao", titulo: "Descrição", size: "auto" },
    { chave: "data", titulo: "Data", size: "md" },
    { chave: "valor", titulo: "Valor", size: "sm" },
  ];

  return (
    <div className="flex bg-black-smooth/95">
      <NavBarDashboard page="Caixa" />

      <div className="flex flex-row gap-2 py-2 px-5 w-screen">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row w-full gap-2">
            <CardEstatistica
              className="bg-black-smooth flex flex-col border-l border-primary-orange p-2 min-w-80"
              titulo="CAIXA ATUAL (R$)"
              valor={formatReaisSinalDepois(caixaAtual)}
            />

            <GraficoPizza
              titulo="Principais formas de pagamento"
              data={vendasPorPagamento.map((item) => ({ name: item.name, value: item.value }))}
              height="h-47"
            />
          </div>

          <div className="flex justify-end mb-2">
            <select
              value={filtroMov}
              onChange={(e) => setFiltroMov(e.target.value)}
              className="bg-zinc-900 text-white border border-zinc-700 px-2 py-1 rounded"
            >
              <option value="Diario">Diário</option>
              <option value="Semanal">Semanal</option>
              <option value="Mensal">Mensal</option>
              <option value="Semestral">Semestral</option>
              <option value="Anual">Anual</option>
            </select>
          </div>

          <div className="w-full h-80">
            <GraficoLinhas
              titulo="Fluxo de movimentação"
              data={fluxoMovimentacao}
              series={[{ key: "caixa", color: "#FF961F", label: "Fluxo de caixa" }]}
            />
          </div>
        </div>

        <div className="flex flex-col w-full">
          <TabelaLista
            titulo="HISTÓRICO DE MOVIMENTAÇÕES DO CAIXA"
            colunas={colunasHistoricoCaixa}
            fetchData={async () => {
              try {
                const data: Movimentacao[] = await dashboardCaixaService.getMovimentacoes();
                console.log("Vendas por pagamento -> ", data);

                return data
                  .map((item: Movimentacao) => ({
                    ...item,
                    valor: formatReaisSinalDepois(item.valor),
                    data: normalizarData(item.data.toString()).toLocaleDateString("pt-BR"),
                  }))
                  .sort((a: { data: string }, b: { data: string }) => new Date(b.data).getTime() - new Date(a.data).getTime());
              } catch (err) {
                console.error("Erro ao buscar movimentações:", err);
                return [];
              }
            }}
            alturaMax="md:max-h-200"
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute flex justify-center items-center w-full h-full bg-black/50 z-50">
          <div className="bg-black-smooth h-[90%] w-[60%] rounded-md p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <div className="flex flex-row justify-between mb-4">
              <h1 className="text-2xl font-semibold text-primary-orange">
                Cadastrar nova movimentação de {tipoMovimentacao === "Saida" ? "Saída" : "Entrada"}
              </h1>
              <X
                size={30}
                color="#FFF"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer hover:scale-110 transition-transform"
              />
            </div>

            <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
              <FormGenerator fields={fields} form={form} setForm={setForm} className="grid grid-cols-1 gap-4 w-full" />

              <button
                type="submit"
                className="bg-primary-orange hover:bg-orange-300 w-48 py-2 text-ice hover:text-black-smooth text-xl font-semibold rounded-md self-end"
              >
                Registrar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}