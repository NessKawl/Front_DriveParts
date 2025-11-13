import NavBar from "../../components/navbar/NavBar";
import Button from "../../components/buttons/Button";
import { useNavigate } from "react-router-dom"
import clsx from "clsx";
import { useState } from "react";
import { criarReservaBackend } from "../../services/reservaService";


export default function Reserva() {
  const navigate = useNavigate();
  const [selecionarPeriodo, setSelecionarPeriodo] = useState<"MANHA" | "TARDE" >();
  const [slecionaQuantidade, setSelecionarQuantidade] = useState<number>(1);
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
    ],
    quantidade: 10
  }
  const parcelas = informacoes.preco / 3;
  const precoTotal = informacoes.preco * slecionaQuantidade;
  const clacularparcelasTotal = parcelas * slecionaQuantidade;
  const total = () => `R$ ${precoTotal.toFixed(2)}`
  const parcelasTotal = () => `ou 3x de R$ ${clacularparcelasTotal.toFixed(2)} sem juros`
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelecionarQuantidade(Number(e.target.value))
  }


  return (
    <div className="min-h-screen bg-ice flex flex-col">
      <NavBar />
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <h2 className="text-lg sm:text-2xl font-bold text-black-smooth mb-2">RESERVA</h2>
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-white rounded-lg shadow-md p-6 md:p-8 min-h-[500px] md:min-h-[600px] flex flex-col">
          <form className="flex-1 flex flex-col space-y-8">
            <div className="flex flex-row items-start border-b border-b-gray-300 pb-4">
              <img src={informacoes.imagensProduto[0]} alt={informacoes.nome} className="w-32 h-32 md:w-48 md:h-48" />
              <p className="font-bold text-base lg:text-2xl">{informacoes.nome}</p>
            </div>
            <div className="flex flex-row items-end gap-2 ">
              <label className="text-lg sm:text-xl font-semibold text-black-smooth" htmlFor="">Selecione a quantidade:</label>
              <select
                name="quantidade"
                id=""
                value={slecionaQuantidade}
                onChange={handleChange}
                className=" bg-primary-orange text-black-smooth font-bold px-4 py-2 rounded-md sm:rounded-none sm:w-42 outline-none border-none cursor-pointer focus:ring-2 focus:ring-white transition duration-200">
                {Array(informacoes.quantidade).fill(0).map((_, index) => (<option className="font-semibold text-black-smooth bg-ice" value={index + 1}>{index + 1}</option>))}
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
                <p className="text-lg sm:text-3xl font-bold text-black-smooth">{total()}</p>
                <p className="text-sm sm:text-xl  text-black-smooth">{parcelasTotal()}</p>
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
                      const resultado = await criarReservaBackend(17, slecionaQuantidade, selecionarPeriodo);
                      alert(`Reserva criada com sucesso! ID: ${resultado.ven_id}`);
                      navigate("/catalogo"); 
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
    </div>
  );
}
