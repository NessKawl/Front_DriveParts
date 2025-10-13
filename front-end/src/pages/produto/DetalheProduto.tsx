import NavBar from "../../components/navbar/NavBar";
import TituloProduto from "../../components/produto/TituloProduto";
import QuantidadeDisponivel from "../../components/produto/QuantidadeDisponivel"
import ImagemProduto from "../../components/produto/ImagemProduto";
import Preco from "../../components/produto/Preco";
import Informacoes from "../../components/produto/Informacoes";
import FooterMain from "../../components/footer/FooterMain";
import Button from "../../components/buttons/Button";
import { useNavigate } from "react-router-dom";



export default function DetalheProduto() {
  const navigate = useNavigate()
  return (

    <div className="min-h-screen bg-ice">
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
          <Button
            children="Reservar"
            className="rounded-4xl bg-primary-orange text-ice px-15 py-1"
            onClick={() => navigate("/reserva")}
          />
        </div>

        <hr className="mt-8" />

        <div className="mt-5">
          <Informacoes />
        </div>
      </div>
      <footer>
        <FooterMain/>
      </footer>


    </div>
  );
}