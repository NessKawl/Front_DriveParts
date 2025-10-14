import Button from "../components/buttons/Button";
import NavBarSimples from "../components/navbar/NavbarSimples";
import { useNavigate } from "react-router-dom"

export default function Cadastro() {
  const navigate = useNavigate()

  return (
    <div>
      <NavBarSimples rota={"login"} />
      <div className="m-15 mb-15">
        <h1 className="text-4xl font-bold flex justify-center items-center">Crie sua conta</h1>
      </div>
      <div className="ml-8 mr-8">
        <div>
          <label htmlFor="telefone" className="font-semibold">Telefone</label>
          <input
            id="telefone"
            type="text"
            placeholder="DDD + número"
            className="w-full border border-gray-300 rounded-lg p-2 "
          />
        </div>
        <div className="mt-8">
          <label htmlFor="nome" className="font-semibold">Nome</label>
          <input
            id="nome"
            type="text"
            placeholder="Insira seu nome completo"
            className="w-full border border-gray-300 rounded-lg p-2 "
          />
        </div>
        <div className="mt-8">
          <label htmlFor="Senha" className="font-semibold">Senha</label>
          <input
            id="Senha"
            type="password"
            placeholder="Insira uma senha"
            className="w-full border border-gray-300 rounded-lg p-2 "
          />
        </div>
        <div className="mt-8 mb-8">
          <label htmlFor="Senha" className="font-semibold">Senha</label>
          <input
            id="Senha"
            type="password"
            placeholder="Confirme sua senha"
            className="w-full border border-gray-300 rounded-lg p-2 "
          />
        </div>
        <div className="pt-8 flex items-center justify-center">
          <Button
            children={"Cadastrar"}
            className="mb-8 pl-4 pr-4 font-semibold bg-blue-600 text-white py-2 rounded-lg "
            onClick={() => navigate("/verificacao")}
          />
        </div>
      </div>
      <footer>

      </footer>
    </div>
  )
}