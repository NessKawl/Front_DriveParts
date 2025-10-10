//import { useNavigate } from "react-router-dom"
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

            </main>
        </div>
    )
}