import NavBarSimples from "../components/navbar/NavbarSimples";
import { useNavigate } from "react-router-dom"
import Button from "../components/buttons/Button"
//import FooterMain from "../components/footer/FooterMain"

export default function Verificacao() {
  const navigate = useNavigate()

  return (
    <div>
      <NavBarSimples rota={"login"} />
      <div className="ml-15 mr-15 mt-25 mb-2">
        <h1 className="text-xl font-bold flex justify-center items-center">Verificação de Segurança</h1>
      </div>
      <div className="mr-10 ml-10 mb-12">
        <p className="font-medium text-sm">Para proteger sua conta, enviamos um código de verificação para o número cadastrado</p>
      </div>
      <div className="ml-12 mr-12">
        <h2 className="font-medium">Código de verificação</h2>
      </div>
      <div className="ml-12 mr-12 grid grid-cols-6 gap-6">
        <div>
            <input type="number" className="w-full h-8 rounded-sm border border-gray-400 font-medium text-lg"/>
        </div>
        <div>
            <input type="number" className="w-full h-8 rounded-sm border border-gray-400 font-medium text-lg"/>
        </div>
        <div>
            <input type="number" className="w-full h-8 rounded-sm border border-gray-400 font-medium text-lg"/>
        </div>
        <div>
            <input type="number" className="w-full h-8 rounded-sm border border-gray-400 font-medium text-lg"/>
        </div>
        <div>
            <input type="number" className="w-full h-8 rounded-sm border border-gray-400 font-medium text-lg"/>
        </div>
        <div>
            <input type="number" className="w-full h-8 rounded-sm border border-gray-400 font-medium text-lg"/>
        </div>
      </div>
      <div className="font-bold flex justify-end items-end mb-8 mr-12">
          <p>Reenviar código</p>
      </div>
      <div className="pt-8 flex items-center justify-center">
          <Button
            onClick={() => navigate("/login")}
            children="Verificar"
            className="bg-green-700 text-ice font-semibold rounded-sm py-2 px-4 md:text-xl hover:bg-primary-orange"
          />
      </div>
    </div>  
  )
}