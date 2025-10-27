import ProductCard from "./CardProduto"
import FilterTable from "../buttons/FilterTable"


interface Filtro {
  value: string;
  children: React.ReactNode
}
interface GridProps {
  title: string
  filtro?: boolean;
  tituloFiltro?: string;
  filtroChildren?: Filtro[];
  tipo?: "catalogo" | "historico" | "reservasAtivas"
}
export default function ProductsGrid({ title, filtro, tituloFiltro, filtroChildren, tipo = "catalogo", }: GridProps) {
  const products = [
    {
      image: "/produtos/pneu.png",
      name: "Pneu Aro 13 Goodyear 165/70R13 Assurance Maxlife 83T",
      price: "R$ 424,90",
      parcelas: "ou 6x de R$ 70,82 sem juros",
    },
    {
      image: "/produtos/oleo.png",
      name: "ÓLEO DE MOTOR - LUBRAX MINERAL DIESEL 15W40 (1 LITRO)",
      price: "R$ 35,90",
    },
    {
      image: "/produtos/cabecote.png",
      name: "JUNTA CABECOTE (5 PICS) - AMIANTO - L200 GL/ GLS - AJUSA - AJU10070330",
      price: "R$ 308,34",
      parcelas: "ou 6x de R$ 51,39",
    },
    {
      image: "/produtos/cabecote.png",
      name: "JUNTA CABECOTE - HISTÓRICO",
      reserva: "Reservado em 20/10/2025",
    },
    {
      image: "/produtos/cabecote.png",
      name: "JUNTA CABECOTE - ATIVA",
      praso: "Reservado até as 18:00 de 13/10/2025",
    },
  ]

  // 🔍 Filtro baseado no tipo de grid
  const filteredProducts = products.filter((product) => {
    if (tipo === "catalogo") return product.price
    if (tipo === "historico") return product.reserva
    if (tipo === "reservasAtivas") return product.praso
    return true
  })

  return (
    <div>
      <div className="flex flex-row justify-between items-center px-2 border-b border-gray-300 mb-4">
        <h1 className="text-black-smooth text-3xl font-semibold">
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
          />
        ))}
      </div>
    </div>

  )
}
