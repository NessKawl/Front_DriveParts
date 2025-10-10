import NavBar from "../../components/navbar/NavBar";
import TituloProduto from "../../components/produto/TituloProduto";
import InputQtd from "../../components/reserva/InputQtd";
import SelecionarPeriodo from "../../components/reserva/SelecionarPeriodo";
import Total from "../../components/reserva/Total";
import BotaoReserva from "../../components/produto/BotaoReserva";

export default function Reserva() {
  return (
    <div className="min-h-screen bg-ice">
      <NavBar />

      <div className="m-5">
        <form>
          <div className="mt-15">
            <TituloProduto />
          </div>

          <div className="mt-5">
            <InputQtd />
          </div>

          <div className="mt-10">
            <SelecionarPeriodo />
          </div>

          <div className="mt-50">
            <Total />
          </div>

          <div className="mt-20 flex justify-center">
            <BotaoReserva />
          </div>
        </form>
      </div>
    </div>
  );
}
