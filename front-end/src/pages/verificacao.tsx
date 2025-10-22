import NavBarSimples from "../components/navbar/NavbarSimples";
import { useNavigate } from "react-router-dom"
import Button from "../components/buttons/Button"
import InputLabel from "../components/inputs/InputLabel";
//import FooterMain from "../components/footer/FooterMain"

export default function Verificacao() {
  const navigate = useNavigate()

  return (
    <div className="bg-ice h-screen">
      <NavBarSimples rota={"cadastro"} />
      <div className="flex flex-col justify-center items-center mt-6">
        <h1 className="text-xl font-bold flex justify-center items-center mb-4">Verificação de Segurança</h1>
        <div className="bg-white flex flex-col justify-between items-center p-10 rounded-2xl sm:rounded-none w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12">
          <p className="font-medium text-lg mb-6">Para proteger sua conta, enviamos um código de verificação para o número cadastrado</p>
          <h2 className="font-light text-start w-full mb-2">Código de verificação</h2>
          <div className="w-full sm:w-10/12 flex flex-row justify-center items-center gap-3">
            {Array(5).fill(0).map((_, index) => (
              <InputLabel
                key={index}
                id={`code-${index}`}
                type="number"
                classNameINPUT="appearance-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none w-10 h-12 sm:w-18 sm:h-16 border border-gray-300 rounded-lg text-2xl text-center focus:border-primary-orange focus:outline-none"
              />
            ))}
          </div>
          <p className="w-full text-end font-semibold mb-8">Reenviar código</p>
          <Button
            onClick={() => navigate("/login")}
            children="Verificar"
            className="bg-pear-green text-ice font-semibold py-2 px-4 md:text-xl hover:bg-primary-orange"
          />
        </div>

      </div>
    </div>
    
  )
}
