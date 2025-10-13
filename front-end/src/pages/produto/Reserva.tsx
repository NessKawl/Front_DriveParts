import NavBar from "../../components/navbar/NavBar";
import TituloProduto from "../../components/produto/TituloProduto";
import InputQtd from "../../components/reserva/InputQtd";
import SelecionarPeriodo from "../../components/reserva/SelecionarPeriodo";
import Total from "../../components/reserva/Total";
import BotaoReserva from "../../components/produto/BotaoReserva";
import { useNavigate } from "react-router-dom"

export default function Reserva() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ice flex flex-col">
      <NavBar />

      <div className="flex-1 flex justify-center p-4">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-white rounded-lg shadow-md p-6 md:p-8 min-h-[500px] md:min-h-[600px] flex flex-col">
          <form className="flex-1 flex flex-col space-y-8">
            <div className="">
              <TituloProduto />
            </div>

            <div className="mt-5">
              <InputQtd />
            </div>

            <div className="mt-5">
              <SelecionarPeriodo />
            </div>

            <div className="mt-auto flex flex-col space-y-4 pt-4">
              <div className="w-full">
                <Total />
              </div>

              <div className="flex justify-center">
                <BotaoReserva onClick={() => navigate("/catalogo")} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
