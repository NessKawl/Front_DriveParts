import { useEffect, useState } from "react";
import TabelaHeader from "./TabelaHeader";
import TabelaLinha from "./TabelaLinha";
import TabelaSkeleton from "./TabelaSkeleton";

interface Coluna {
  chave: string;
  titulo: string;
}

interface TabelaListaProps {
  titulo: string;
  colunas: Coluna[];
  fetchData: () => Promise<any[]>;
  alturaMax?: string; // ex: "h-64" ou "max-h-80"
}

export default function TabelaLista({
  titulo,
  colunas,
  fetchData,
  alturaMax = "max-h-80", // altura padrão
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
      <h2 className="text-lg font-semibold  text-primary-orange">{titulo}</h2>

      {loading ? (
        <TabelaSkeleton />
      ) : (
        <div
          className={`overflow-y-auto ${alturaMax} pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500`}
        >
          <ul className="divide-y divide-gray-200/40 divide-dashed">
            <TabelaHeader colunas={colunas} />
            {dados.map((item, i) => (
              <TabelaLinha key={i} colunas={colunas} item={item} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
