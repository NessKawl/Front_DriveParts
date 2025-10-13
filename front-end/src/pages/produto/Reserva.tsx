import NavBar from "../../components/navbar/NavBar";
import TituloProduto from "../../components/produto/TituloProduto";
import InputQtd from "../../components/reserva/InputQtd";
import SelecionarPeriodo from "../../components/reserva/SelecionarPeriodo";
import Total from "../../components/reserva/Total";
import Button from "../../components/buttons/Button";
import { useNavigate } from "react-router-dom";

export default function Reserva() {
  const navigate = useNavigate()
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

          <div className="mt-40">
            <Total />
          </div>

          <div className="py-20 flex justify-center items-center">
            <Button
              children="Reservar"
              className="rounded-4xl bg-primary-orange text-ice px-15 py-1"
              onClick={() => navigate("/catalogo")}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
