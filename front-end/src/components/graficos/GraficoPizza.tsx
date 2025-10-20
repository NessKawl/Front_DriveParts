import { Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart } from "recharts"

interface GraficoLinhasProps {
    data: {
        name: string;
        vendas: number;
    }[];
}

export default function GraficoLinhas({ data }: GraficoLinhasProps) {
  return (
    <div className="w-full h-full bg-black-smooth border-l border-primary-orange p-4 ">
      <h2 className="text-xl font-semibold mb-2 text-primary-orange">Vendas</h2>

      <ResponsiveContainer width="100%" height="90%">
        <PieChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F3F3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Pie type="monotone" dataKey="vendas" stroke="#FF961F" strokeWidth={3} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
