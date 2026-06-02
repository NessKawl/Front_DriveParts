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
  heightClass?: string;
}


export default function GraficoLinhas({ 
  titulo, 
  data, 
  series, 
  filtro,
  tituloFiltro,
  filtroChildren,
  heightClass
}: GraficoLinhasProps) {
  return (
    <div className={heightClass || "w-full lg:h-90 md:h-70"}>
      <div className="w-full h-full bg-transparent p-0">
        <div className="flex flex-row justify-between items-end mb-2">
          <h2 className="text-sm font-semibold text-white">{titulo}</h2>
          {filtro && <div>
                    <FilterTable 
                      titulo={tituloFiltro}
                      FilterTableProps={filtroChildren}
                    />
                  </div>}
        </div>


        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="name" tick={{ fill: "#8E8E93", fontSize: 10 }} />
            <YAxis tick={{ fill: "#8E8E93", fontSize: 10 }} />
            <Tooltip contentStyle={{ backgroundColor: "#0D0D0D", borderColor: "#222", borderRadius: "8px" }} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            {series.map((serie) => (
              <Line
                key={serie.key}
                type="monotone"
                dataKey={serie.key}
                stroke={serie.color}
                strokeWidth={2}
                dot={{ r: 1 }}
                name={serie.label}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

