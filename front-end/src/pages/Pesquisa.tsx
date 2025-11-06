import { useLocation } from "react-router-dom";
import Filter from "../components/buttons/Filter";
import NavBar from "../components/navbar/NavBar";
import PesquisaGrid from "../components/cards/PesquisaGrid";
import FooterMain from "../components/footer/FooterMain";

export default function Pesquisa() {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const produto = queryParams.get("produto")
  const categoria = queryParams.get("categoria");
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
      price: "R$ 308,34",
      parcelas: "ou 6x de R$ 51,39",
    },
    {
      image: "/produtos/cabecote.png",
      name: "JUNTA CABECOTE - ATIVA",
      price: "R$ 308,34",
      parcelas: "ou 6x de R$ 51,39",
    },
  ]
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
          <Filter />
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