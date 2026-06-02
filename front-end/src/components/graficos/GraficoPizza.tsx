import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";

interface GraficoPizzaProps {
  titulo?: string;
  data: {
    name: string;
    value: number;
  }[];
  height?: string;
}

const COLORS = ["#F7D720", "#FF961F", "#1F47FF", "#369638", "#FF2817"]; // cores personalizáveis

export default function GraficoPizza({ data, titulo, height = "h-60" }: GraficoPizzaProps) {
  return (
    <div className={`w-96 ${height} bg-[#0D0D0D] p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent shadow-2xl flex flex-col justify-between py-2`}>
      <h2 className="text-md font-semibold mb-1 px-2 ">{titulo}</h2>

      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"         // desloca o gráfico um pouco à esquerda
            cy="50%"
            outerRadius={40} // reduz o tamanho da pizza
            innerRadius={0} // deixa o formato tipo donut
            paddingAngle={1} // espaço entre as fatias
            
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} cursor="pointer" />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{ backgroundColor: "#1c1c1c", border: "1px solid #FF961F", color: "#fff" }}
            itemStyle={{ color: "#FF961F" }}
          />

          <Legend
            verticalAlign="middle"
            align="right"
            layout="vertical"
            wrapperStyle={{ paddingLeft: "30px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
