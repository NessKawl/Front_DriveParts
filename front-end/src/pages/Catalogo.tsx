//import { useNavigate } from "react-router-dom"
import ProductsGrid from "../components/cards/ProductsGrid.tsx"
import FooterMain from "../components/footer/FooterMain.tsx"
import Banner from "../components/imagens/Banner.tsx"
import NavBar from "../components/navbar/NavBar.tsx"
export default function Catalogo() {
    //const navigate = useNavigate()
    return (
        <div className="bg-ice min-h-screen ">
            <aside >
                <NavBar />
            </aside>

            <main>
                <div className="w-full h-auto flex items-center justify-center mt-2">
                    <Banner />
                </div>
                <div className="mt-4 mx-4 border-b border-gray/10 pb-2 md:mx-10 ">
                    <h2 className="text-xl md:text-2xl font-bold text-black-smooth">Populares</h2>
                </div>
                <div className="md:mx-20 md:mt-10">
                    <ProductsGrid />
                </div>
            </main>
            <footer>
                <FooterMain />
            </footer>
        </div>
    )
}