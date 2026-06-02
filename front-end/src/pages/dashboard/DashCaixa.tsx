import { useState, useEffect } from "react";
//import CardEstatistica from "../../components/cards/CardEstatistica";
import GraficoLinhas from "../../components/graficos/GraficoLinhas";
import GraficoPizza from "../../components/graficos/GraficoPizza";
import NavBarDashboard from "../../components/navbar/NavBarDashboard";
import TabelaLista from "../../components/tabelas/TabelaLista";
import { X, Coins, PercentCircle, ClipboardList } from "lucide-react";
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
  const [filtroMov, setFiltroMov] = useState("Semanal");
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

      setFluxoMovimentacao(
        dias.map((key) => {
          const [ano, mes, dia] = key.split("-");
          return {
            name: `${dia}/${mes}`,
            caixa: mapa[key],
          };
        })
      );

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
    <div className="flex bg-[#080808] h-screen overflow-hidden">
      <NavBarDashboard page="Caixa" />

      <div className="flex-1 flex flex-col p-5 text-white overflow-hidden h-screen">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gestão de Caixa</h1>
            <p className="text-gray-400 text-xs mt-0.5">Controle de entradas, saídas e formas de pagamento preferidas.</p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
          {/* Coluna Esquerda: Métricas e Gráfico */}
          <div className="lg:col-span-7 flex flex-col gap-4 overflow-hidden">
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Caixa Atual */}
              <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-3.5 flex items-center justify-between transition-all duration-200 hover:border-[#222]">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Caixa Atual</span>
                  <span className="text-3xl font-bold text-white mt-1 font-mono">{formatReaisSinalDepois(caixaAtual)}</span>
                </div>
                <div className="bg-[#FF961F]/10 text-[#FF961F] border border-[#FF961F]/20 w-9 h-9 rounded-lg flex items-center justify-center">
                  <Coins size={18} />
                </div>
              </div>

              {/* Pizza Pagamento */}
              <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-3 flex flex-col justify-center min-h-[90px] hover:border-[#222] transition-colors">
                <GraficoPizza
                  titulo="Principais formas de pagamento"
                  data={vendasPorPagamento.map((item) => ({ name: item.name, value: item.value }))}
                  height="h-40"
                />
              </div>
            </div>

            {/* Linhas Fluxo de Caixa */}
            <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-4 flex-1 flex flex-col gap-3 overflow-hidden hover:border-[#222] transition-colors">
              <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-orange-500/10 text-[#FF961F] w-7 h-7 rounded-md flex items-center justify-center">
                    <PercentCircle size={15} />
                  </div>
                  <span className="text-sm font-semibold text-white">Fluxo de Movimentação</span>
                </div>

                <div className="flex items-center bg-[#121212] border border-[#222] rounded-lg px-2 py-1 text-[11px] text-white">
                  <select
                    value={filtroMov}
                    onChange={(e) => setFiltroMov(e.target.value)}
                    className="bg-transparent border-none text-white outline-none cursor-pointer pr-1 font-semibold"
                  >
                    <option value="Diario" className="bg-[#121212]">Diário</option>
                    <option value="Semanal" className="bg-[#121212]">Semanal</option>
                    <option value="Mensal" className="bg-[#121212]">Mensal</option>
                    <option value="Semestral" className="bg-[#121212]">Semestral</option>
                    <option value="Anual" className="bg-[#121212]">Anual</option>
                  </select>
                </div>
              </div>

              <div className="flex-1">
                <GraficoLinhas
                  titulo=""
                  data={fluxoMovimentacao}
                  heightClass="w-full h-full"
                  series={[{ key: "caixa", color: "#FF961F", label: "Fluxo de Caixa" }]}
                />
              </div>
            </div>
          </div>

          {/* Coluna Direita: Tabela */}
          <div className="lg:col-span-5 bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-4 flex flex-col gap-3 overflow-hidden hover:border-[#222] transition-colors">
            <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-2">
              <div className="flex items-center gap-2">
                <div className="bg-orange-500/10 text-[#FF961F] w-7 h-7 rounded-md flex items-center justify-center">
                  <ClipboardList size={15} />
                </div>
                <span className="text-sm font-semibold text-white">Histórico de Caixa</span>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabelaLista
                titulo=""
                colunas={colunasHistoricoCaixa}
                fetchData={async () => {
                  try {
                    const data: Movimentacao[] = await dashboardCaixaService.getMovimentacoes();
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
                alturaMax="max-h-[300px]"
              />
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute flex justify-center items-center w-full h-full bg-black/70 backdrop-blur-sm z-50">
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] h-[85%] w-[55%] rounded-2xl p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex flex-row justify-between items-center border-b border-[#1A1A1A] pb-3 mb-6">
                <h1 className="text-xl font-semibold text-[#FF961F]">
                  Cadastrar movimentação: {tipoMovimentacao === "Saida" ? "Saída" : "Entrada"}
                </h1>
                <X
                  size={24}
                  color="#FFF"
                  onClick={() => setIsOpen(false)}
                  className="cursor-pointer hover:scale-110 transition-transform opacity-70 hover:opacity-100"
                />
              </div>

              <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
                <FormGenerator fields={fields} form={form} setForm={setForm} className="grid grid-cols-1 gap-4 w-full" />
                
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="bg-[#FF961F] hover:bg-orange-500 text-black text-sm font-bold py-2.5 px-6 rounded-lg transition-all duration-200"
                  >
                    Registrar Movimentação
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
