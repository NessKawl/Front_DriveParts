// TabelaLista.tsx (apenas a parte relevante)
import { useEffect, useMemo, useState } from "react";
import TabelaHeader from "./TabelaHeader";
import TabelaLinha from "./TabelaLinha";
import TabelaSkeleton from "./TabelaSkeleton";
import FilterTable from "../buttons/FilterTable";
import SearchDashboard from "../inputs/SearchDashboard";

type SizeKey = "sm" | "md" | "lg" | "auto" | string;

interface Coluna {
  chave: string;
  titulo: string;
  size?: SizeKey; // new
}

interface Acao {
  label: string;
  cor?: string;
  onClick?: (item: any) => void;
  link?: string;
}

interface Filtro {
  value: string;
  children: React.ReactNode;
}
interface TabelaListaProps {
  filtro?: boolean;
  tituloFiltro?: string;
  filtroChildren?: Filtro[];
  pesquisa?: boolean;
  titulo: string;
  colunas: Coluna[];
  fetchData: () => Promise<any[]>;
  alturaMax?: string;
  acoes?: Acao[];
}

const sizeMap: Record<string, string> = {
  sm: "80px",
  md: "140px",
  lg: "1fr",
  auto: "minmax(80px, 1fr)",
};

export default function TabelaLista({
  titulo,
  filtro,
  tituloFiltro,
  filtroChildren,
  pesquisa,
  colunas,
  fetchData,
  alturaMax = "max-h-80",
  acoes = [],
}: TabelaListaProps) {
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData()
      .then((res) => setDados(res))
      .finally(() => setLoading(false));
  }, [fetchData]);

  // monta a string CSS para gridTemplateColumns
  const gridTemplateColumns = useMemo(() => {
    const cols = colunas.map((c) => {
      if (!c.size) return sizeMap.auto;
      if (sizeMap[c.size]) return sizeMap[c.size];
      // se size for string personalizada como "200px" ou "minmax(100px,200px)"
      return c.size;
    });
    // se houver ações, adiciona coluna fixa pra ações
    if ((acoes?.length || 0) > 0) {
      cols.push("140px"); // largura fixa para ações
    }
    return cols.join(" ");
  }, [colunas, acoes]);

  return (
    <div className="bg-black-smooth border-l border-primary-orange p-3 w-full h-full">
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-lg font-semibold text-primary-orange mb-2">{titulo}</h2>
        <div className="flex flex-row gap-5 h-8 items-center justify-end">
          {pesquisa && <SearchDashboard />}
          {filtro && (
            <FilterTable
              titulo={tituloFiltro}
              FilterTableProps={filtroChildren}
            />
          )}
        </div>
      </div>

      {loading ? (
        <TabelaSkeleton />
      ) : (
        <div
          className={`overflow-y-auto ${alturaMax} pr-2 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800`}
        >
          <ul className="divide-y divide-gray-200/40 divide-dashed">
            <TabelaHeader
              colunas={colunas}
              temAcoes={acoes.length > 0}
              gridTemplateColumns={gridTemplateColumns}
            />
            {dados.map((item, i) => (
              <TabelaLinha
                key={i}
                colunas={colunas}
                item={item}
                acoes={acoes}
                gridTemplateColumns={gridTemplateColumns}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
