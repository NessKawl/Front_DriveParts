import { useLocation } from "react-router-dom";
import NavBar from "../components/navbar/NavBar";
import PesquisaGrid from "../components/cards/PesquisaGrid";
import FooterMain from "../components/footer/FooterMain";
import FilterTable from "../components/buttons/FilterTable";
import { useCallback, useEffect, useState } from "react";
import { BuscaProdutoPorCategoria, BuscaProdutoPorNome } from "../services/dataService";

interface Produto {
  pro_id: number;
  pro_nome: string;
  pro_valor: number;
  pro_marca?: string;
  pro_cod?: string;
  pro_status?: boolean;
  pro_caminho_img?: string;
}

interface FilterState {
  campo: 'pro_nome' | 'pro_valor' | null;
  direcao: 'asc' | 'desc' | null;
}

export default function Pesquisa() {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const produto = queryParams.get("produto")
  const categoria = queryParams.get("categoria");

  const [originalProducts, setOriginalProducts] = useState<Produto[]>([]);
  const [products, setProducts] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState<FilterState>({ campo: null, direcao: null });

  const sortProducts = useCallback((produtos: Produto[], currentFilter: FilterState) => {
    const { campo, direcao } = currentFilter;

    if (!campo || !direcao) {
      return [...produtos];
    }

    const sorted = [...produtos].sort((a, b) => {
      let valorA: string | number;
      let valorB: string | number;

      // Tratamento de tipos para ordenação
      if (campo === 'pro_nome') {
        valorA = a.pro_nome.toLowerCase();
        valorB = b.pro_nome.toLowerCase();
      } else if (campo === 'pro_valor') {
        valorA = a.pro_valor;
        valorB = b.pro_valor;
      } else {
        return 0;
      }

      if (valorA < valorB) {
        return direcao === 'asc' ? -1 : 1;
      }
      if (valorA > valorB) {
        return direcao === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, []);

  useEffect(() => {

    async function carregarProdutos() {
      if (!produto && !categoria) return;
      setLoading(true);

      try {
        let resultados: any = null;

        if (produto) {
          resultados = await BuscaProdutoPorNome(produto);
        }

        if (categoria) {
          resultados = await BuscaProdutoPorCategoria(categoria);
        }
        const fetchedProducts: Produto[] = resultados.data;

        // Armazena os produtos originais e aplica a ordenação atual
        setOriginalProducts(fetchedProducts);
        const sortedProducts = sortProducts(fetchedProducts, filter);
        setProducts(sortedProducts);
      } catch (error) {
        setOriginalProducts([]);
        setProducts([]);
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarProdutos();
  }, [produto, categoria, sortProducts, filter]);


  useEffect(() => {
    if (!loading && originalProducts.length > 0) {
      const sortedProducts = sortProducts(originalProducts, filter);
      setProducts(sortedProducts);
    }
  }, [filter, originalProducts, loading, sortProducts]);

  const handleFilterChange = (value: string) => {
    let newFilter: FilterState = { campo: null, direcao: null };

    switch (value) {
      case "a-z":
        newFilter = { campo: 'pro_nome', direcao: 'asc' };
        break;
      case "z-a":
        newFilter = { campo: 'pro_nome', direcao: 'desc' };
        break;
      case "menor":
        newFilter = { campo: 'pro_valor', direcao: 'asc' };
        break;
      case "maior":
        newFilter = { campo: 'pro_valor', direcao: 'desc' };
        break;
      default:
        newFilter = { campo: null, direcao: null };
        break;
    }
    setFilter(newFilter);
  };

  return (
    <div className="bg-ice min-h-screen">
      <div>
        <NavBar />
      </div>
      <main className="flex flex-1 flex-col justify-center">
        <div className="flex justify-between items-end w-full md:w-11/12 mt-5 border-b border-gray-300 pb-2 px-4 md:mx-10">
          <div>
            <p className="font-light text-md"> Resultados para: <span
              className="bg-gray-200 p-2 rounded-xl font-semibold text-lg md:text-xl max-w-[200px] md:max-w-[300px] truncate inline-block align-bottom"
            >
              {produto || categoria}
            </span>
            </p>
          </div>
          <FilterTable
            titulo="Filtrar por:"
            FilterTableProps={[
              { value: "a-z", children: "De A - Z" },
              { value: "z-a", children: "De Z - A" },
              { value: "menor", children: "Preço Menor" },
              { value: "maior", children: "Preço Maior" },
            ]}
            color="orange"
            onChange={handleFilterChange}
          />

        </div>
        <div>
          <PesquisaGrid
            products={products}
          />
        </div>
      </main>
      <footer>
        <FooterMain />
      </footer>
    </div>
  );
}