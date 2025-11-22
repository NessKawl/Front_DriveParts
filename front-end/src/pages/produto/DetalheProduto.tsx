import NavBar from "../../components/navbar/NavBar";
import FooterMain from "../../components/footer/FooterMain";
import Button from "../../components/buttons/Button";
import { useNavigate, useSearchParams } from "react-router-dom"
// import ProductCarousel from "../../components/carrosel/ProductCarousel";
import ProductsGridReco from "../../components/cards/ProductsGridReco";
import { useEffect, useState } from "react";
import { GetProdutosId } from "../../services/dataService";
import { isAuthenticated } from "../../utils/auth";
import Modal from "../../components/modal/Modal";

interface Especificacao {
  nome: string;
  valor: string;
  unidade: string;
}

interface Produto {
  pro_nome: string;
  pro_valor: number;
  pro_marca?: string;
  pro_cod?: string;
  pro_status?: boolean;
  pro_caminho_img?: string;
  estoque?: number;
  especificacoes?: Especificacao[];
}

export default function DetalheProduto() {
  const navigate = useNavigate();

  const [searchParam] = useSearchParams();
  const pro_id = searchParam.get("id")
  const [produtos, setProdutos] = useState<Produto | null>(null)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    message: "",
    actionText: "",
    action: () => { }
  });

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

  const abrirModal = (data: typeof modalData) => {
    setModalData(data);
    setModalOpen(true);
  };

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

          <div className="flex justify-center items-center my-3 md:m-1 lg:col-start-1 md:row-span-5 h-auto  bg-white ">
            <img src={pro_caminho_img} alt="" className="" />
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
              onClick={() => {
                if (quantidade === 0) {
                  abrirModal({
                    title: "Produto indisponível",
                    message: "Este produto está sem estoque no momento. Tente novamente mais tarde.",
                    actionText: "Entendi",
                    action: () => setModalOpen(false)
                  });
                  return;
                }

                if (!isAuthenticated()) {
                  abrirModal({
                    title: "Você não está logado",
                    message: "Para realizar uma reserva é necessário estefetuar login.",
                    actionText: "Realizar Login",
                    action: () => {
                      setModalOpen(false);
                      navigate(`/login?redirect=/reserva?id=${pro_id}`)
                    }
                  });
                  return;
                }
                navigate(`/reserva?id=${pro_id}`);
              }}
            />
          </div>

          <Modal
            isOpen={modalOpen}
            title={modalData.title}
            message={modalData.message}
            actionText={modalData.actionText}
            onClose={() => setModalOpen(false)}
            onAction={modalData.action}
          />
        </div>

        <hr className="mt-8" />

        <div className="mt-10 ">
          <p className="font-bold text-2xl lg:text-3xl ">Detalhes do Produto</p>
          <div className="mt-6 bg-white rounded-lg border border-rounded-lg border-gray-300 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <tbody>
                {produtos.especificacoes?.map((esp, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                  >
                    <td className="px-4 py-3 font-medium text-gray-700">
                      {esp.nome}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {esp.valor} {esp.unidade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


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
