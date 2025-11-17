import { useState } from "react";
import Button from "../../components/buttons/Button";
import CardEstatistica from "../../components/cards/CardEstatistica";
//import GraficoBarras from "../../components/graficos/GraficoBarras";
import GraficoLinhas from "../../components/graficos/GraficoLinhas";
import GraficoPizza from "../../components/graficos/GraficoPizza";
import NavBarDashboard from "../../components/navbar/NavBarDashboard";
import TabelaLista from "../../components/tabelas/TabelaLista";
import { X } from "lucide-react";
import FormGenerator from "../../components/forms/FormGenerator";

const dataVendasPizza = [
  { name: "Dinheiro", value: 600 },
  { name: "Pix", value: 250 },
  { name: "Cartão de Crédito", value: 105 },
  { name: "Cartão de Débito", value: 100 },
];
/*const dataFluxoEntradaSaida = [
  { mes: "Jan", entrada: 5000, saida: 3200 },
  { mes: "Fev", entrada: 4200, saida: 1800 },
  { mes: "Mar", entrada: 6100, saida: 4500 },
  { mes: "Abr", entrada: 3000, saida: 2800 },
  { mes: "Mai", entrada: 8000, saida: 5200 },
  { mes: "Jun", entrada: 9000, saida: 6200 },
  { mes: "Jul", entrada: 11000, saida: 7200 },
  { mes: "Ago", entrada: 12000, saida: 8200 },
  { mes: "Set", entrada: 13000, saida: 9200 },
  { mes: "Out", entrada: 14000, saida: 10200 },
];*/
const dataFluxoMovimentacao = [
  { name: "Jan", caixa: 5000 },
  { name: "Fev", caixa: -420 },
  { name: "Mar", caixa: 6100 },
  { name: "Abr", caixa: 3000 },
  { name: "Mai", caixa: 8000 },
  { name: "Jun", caixa: 9000 },
  { name: "Jul", caixa: 1100 },
  { name: "Ago", caixa: 1200 },
  { name: "Set", caixa: 13000 },
  { name: "Out", caixa: 1400 },
];
const filtros = [
  { value: "Diario", children: "Diario" },
  { value: "Semanal", children: "Semanal" },
  { value: "Mensal", children: "Mensal" },
  { value: "Semestral", children: "Semestral" },
  { value: "Anual", children: "Anual" },
];
const colunasHistoricoCaixa = [
  { chave: "tipo", titulo: "Tipo", size: "sm" },
  { chave: "descricao", titulo: "Descrição", size: "auto" },
  { chave: "data", titulo: "Data", size: "md" },
  { chave: "valor", titulo: "Valor", size: "sm" },
];
const historicoDeMovimentacoes = [
  {
    tipo: "Entrada",
    descricao: "Venda de pneus - João Silva",
    data: "01/10/2023",
    valor: "R$ 500,00",
  },
];

export default function DashCaixa() {
  const [isOpen, setIsOpen] = useState(false);
  const [tipoMovimentacao, setTipoMovimentacao] = useState<"Entrada" | "Saida" | null>(null);

  const [form, setForm] = useState({
    tipo: "",
    descricao: "",
    valor: "",
    data: "",
  });

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

    console.log(`${tipoMovimentacao} cadastrada:`, form);
    alert(`${tipoMovimentacao} registrada com sucesso!`);
    setIsOpen(false);
  };

  const abrirModal = (tipo: "Entrada" | "Saida") => {
    setTipoMovimentacao(tipo);
    setIsOpen(true);
    setForm({ tipo: "", descricao: "", valor: "", data: "" });
  };

  return (
    <div className="flex bg-black-smooth/95">
      <NavBarDashboard page="Caixa" />

      <div className="flex flex-row gap-2 py-2 px-5 w-screen">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row w-full gap-2">
            <CardEstatistica
              className="bg-black-smooth flex flex-col border-l border-primary-orange p-2 min-w-80 "
              titulo="CAIXA ATUAL (R$)"
              valor="32.192,19"
            />
            <GraficoPizza
              titulo="Principais formas de pagamento"
              data={dataVendasPizza}
              height="h-47"
            />
          </div>
          {/*
          <div className="w-full h-50">
            <GraficoBarras data={dataFluxoEntradaSaida} />
          </div>*/
          }

          <div className="w-full h-80">
            <GraficoLinhas
              titulo="Fluxo de movimentação"
              filtro={true}
              tituloFiltro="Filtar"
              filtroChildren={filtros}
              data={dataFluxoMovimentacao}
              series={[
                { key: "caixa", color: "#FF961F", label: "Fluxo de caixa do mês" },
              ]}
            />
          </div>
        </div>

        <div className="flex flex-col w-full">
          <TabelaLista
            titulo="HISTÓRICO DE MOVIMENTAÇÕES DO CAIXA"
            colunas={colunasHistoricoCaixa}
            fetchData={async () => historicoDeMovimentacoes}
            alturaMax="md:max-h-33"
          />

          <div className="flex justify-between items-center w-ful mb-13 mt-2">
            <Button
              className="bg-red-alert text-black font-semibold px-4 py-2 rounded hover:text-ice"
              children="Nova movimentação de saída"
              onClick={() => abrirModal("Saida")}
            />
            <Button
              className="bg-pear-green text-black font-semibold px-4 py-2 rounded hover:text-ice"
              children="Nova movimentação de entrada"
              onClick={() => abrirModal("Entrada")}
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute flex justify-center items-center w-full h-full bg-black/50 z-50">
          <div className="bg-black-smooth h-[90%] w-[60%] rounded-md p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <div className="flex flex-row justify-between mb-4">
              <h1 className="text-2xl font-semibold text-primary-orange">
                Cadastrar nova movimentação de{" "}
                {tipoMovimentacao === "Saida" ? "Saída" : "Entrada"}
              </h1>
              <X
                size={30}
                color="#FFF"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer hover:scale-110 transition-transform"
              />
            </div>

            <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
              <FormGenerator
                fields={fields}
                form={form}
                setForm={setForm}
                className="grid grid-cols-1 gap-4 w-full"
              />

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
