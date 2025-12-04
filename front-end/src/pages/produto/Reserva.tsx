import NavBar from "../../components/navbar/NavBar";
import Button from "../../components/buttons/Button";
import { useNavigate, useSearchParams } from "react-router-dom"
import clsx from "clsx";
import { useEffect, useState } from "react";
import { criarReservaBackend } from "../../services/reservaService";
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

export default function Reserva() {
  const navigate = useNavigate();
  const [selecionarPeriodo, setSelecionarPeriodo] = useState<"MANHA" | "TARDE">();
  const [slecionaQuantidade, setSelecionarQuantidade] = useState<number>(1);

  const [searchParam] = useSearchParams();

  const pro_id = searchParam.get("id");
  const [produto, setProduto] = useState<Produto | null>(null)

  const [modalSuccessOpen, setModalSuccessOpen] = useState(false);

  useEffect(() => {
    if (!pro_id) return

    const produtoIdNumber = parseInt(pro_id);

    if (isNaN(produtoIdNumber)) {
      console.error("ID do produto na URL não é um número válido.");
      return;
    }

    const fetchProdutos = async () => {
      const response = await GetProdutosId(produtoIdNumber)
      if (response && response.data) {
        setProduto(response.data as Produto)
      } else {
        setProduto(null)
        console.error("Dados do produto vieram vazios ou nulos da API")
      }
    }
    fetchProdutos()
  }, [pro_id])

  if (!produto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando produto...</p>
      </div>
    )
  }

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelecionarQuantidade(Number(e.target.value))
  }

  const { pro_caminho_img, pro_nome, pro_valor } = produto;
  const precoTotal = pro_valor * slecionaQuantidade;


  return (
    <div className="min-h-screen bg-ice flex flex-col">
      <NavBar />
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <h2 className="text-lg sm:text-2xl font-bold text-black-smooth mb-2">RESERVA</h2>
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-white rounded-lg shadow-md p-6 md:p-8 min-h-[500px] md:min-h-[600px] flex flex-col">
          <form className="flex-1 flex flex-col space-y-8">
            <div className="flex flex-row items-start border-b border-b-gray-300 pb-4">
              <img src={pro_caminho_img} alt={pro_nome} className="w-32 h-32 md:w-48 md:h-48" />
              <p className="font-bold text-base lg:text-2xl">{pro_nome}</p>
            </div>
            <div className="flex flex-row items-end gap-2 ">
              <label className="text-lg sm:text-xl font-semibold text-black-smooth" htmlFor="">Selecione a quantidade:</label>
              <select
                name="quantidade"
                id=""
                value={slecionaQuantidade}
                onChange={handleChange}
                className=" bg-primary-orange text-black-smooth font-bold px-4 py-2 rounded-md sm:rounded-none sm:w-42 outline-none border-none cursor-pointer focus:ring-2 focus:ring-white transition duration-200">
                {Array(produto.estoque).fill(0).map((_, index) => (<option className="font-semibold text-black-smooth bg-ice" value={index + 1}>{index + 1}</option>))}
              </select>
            </div>

            <div className="mt-5">
              <label className="text-lg sm:text-xl font-semibold text-black-smooth" htmlFor="">Selecione o periodo:</label>
              <div className="flex flex-row justify-center items-center gap-5 m-5">
                <Button
                  children="MANHÃ"
                  type="button"
                  onClick={() => setSelecionarPeriodo("MANHA")}
                  className={clsx("rounded-xl bg-primary-orange px-10 py-1 lg:px-25 lg:py-2 text-black-smooth font-bold sm:rounded-none",
                    selecionarPeriodo === "TARDE" ? "bg-primary-orange/50 text-black-smooth/50" : "bg-primary-orange "
                  )}
                />
                <Button
                  children="TARDE"
                  type="button"
                  onClick={() => setSelecionarPeriodo("TARDE")}
                  className={clsx("rounded-xl bg-primary-orange px-10 py-1 lg:px-25 lg:py-2 text-black-smooth font-bold sm:rounded-none",
                    selecionarPeriodo === "MANHA" ? "bg-primary-orange/50 text-black-smooth/50" : "bg-primary-orange "
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col ">
              <h3>Total:</h3>
              <div className="border-t border-t-black-smooth flex flex-row items-end gap-2" >
                <p className="text-lg sm:text-3xl font-bold text-black-smooth">  R$ {precoTotal.toFixed(2).replace(".", ",")}
                </p>
                {/* <p className="text-sm sm:text-xl  text-black-smooth">{parcelasTotal()}</p> */}
              </div>
            </div>
            <div className="mt-auto flex flex-col space-y-4 pt-4">
              <div className="flex justify-center">
                <Button
                  children="Reservar"
                  type="button"
                  className="rounded-xl text-2xl font-semibold bg-pear-green px-15 py-1 lg:px-25 lg:py-2 text-ice sm:rounded-none"
                  onClick={async () => {
                    if (!selecionarPeriodo) {
                      alert("Selecione um período antes de continuar.");
                      return;
                    }

                    try {
                      const produtoIdNumber = Number(pro_id)

                      const resultado = await criarReservaBackend(produtoIdNumber, slecionaQuantidade, selecionarPeriodo);
                      setModalSuccessOpen(true);
                    } catch (err: any) {
                      alert(err.response?.data?.message || "Erro ao criar reserva");
                    }
                  }}
                />


              </div>
            </div>
          </form>
        </div>
      </div>
      {modalSuccessOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full flex flex-col items-center">
            <h2 className="text-2xl text-primary-orange font-semibold mb-4">Reserva Criada com Sucesso!</h2>
            <p className="text-gray-600 font-semibold">Você reservou {slecionaQuantidade} unidades do produto {pro_nome}</p>
            <button
              onClick={() => navigate("/catalogo")}
              className="mt-4 px-4 py-2 bg-primary-orange text-white rounded-md hover:bg-primary-orange/80 hover:shadow-lg hover:shadow-primary-orange/40 hover:scale-105 transition-transform duration-300
              sm:rounded-none"
            >Voltar para o Catalogo</button>
          </div>
        </div>
      )}
    </div>
  );
}
