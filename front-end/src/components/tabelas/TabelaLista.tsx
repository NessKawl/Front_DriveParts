import { useEffect, useState } from "react";
import TabelaHeader from "./TabelaHeader";
import TabelaLinha from "./TabelaLinha";
import TabelaSkeleton from "./TabelaSkeleton";
import FilterTable from "../buttons/FilterTable";
import Search from "../inputs/Search";

interface Coluna {
  chave: string;
  titulo: string;
}

interface Acao {
  label: string;
  cor?: string;
  onClick?: (item: any) => void;
  link?: string;
}

interface Filtro {
  value: string;
  children: React.ReactNode
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
  acoes?: Acao[]; // 👈 coluna opcional com botões
}

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
  }, []);

  return (
    <div className="bg-black-smooth border-l border-primary-orange p-3 w-full h-full">
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-lg font-semibold text-primary-orange mb-2">{titulo}</h2>
        <div className="flex flex-row gap-5 h-8 items-center justify-end">
          {pesquisa && <Search />}
          {filtro &&
            <FilterTable
              titulo={tituloFiltro}
              FilterTableProps={filtroChildren}
            />
          }
        </div>
      </div>

      {loading ? (
        <TabelaSkeleton />
      ) : (
        <div
          className={`overflow-y-auto ${alturaMax} pr-2 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800`}
        >
          <ul className="divide-y divide-gray-200/40 divide-dashed">
            <TabelaHeader colunas={colunas} temAcoes={acoes.length > 0} />
            {dados.map((item, i) => (
              <TabelaLinha key={i} colunas={colunas} item={item} acoes={acoes} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
