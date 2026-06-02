import { useEffect, useState } from "react";
import { Activity, BarChart3 } from "lucide-react";
import GraficoLinhas from "../../components/graficos/GraficoLinhas";
import NavBarDashboard from "../../components/navbar/NavBarDashboard";
import TabelaLista from "../../components/tabelas/TabelaLista";
import { dashboardGeralService } from "../../services/dashboardGeralService";

const colunasVendas = [
  { chave: "produto", titulo: "Produto", size: "auto" },
  { chave: "valor", titulo: "Valor Unidade", size: "md" },
  { chave: "quantidade", titulo: "Qtd", size: "sm" },
  { chave: "total", titulo: "Total", size: "sm" },
  { chave: "data", titulo: "Data", size: "md" },
  { chave: "usuario", titulo: "Usuário", size: "md" },
];

const filtros = [
  { value: "Dia", children: "Dia" },
  { value: "Semanal", children: "Semanal" },
  { value: "Mensal", children: "Mensal" },
  { value: "Semestral", children: "Semestral" },
  { value: "Anual", children: "Anual" },
];

const ordenacoes = [
  { value: "recentes", label: "Mais Recentes" },
  { value: "antigas", label: "Mais Antigas" },
];

// Funções de utilidade para datas
function pad(n: number) {
  return String(n).padStart(2, "0");
}
function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function formatLocalISO(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function gerarIntervaloDatas(filtro: string) {
  const hoje = startOfDay(new Date());
  const datas: string[] = [];

  if (filtro === "Dia") return [formatLocalISO(hoje)];

  if (filtro === "Semanal") {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(hoje);
      d.setDate(hoje.getDate() - i);
      datas.push(formatLocalISO(d));
    }
    return datas;
  }

  if (filtro === "Mensal") {
    const ultimoDia = new Date(
      hoje.getFullYear(),
      hoje.getMonth() + 1,
      0,
    ).getDate();
    for (let d = 1; d <= ultimoDia; d++)
      datas.push(
        formatLocalISO(new Date(hoje.getFullYear(), hoje.getMonth(), d)),
      );
    return datas;
  }

  if (filtro === "Semestral") {
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth() + 1;
    const primeiroMes = mes <= 6 ? 1 : 7;
    const ultimoMes = mes <= 6 ? 6 : 12;
    for (let m = primeiroMes; m <= ultimoMes; m++)
      datas.push(formatLocalISO(new Date(ano, m - 1, 1)));
    return datas;
  }

  if (filtro === "Anual") {
    const ano = hoje.getFullYear();
    for (let m = 0; m < 12; m++)
      datas.push(formatLocalISO(new Date(ano, m, 1)));
    return datas;
  }

  return gerarIntervaloDatas("Semanal");
}

function formatLabelForKey(key: string, filtro: string) {
  const parts = key.split("-");
  if (filtro === "Mensal") return parts[2];
  if (filtro === "Semanal" || filtro === "Dia")
    return `${pad(Number(parts[2]))}/${pad(Number(parts[1]))}`;
  const meses = [
    "JAN",
    "FEV",
    "MAR",
    "ABR",
    "MAI",
    "JUN",
    "JUL",
    "AGO",
    "SET",
    "OUT",
    "NOV",
    "DEZ",
  ];
  return `${meses[Number(parts[1]) - 1]}/${parts[0].slice(2)}`;
}

