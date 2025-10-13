import NavBar from "../../components/navbar/NavBar";
import TituloProduto from "../../components/produto/TituloProduto";
import InputQtd from "../../components/reserva/InputQtd";
import SelecionarPeriodo from "../../components/reserva/SelecionarPeriodo";
import Total from "../../components/reserva/Total";
import Button from "../../components/buttons/Button";
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
                <Button
                  children="Reservar"
                  className="rounded-4xl bg-primary-orange px-15 py-1 lg:px-25 lg:py-2 text-ice"
                  onClick={() => navigate("/catalogo")}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
