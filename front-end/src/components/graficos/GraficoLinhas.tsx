import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import FilterTable from "../buttons/FilterTable";

interface Serie {
  key: string;      // nome da propriedade no data (ex: "vendidas")
  color: string;    // cor da linha
  label: string;    // nome exibido na legenda
}
interface Filtro{
  value: string;
  children: React.ReactNode
}
interface GraficoLinhasProps {
  filtro?: boolean;
  tituloFiltro?: string;
  filtroChildren?: Filtro[];
  titulo: string;
  data: { name: string;[key: string]: number | string }[];
  series: Serie[];
}


export default function GraficoLinhas({ titulo, data, series, filtro,
  tituloFiltro,
  filtroChildren, }: GraficoLinhasProps) {
  return (
    <div className="w-full lg:h-90 md:h-70">
      <div className="w-full h-full bg-black-smooth p-2">
        <div className="flex flex-row justify-between items-end">
          <h2 className="text-xl font-semibold mb-2 text-primary-orange">{titulo}</h2>
          {filtro && <div>
                    <FilterTable 
                      titulo={tituloFiltro}
                      FilterTableProps={filtroChildren}
                    />
                  </div>}
        </div>


        <ResponsiveContainer width="100%" height="90%">
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
