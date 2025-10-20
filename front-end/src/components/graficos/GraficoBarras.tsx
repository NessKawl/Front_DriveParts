import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

interface FluxoMensalData {
  mes: string;
  entrada: number;
  saida: number;
}

interface GraficoFluxoMensalProps {
  data: FluxoMensalData[];
}

export default function GraficoFluxoMensal({ data }: GraficoFluxoMensalProps) {
  return (
    <div className="w-full h-72 bg-black-smooth border-l border-primary-orange p-2">
      <h2 className="text-xl font-semibold mb-4 text-primary-orange">Fluxo Mensal (Entradas e Saídas)</h2>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3A" />
          <XAxis dataKey="mes" tick={{ fill: "#EAEAEA" }} />
          <YAxis tick={{ fill: "#EAEAEA" }} />
          <Tooltip
            formatter={(value: number) => `R$ ${value.toLocaleString("pt-BR")}`}
            labelFormatter={(label) => `Mês: ${label}`}
          />
          <Legend />
          <Bar dataKey="entrada" fill="#22C55E" name="Entradas" />
          <Bar dataKey="saida" fill="#EF4444" name="Saídas" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
