import NavBar from "../../components/navbar/NavBar";
import FooterMain from "../../components/footer/FooterMain";
import Button from "../../components/buttons/Button";
import { useNavigate, useSearchParams } from "react-router-dom"
// import ProductCarousel from "../../components/carrosel/ProductCarousel";
import ProductsGridReco from "../../components/cards/ProductsGridReco";
import { useEffect, useState } from "react";
import { GetProdutosId } from "../../services/dataService";


interface Produto {
  pro_nome: string;
  pro_valor: number;
  pro_marca?: string;
  pro_cod?: string;
  pro_status?: boolean;
  pro_caminho_img?: string;
  estoque?: number;
}


export default function DetalheProduto() {
  const navigate = useNavigate();

  const [searchParam] = useSearchParams();

  const pro_id = searchParam.get("id")
  const [produtos, setProdutos] = useState<Produto | null>(null)

  useEffect(() => {

    if (!pro_id) return

    const produtoIdNumber = parseInt(pro_id);

    if (isNaN(produtoIdNumber)) {
      console.error("ID do produto na URL não é um número válido.");
      return;
    }

    const fetchProdutos = async () => {
      const response = await GetProdutosId(produtoIdNumber);
      if (response && response.data) {
        setProdutos(response.data as Produto);
      } else {
        // Se o serviço retornou { data: null } ou algo inesperado
        setProdutos(null);
        console.error("Dados do produto vieram vazios ou nulos da API.");
      }
    };
    fetchProdutos();
  }, [pro_id]);

  if (!produtos) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando detalhes do produto...</p>
      </div>
    );
  }

  const { pro_caminho_img, pro_nome, pro_valor } = produtos;

  const quantidade = produtos.estoque ?? 0;

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

          {/* <div className="my-3 md:m-1 lg:col-start-1 md:row-span-5 lg:max-w-[500px] lg:max-h-[500px]  bg-white ">
            <ProductCarousel images={pro_caminho_img} />
          </div> */}

          <div className="my-3 md:m-1 lg:col-start-1 md:row-span-5 lg:max-w-[500px] lg:max-h-[500px]  bg-white ">
            <img src={pro_caminho_img} alt="" />
          </div>

          <div className=" md:mt-5 md:col-start-2 md:row-start-2  md:mr-6">
            <p className="font-bold text-xl lg:text-3xl">
              {pro_nome}
            </p>
          </div>

          <div className="mt-5 md:mt-10 lg:mt-15 xl:mt-25 md:col-start-2 md:row-start-3  md:mr-6">
            <p className="font-bold text-3xl lg:text-5xl text-pear-green">
              {pro_valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            {/* <p className="font-light">
              {informacoes.parcelas()}
            </p> */}
          </div>

          <div className="mt-5 flex justify-center md:col-start-2 md:row-start-5 md:mb-10">
            <Button
              children="Reservar"
              className="rounded-lg text-xl font-semibold bg-primary-orange px-15 py-1 lg:px-25 lg:py-2 text-ice sm:rounded-none"
              onClick={() => navigate(`/reserva?id=${pro_id}`)}
            />
          </div>

        </div>

        <hr className="mt-8" />

        <div className="mt-10 ">
          <p className="font-bold text-2xl lg:text-3xl ">Detalhes do Produto</p>
          {/* <p className="mt-5 sm:text-lg lg:text-xl  text-black-smooth ">
            {informacoes.detalhes.map((detalhe, index) => (<li className="bg-white border-b border-ice list-none p-2" key={index}>{detalhe}</li>))}
          </p> */}
        </div>
        <div className="mt-10">
          <h1 className="text-2xl font-semibold border-b border-gray-300">Recomendados</h1>
          <ProductsGridReco />
        </div>
      </main>
      <footer>
        <FooterMain />
      </footer>
    </div>
  );
}
