import ProductCard from "./CardProduto"
import FilterTable from "../buttons/FilterTable"


interface Filtro {
  value: string;
  children: React.ReactNode
}

interface Product {
  image: string;
  name: string;
  price?: string;
  parcelas?: string;
  praso?: string;
  reserva?: string;
  status?: string;
  id: number;
}
interface GridProps {
  title: string
  products: Product[];
  filtro?: boolean;
  tituloFiltro?: string;
  filtroChildren?: Filtro[];
  tipo?: "catalogo" | "historico" | "reservasAtivas"
}
export default function ProductsGrid({ title, filtro, tituloFiltro, filtroChildren, tipo = "catalogo", products }: GridProps) {
  

  // 🔍 Filtro baseado no tipo de grid
  const filteredProducts = products.filter((product) => {
    if (tipo === "catalogo") return product.price
    if (tipo === "historico") return product.reserva && product.status
    if (tipo === "reservasAtivas") return product.praso
    return true
  })

  return (
    <div>
      <div className="flex flex-row justify-between items-center px-2 border-b border-gray-300 mb-4">
        <h1 className="text-black-smooth text-xl md:text-3xl font-semibold">
          {title}
        </h1>
        {filtro &&
          <FilterTable
            titulo={tituloFiltro}
            FilterTableProps={filtroChildren}
            color="orange"
          />
        }
      </div>
      <div className="p-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-2 sm:gap-6 md:gap-10">
        {filteredProducts.map((product, index) => (
          <ProductCard
            key={index}
            image={product.image}
            name={product.name}
            price={product.price}
            parcelas={product.parcelas}
            praso={product.praso}
            reserva={product.reserva}
            status={product.status}
            id={product.id}
          />
        ))}
      </div>
    </div>

  )
}