export default function DashAnalise() {
  const [filtro, setFiltro] = useState("Mensal");
  const [ordenacao, setOrdenacao] = useState("recentes");
  const [dadosGrafico, setDadosGrafico] = useState<
    { name: string; vendas: number }[]
  >([]);

  // Carrega gráfico de vendas
  useEffect(() => {
    const carregarGrafico = async () => {
      try {
        const vendas = await dashboardGeralService.listarVendas();
        const intervalKeys = gerarIntervaloDatas(filtro);
        const mapa: { [key: string]: number } = {};
        intervalKeys.forEach((k) => (mapa[k] = 0));

        (vendas || []).forEach((v: any) => {
          if (v.ven_status !== "CONCLUIDA") return;
          const dataVenda = new Date(
            v.ven_data_modificacao || v.ven_data_criacao || v.ven_data,
          );
          const keyDate =
            filtro === "Semestral" || filtro === "Anual"
              ? new Date(dataVenda.getFullYear(), dataVenda.getMonth(), 1)
              : startOfDay(dataVenda);
          const key = formatLocalISO(keyDate);
          if (mapa[key] !== undefined) mapa[key]++;
        });

        const resultado = intervalKeys.map((k) => ({
          name: formatLabelForKey(k, filtro),
          vendas: mapa[k],
        }));
        setDadosGrafico(resultado);
      } catch (err) {
        console.error(err);
      }
    };
    carregarGrafico();
  }, [filtro]);

  // Fetch todas vendas com ordenação
  const fetchVendas = async () => {
    try {
      const vendas = await dashboardGeralService.listarVendas();
      if (!vendas) return [];

      return vendas
        .sort((a: any, b: any) => {
          if (ordenacao === "recentes")
            return (b.ven_id ?? 0) - (a.ven_id ?? 0);
          return (a.ven_id ?? 0) - (b.ven_id ?? 0);
        })
        .map((v: any) => {
          const itens = v.ite_itemVenda ?? [];
          const produto = itens[0]?.pro_produto?.pro_nome ?? "—";
          const valorUnitario = itens[0]?.pro_produto?.pro_valor ?? 0;
          const quantidade = itens.reduce(
            (acc: number, it: any) =>
              acc + (it.ite_quantidade ?? it.ite_qtd ?? 1),
            0,
          );
          const total = itens.reduce(
            (acc: number, it: any) =>
              acc +
              (it.ite_quantidade ?? it.ite_qtd ?? 1) *
                (it.pro_produto?.pro_valor ?? 0),
            0,
          );

          // Formata a data para dd/mm/yyyy
          const dataVenda = new Date(
            v.ven_data_modificacao || v.ven_data_criacao || v.ven_data,
          );
          const dataFormatada = `${pad(dataVenda.getDate())}/${pad(dataVenda.getMonth() + 1)}/${dataVenda.getFullYear()}`;

          // Nome do usuário que comprou
          const nomeUsuario = v.usu_usuario?.usu_nome ?? "—";

          return {
            produto,
            valor: valorUnitario.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }),
            quantidade,
            data: dataFormatada,
            total: total.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }),
            usuario: nomeUsuario,
          };
        });
    } catch {
      return [];
    }
  };

  return (
    <div className="flex bg-[#080808] h-screen overflow-hidden">
      <NavBarDashboard page="Análise de Vendas" />
      <div className="flex-1 flex flex-col p-5 text-white overflow-hidden h-screen">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Análise de Vendas
            </h1>
            <p className="text-gray-400 text-xs mt-0.5">
              Relatórios gráficos e histórico detalhado das vendas efetuadas no
              caixa.
            </p>
          </div>
        </div>

        {/* Grafico Panel */}
        <div className="flex flex-row justify-between items-start h-full gap-4">
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-4 flex flex-col gap-3 mb-4 transition-all duration-200 hover:border-[#222] h-full w-full">
            <div className="flex flex-row justify-between items-center border-b border-[#1A1A1A] pb-2">
              <div className="flex items-center gap-2">
                <div className="bg-orange-500/10 text-[#FF961F] w-7 h-7 rounded-md flex items-center justify-center">
                  <Activity size={15} />
                </div>
                <span className="text-sm font-semibold text-white">
                  Desempenho de Vendas
                </span>
              </div>

              {/* Filtro pílula */}
              <div className="flex items-center bg-[#121212] border border-[#222] rounded-lg px-2 py-1 text-[11px] text-white">
                <select
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="bg-transparent border-none text-white outline-none cursor-pointer pr-1 font-semibold"
                >
                  {filtros.map((f) => (
                    <option
                      key={f.children}
                      value={f.children}
                      className="bg-[#121212]"
                    >
                      {f.value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1">
              <GraficoLinhas
                titulo=""
                filtro={false}
                data={dadosGrafico}
                heightClass="w-full h-full"
                series={[
                  {
                    key: "vendas",
                    color: "#369638",
                    label: "Vendas Concluídas",
                  },
                ]}
              />
            </div>
          </div>

          {/* Tabela Panel */}
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-4 flex flex-col gap-3 overflow-hidden transition-all duration-200 hover:border-[#222] h-full w-full">
            <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-2">
              <div className="flex items-center gap-2">
                <div className="bg-orange-500/10 text-[#FF961F] w-7 h-7 rounded-md flex items-center justify-center">
                  <BarChart3 size={15} />
                </div>
                <span className="text-sm font-semibold text-white">
                  Relatório de Vendas
                </span>
              </div>

              {/* Filtro Ordenação */}
              <div className="flex items-center bg-[#121212] border border-[#222] rounded-lg px-2 py-1 text-[11px] text-white">
                <select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value)}
                  className="bg-transparent border-none text-white outline-none cursor-pointer pr-1 font-semibold"
                >
                  {ordenacoes.map((o) => (
                    <option
                      key={o.value}
                      value={o.value}
                      className="bg-[#121212]"
                    >
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabelaLista
                titulo=""
                colunas={colunasVendas}
                fetchData={fetchVendas}
                alturaMax="max-h-56"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
