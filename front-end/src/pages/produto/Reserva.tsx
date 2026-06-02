import NavBar from "../../components/navbar/NavBar";
import Button from "../../components/buttons/Button";
import { useNavigate, useSearchParams } from "react-router-dom"
import clsx from "clsx";
import { useEffect, useState } from "react";
import { criarReservaBackend } from "../../services/reservaService";
import { GetProdutosUuid } from "../../services/dataService";

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

  const uuid = searchParam.get("uuid")
  const [produto, setProduto] = useState<Produto | null>(null)

  const [modalSuccessOpen, setModalSuccessOpen] = useState(false);

  useEffect(() => {
    if (!uuid) {
      console.error("UUID inválido");
      return;
    }

    const fetchProdutos = async () => {
      const data = await GetProdutosUuid(uuid);

      setProduto(data as Produto);
      // Se o serviço retornou { data: null } ou algo inesperado
      if (!data) {
        setProduto(null);
        console.error("Dados do produto vieram vazios ou nulos da API.");
      }
    }
    fetchProdutos()
  }, [uuid])

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
    <div className="min-h-screen bg-white flex flex-col text-black">
      <NavBar />
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <h2 className="text-xl sm:text-2xl font-bold text-black tracking-wider mb-4">RESERVA</h2>
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-ice border border-ice/50 rounded-xl shadow-2xl p-6 md:p-8 min-h-[500px] md:min-h-[600px] flex flex-col transition-all duration-200 hover:border-ice">
          <form className="flex-1 flex flex-col space-y-8">
            <div className="flex flex-row items-start border-b border-ice/50 pb-6 gap-4">
              {pro_caminho_img && (
                <img src={pro_caminho_img} alt={pro_nome} className="w-32 h-32 md:w-40 md:h-40 object-contain rounded-lg bg-ice/50 border border-black-smooth" />
              )}
              <div className="flex-1">
                <p className="font-bold text-lg lg:text-xl text-black tracking-tight leading-snug">{pro_nome}</p>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Produto Selecionado</p>
              </div>
            </div>
            
            <div className="flex flex-row items-center gap-3">
              <label className="text-lg font-semibold text-black" htmlFor="quantidade">Selecione a quantidade:</label>
              <div className="relative">
                <select
                  name="quantidade"
                  id="quantidade"
                  value={slecionaQuantidade}
                  onChange={handleChange}
                  className="bg-ice border-black-smooth text-black font-bold px-4 py-2 rounded-lg outline-none cursor-pointer focus:ring-1 focus:ring-[#FF961F] transition duration-200 text-lg"
                >
                  {Array(produto.estoque).fill(0).map((_, index) => (
                    <option key={index + 1} className="font-semibold text-black bg-ice border-black-smooth" value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-lg font-semibold text-black" htmlFor="periodo">Selecione o período:</label>
              <div className="flex flex-row justify-center items-center gap-4 mt-3">
                <Button
                  children="MANHÃ"
                  type="button"
                  onClick={() => setSelecionarPeriodo("MANHA")}
                  className={clsx(
                    "w-full p-4 rounded-lg font-bold text-xs tracking-wider transition-all duration-300 border",
                    selecionarPeriodo === "MANHA"
                      ? "bg-[#FF961F] border-[#FF961F] text-black shadow-lg shadow-[#FF961F]/20"
                      : "bg-ice border-black-smooth text-black hover:border-primary-orange hover:text-primary-orange"
                  )}
                />
                <Button
                  children="TARDE"
                  type="button"
                  onClick={() => setSelecionarPeriodo("TARDE")}
                  className={clsx(
                    "w-full p-4 rounded-lg font-bold text-xs tracking-wider transition-all duration-300 border",
                    selecionarPeriodo === "TARDE"
                      ? "bg-[#FF961F] border-[#FF961F] text-black shadow-lg shadow-[#FF961F]/20"
                      : "bg-ice border-black-smooth text-black hover:border-primary-orange hover:text-primary-orange"
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total</span>
              <div className="border-t border-[#1A1A1A] pt-2 flex flex-row items-baseline gap-2">
                <p className="text-2xl sm:text-3xl font-bold text-[#FF961F] font-mono">
                  R$ {precoTotal.toFixed(2).replace(".", ",")}
                </p>
              </div>
            </div>

            <div className="mt-auto pt-4">
              <Button
                children="Reservar"
                type="button"
                className="w-full text-base font-bold bg-[#369638] hover:bg-green-600 text-white py-3 rounded-lg transition-all duration-300 shadow-lg shadow-green-900/20"
                onClick={async () => {
                  if (!selecionarPeriodo) {
                    alert("Selecione um período antes de continuar.");
                    return;
                  }

                  try {
                    await criarReservaBackend(
                      uuid!,
                      slecionaQuantidade,
                      selecionarPeriodo
                    );
                    setModalSuccessOpen(true);
                  } catch (err: any) {
                    alert("erro: " + (err.response?.data?.message || "Erro ao criar reserva"));
                  }
                }}
              />
            </div>
          </form>
        </div>
      </div>

      {modalSuccessOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <div className="bg-ice border-black-smooth rounded-xl p-6 max-w-sm w-full flex flex-col items-center shadow-2xl">
            <h2 className="text-xl text-[#FF961F] font-bold mb-3 tracking-tight">Reserva Criada!</h2>
            <p className="text-gray-400 text-center text-sm mb-5 leading-relaxed">
              Você reservou <span className="text-black font-semibold">{slecionaQuantidade}</span> unidade(s) de <span className="text-black font-semibold">{pro_nome}</span>.
            </p>
            <button
              onClick={() => navigate("/catalogo")}
              className="w-full py-2 bg-[#FF961F] hover:bg-orange-500 text-black font-bold rounded-lg transition-all duration-300 text-sm shadow-md"
            >
              Voltar para o Catálogo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
