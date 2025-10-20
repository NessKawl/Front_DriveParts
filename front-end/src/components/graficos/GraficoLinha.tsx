import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface GraficoLinhasProps {
    titulo: string
    data: {
        name: string;
        vendas: number;
    }[];
}

export default function GraficoLinhas({ data, titulo }: GraficoLinhasProps) {
  return (
    <div className="w-full h-96 bg-black-smooth border-l border-primary-orange p-4 ">
      <h2 className="text-xl font-semibold mb-4 text-primary-orange">{titulo}</h2>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F3F3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="vendas" stroke="#FF961F" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
