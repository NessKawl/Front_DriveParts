import { useNavigate } from "react-router-dom"
import Button from "../components/buttons/Button"
import NavBarSimples from "../components/navbar/NavbarSimples"
import FooterMain from "../components/footer/FooterMain"
import InputLabel from "../components/inputs/InputLabel"


export default function Login() {
  const navigate = useNavigate()
  return (
    <div>
      <NavBarSimples rota={"catalogo"} />

      <div className="m-15 mb-15">
        <h1 className="text-4xl font-bold flex justify-center items-center">Entrar</h1>
      </div>
      <div className="ml-8 mr-8">
        <div>
          <InputLabel
            label="Telefone"
            id="telefone"
            type="text"
            placeholder="Insira seu Telefone"
            classNameLABEL="font-semibold"
            classNameINPUT="w-full border border-gray-300 rounded-lg p-2 " />
        </div>
        <div className="mt-8">
          <InputLabel
            label="Senha"
            id="Senha"
            type="password"
            placeholder="Insira sua Senha"
            classNameLABEL="font-semibold"
            classNameINPUT="w-full border border-gray-300 rounded-lg p-2 "
          />
        </div>
        <div className="font-bold flex justify-end items-end mb-8">
          <p>Esqueceu sua senha?</p>
        </div>
        <div className="pt-8 flex items-center justify-center">
          <Button
            onClick={() => navigate("/catalogo")}
            children="ACESSAR"
            className="bg-ocean-blue text-ice font-semibold py-2 px-4 md:text-xl hover:bg-primary-orange"
          />
        </div>
        <div className="mt-8 w-full flex justify-center items-center">
          <Button
            onClick={() => navigate("/cadastro")}
            children="Não possui uma conta? Cadastre-se agora!"
            className="font-medium text-black-smooth hover:text-primary-orange"
          />
        </div>
      </div>
      <footer className="mt-35">
        <FooterMain />
      </footer>
    </div>
  )
}