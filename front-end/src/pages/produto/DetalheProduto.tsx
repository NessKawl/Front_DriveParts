import NavBar from "../../components/navbar/NavBar";
import TituloProduto from "../../components/produto/TituloProduto";
import QuantidadeDisponivel from "../../components/produto/QuantidadeDisponivel"
import ImagemProduto from "../../components/produto/ImagemProduto";
import Preco from "../../components/produto/Preco";
import BotaoReserva from "../../components/produto/BotaoReserva";
import Informacoes from "../../components/produto/Informacoes";



export default function Reserva() {
  return (

    <div className="">
      <div>
        <NavBar />
      </div>

      <div className="m-5 row">

        <div className=" flex flex-row-reverse">
          <QuantidadeDisponivel />
        </div>

        <div className="mt-3">
          <ImagemProduto />
        </div>

        <div className="mt-3">
          <TituloProduto />
        </div>

        <div className="mt-3">
          <Preco />
        </div>

        <div className="mt-5 flex justify-center">
          <BotaoReserva />
        </div>

        <hr className="mt-8"/>

        <div className="mt-5">
          <Informacoes />
        </div>
      </div>


    </div>
  );
}