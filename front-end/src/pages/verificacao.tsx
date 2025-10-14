import NavBarSimples from "../components/navbar/NavbarSimples";
import { useNavigate } from "react-router-dom"

export default function Verificacao() {
  const navigate = useNavigate()

  return (
    <div>
      <NavBarSimples rota={"login"} />
      <div className="m-15 mb-15">
        <h1 className="text-2xl font-bold flex justify-center items-center">Verificação de Segurança</h1>
      </div>
    </div>
  )
}