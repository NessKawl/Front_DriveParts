import NavBar from "../../components/navbar/NavBar";
import TituloProduto from "../../components/produto/TituloProduto";
import QuantidadeDisponivel from "../../components/produto/QuantidadeDisponivel"
import ImagemProduto from "../../components/produto/ImagemProduto";
import Preco from "../../components/produto/Preco";
import BotaoReserva from "../../components/produto/BotaoReserva";
import Informacoes from "../../components/produto/Informacoes";
import { useNavigate } from "react-router-dom"


export default function DetalheProduto() {
  const navigate = useNavigate();

  return (

    <div className="min-h-screen bg-ice flex flex-col">
      <div>
        <NavBar />
      </div>

      <main className="m-5 md:mx-10 lg:mx-20 xl:mx-40 flex-1">

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10 ">
        
          <div className="flex flex-row-reverse md:mt-5 md:col-start-2 lg:col-start-2 md:row-start-1 self-start md:mr-6">
            <QuantidadeDisponivel />
          </div>

          {/*my-3 md:m-1 lg:col-start-1 md:row-span-5 lg:max-h-[400px] lg:w-full  */}
          <div className="my-3 md:m-1 lg:col-start-1 md:row-span-5 lg:max-h-[500px] lg:w-full bg-white ">
            <ImagemProduto />
          </div>

          <div className=" md:mt-5 md:col-start-2 md:row-start-2  md:mr-6">
            <TituloProduto />
          </div>

          <div className="mt-5 md:mt-10 lg:mt-15 xl:mt-25 md:col-start-2 md:row-start-3  md:mr-6">
            <Preco />
          </div>

          <div className="mt-5 flex justify-center md:col-start-2 md:row-start-5 md:mb-10">
            <BotaoReserva  onClick={() => navigate("/reserva")}/>
          </div>

        </div>

        <hr className="mt-8" />

        <div className="mt-5 ">
          <Informacoes />
        </div>

      </main>
    </div>
  );
}