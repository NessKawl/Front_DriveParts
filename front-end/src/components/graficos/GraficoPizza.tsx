import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";

interface GraficoPizzaProps {
  titulo?: string;
  data: {
    name: string;
    value: number;
  }[];
  height?: string;
}

const COLORS = ["#FF961F", "#1F47FF", "#369638", "#FF2817"]; // cores personalizáveis

export default function GraficoPizza({ data, titulo, height = "h-60" }: GraficoPizzaProps) {
  return (
    <div className={`w-96 ${height} bg-black-smooth border-l border-primary-orange py-2`}>
      <h2 className="text-xl font-semibold mb-1 px-2 text-primary-orange">{titulo}</h2>

      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"         // desloca o gráfico um pouco à esquerda
            cy="50%"
            outerRadius={60} // reduz o tamanho da pizza
            innerRadius={0} // deixa o formato tipo donut
            paddingAngle={2} // espaço entre as fatias
            
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
