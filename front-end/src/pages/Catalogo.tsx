//import { useNavigate } from "react-router-dom"
import ProductsGrid from "../components/cards/ProductsGrid.tsx"
import InfiniteProductCarousel from "../components/carrosel/InfiniteProductCarousel.tsx"
import FooterMain from "../components/footer/FooterMain.tsx"
import Banner from "../components/imagens/Banner.tsx"
import NavBar from "../components/navbar/NavBar.tsx"


const products = [
  { id: 1, name: "1Capa de Banco", price: "R$ 79,90", image: "/produtos/capa.jpg" },
  { id: 2, name: "2Cheirinho", price: "R$ 19,90", image: "/produtos/cheirinho.jpg" },
  { id: 3, name: "3Tapete", price: "R$ 129,90", image: "/produtos/tapete.jpg" },
  { id: 4, name: "4Volante Esportivo", price: "R$ 249,90", image: "/produtos/volante.jpg" },
  { id: 5, name: "5Protetor de Cinto", price: "R$ 39,90", image: "/produtos/cinto.jpg" },
  { id: 6, name: "6Capa de Banco", price: "R$ 79,90", image: "/produtos/capa.jpg" },
  { id: 7, name: "7Cheirinho", price: "R$ 19,90", image: "/produtos/cheirinho.jpg" },
  { id: 8, name: "8Tapete", price: "R$ 129,90", image: "/produtos/tapete.jpg" },
  { id: 9, name: "9Volante Esportivo", price: "R$ 249,90", image: "/produtos/volante.jpg" },
  { id: 10, name:"10Protetor de Cinto", price: "R$ 39,90", image: "/produtos/cinto.jpg" },
];
const productsGridMaisVendidos = [
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
  ]
export default function Catalogo() {
    //const navigate = useNavigate()
    return (
        <div className="bg-ice min-h-screen ">
            <aside >
                <NavBar />
            </aside>

            <main className="w-full">
                <div className="w-full h-auto flex items-center justify-center mt-2 ">
                    <Banner />
                </div>
                <div >
                    <InfiniteProductCarousel products={products} speed={35} />
                </div>
                
                <div className="md:mt-10 mx-4 flex justify-center">
                    <ProductsGrid
                        title="Mais vendidos" 
                        tipo="catalogo"
                        products={productsGridMaisVendidos}
                    />
                </div>
            </main>
            <footer>
                <FooterMain />
            </footer>
        </div>
    )
}