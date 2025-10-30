import { useNavigate } from "react-router-dom"
import Button from "../components/buttons/Button"
import NavBarSimples from "../components/navbar/NavbarSimples"
import FooterMain from "../components/footer/FooterMain"
import InputLabel from "../components/inputs/InputLabel"


export default function Login() {
  const navigate = useNavigate()
  return (
    <div className="bg-ice h-screen flex flex-col justify-between">
      <NavBarSimples rota={"catalogo"} />

      <div className="flex flex-col justify-center items-center ">
        <h1 className="text-4xl font-bold my-4">Entrar</h1>
        <div className="bg-white flex flex-col justify-between items-center p-10 rounded-2xl sm:rounded-none w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12">
          <div className="w-full sm:w-10/12 flex flex-col gap-5 mb-4">
            <InputLabel
              label="Telefone"
              id="telefone"
              type="text"
              placeholder="Insira seu Telefone"
              classNameLABEL="font-semibold sm:w-full"
              classNameINPUT="w-full sm:w-full border border-gray-300 rounded-lg p-2 " />
            <div>
              <InputLabel
                label="Senha"
                id="Senha"
                type="password"
                placeholder="Insira sua Senha"
                classNameLABEL="font-semibold"
                classNameINPUT="w-full border border-gray-300 rounded-lg p-2 "
              />
              <div className="font-bold flex justify-end items-end mb-8 w-full">
                <p>Esqueceu sua senha?</p>
              </div>
            </div>

          </div>
          <Button
            onClick={() => navigate("/catalogo")}
            children="ACESSAR"
            className="bg-ocean-blue text-ice font-semibold py-2 px-4 md:text-xl hover:bg-primary-orange"
          />
          <Button
            onClick={() => navigate("/cadastro")}
            children="Não possui uma conta? Cadastre-se agora!"
            className="font-medium text-black-smooth hover:text-primary-orange mt-5  underline"
          />
        </div>
      </div>
      <footer className="relative w-full">
        <FooterMain />
      </footer>
    </div>
  )
}