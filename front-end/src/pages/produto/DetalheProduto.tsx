import NavBar from "../../components/navbar/NavBar";
import FooterMain from "../../components/footer/FooterMain";
import Button from "../../components/buttons/Button";
import { useNavigate } from "react-router-dom"
import ProductCarousel from "../../components/carrosel/ProductCarousel";


export default function DetalheProduto() {
  const navigate = useNavigate();

  const informacoes = {
    imagensProduto: [
      "/produtos/pneu.png",
      "/produtos/oleo.png",
      "/produtos/cabecote.png",
    ],
    nome: "Pneu Goodyear Direction Touring 2 185/70 R14 88H",
    preco: 424.90,
    parcelas: () => `ou 3x de R$ ${parcelas.toFixed(2)} sem juros`,
    detalhes: [
      "Marca: Goodyear",
      "Modelo: Kelly Edge",
      "Índice de carga: 88",
      "Velocidade máxima: 210 km/h",
      "Design da banda de rodagem simétrico"
    ]
  }
  const parcelas = informacoes.preco / 3;

  const quantidade = 10;

  return (

    <div className="min-h-screen bg-ice flex flex-col">
      <div>
        <NavBar />
      </div>

      <main className="m-5 md:mx-10 lg:mx-20 xl:mx-40 flex-1">

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10 ">

          <div className="flex flex-row-reverse md:mt-5 md:col-start-2 lg:col-start-2 md:row-start-1 self-start md:mr-6">
            <div className="rounded-xl bg-black-smooth/20 px-2 py-1">
              <p className="text-xs">{quantidade} produtos disponiveis</p>
            </div>
          </div>

          <div className="my-3 md:m-1 lg:col-start-1 md:row-span-5 lg:max-w-[500px] lg:max-h-[500px]  bg-white ">
            <ProductCarousel images={informacoes.imagensProduto} />
          </div>

          <div className=" md:mt-5 md:col-start-2 md:row-start-2  md:mr-6">
            <p className="font-bold text-base lg:text-2xl">
              {informacoes.nome}
            </p>
          </div>

          <div className="mt-5 md:mt-10 lg:mt-15 xl:mt-25 md:col-start-2 md:row-start-3  md:mr-6">
            <p className="font-bold text-3xl lg:text-5xl text-pear-green">
              {informacoes.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <p className="font-light">
              {informacoes.parcelas()}
            </p>
          </div>

          <div className="mt-5 flex justify-center md:col-start-2 md:row-start-5 md:mb-10">
            <Button
              children="Reservar"
              className="rounded-lg text-xl font-semibold bg-primary-orange px-15 py-1 lg:px-25 lg:py-2 text-ice sm:rounded-none"
              onClick={() => navigate(`/reserva?produto=${informacoes.nome}`)}
            />
          </div>

        </div>

        <hr className="mt-8" />

        <div className="mt-10 ">
          <p className="font-bold text-2xl lg:text-3xl ">Detalhes do Produto</p>
          <p className="mt-5 sm:text-lg lg:text-xl  text-black-smooth ">
            {informacoes.detalhes.map((detalhe, index) =>  (<li className="bg-white border-b border-ice list-none p-2" key={index}>{detalhe}</li>))}
          </p>
        </div>

      </main>

      <footer>
        <FooterMain />
      </footer>
    </div>
  );
}
