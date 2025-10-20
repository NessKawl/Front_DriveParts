import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Serie {
  key: string;      // nome da propriedade no data (ex: "vendidas")
  color: string;    // cor da linha
  label: string;    // nome exibido na legenda
}

interface GraficoLinhasProps {
  titulo: string;
  data: { name: string;[key: string]: number | string }[];
  series: Serie[];
}

export default function GraficoLinhas({ titulo, data, series }: GraficoLinhasProps) {
  return (
    <div className="w-full md:h-70">
      <div className="w-full h-full bg-black-smooth border-l border-primary-orange p-2" >
        <h2 className="text-xl font-semibold mb-2 text-primary-orange">{titulo}</h2>

        <ResponsiveContainer width="100%" height="91%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3A" />
            <XAxis dataKey="name" tick={{ fill: "#EAEAEA" }} />
            <YAxis tick={{ fill: "#EAEAEA" }} />
            <Tooltip />
            <Legend />
            {series.map((serie) => (
              <Line
                key={serie.key}
                type="linear"
                dataKey={serie.key}
                stroke={serie.color}
                strokeWidth={3}
                dot={{ r: 2 }}
                name={serie.label}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
