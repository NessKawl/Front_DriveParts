import Button from "../components/buttons/Button";
import FooterMain from "../components/footer/FooterMain";
import InputLabel from "../components/inputs/InputLabel";
import NavBarSimples from "../components/navbar/NavbarSimples";
import { useNavigate } from "react-router-dom"

export default function Cadastro() {
  const navigate = useNavigate()

  return (
    <div className="bg-ice h-screen flex flex-col justify-between">
      <NavBarSimples rota={"login"} />

      <div className="flex flex-col justify-center items-center ">
        <h1 className="text-4xl font-bold my-4">Cadastrar-se</h1>
        <div className="bg-white flex flex-col justify-between items-center p-5 rounded-2xl sm:rounded-none w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12">
          <div className="w-full sm:w-10/12 flex flex-col gap-5 mb-4">
            <InputLabel
              label="Nome"
              id="Nome"
              type="text"
              placeholder="Insira seu Nome Completo"
              classNameLABEL="font-semibold sm:w-full"
              classNameINPUT="w-full sm:w-full border border-gray-300 rounded-lg p-2 " />
            <InputLabel
              label="Telefone"
              id="telefone"
              type="text"
              placeholder="Insira seu Telefone"
              classNameLABEL="font-semibold sm:w-full"
              classNameINPUT="w-full sm:w-full border border-gray-300 rounded-lg p-2 " />

            <InputLabel
              label="Senha"
              id="Senha"
              type="password"
              placeholder="Insira sua Senha"
              classNameLABEL="font-semibold"
              classNameINPUT="w-full border border-gray-300 rounded-lg p-2 "
            />
            <InputLabel
              label="Confirmar senha"
              id="ConfirmarSenha"
              type="password"
              placeholder="Confirme sua Senha"
              classNameLABEL="font-semibold"
              classNameINPUT="w-full border border-gray-300 rounded-lg p-2 "
            />



          </div>
          <Button
            onClick={() => navigate("/verificacao")}
            children="Cadastrar"
            className="bg-pear-green text-ice font-semibold py-2 px-4 md:text-xl hover:bg-primary-orange"
          />
        </div>
      </div>
      <footer className="relative w-full">
        <FooterMain />
      </footer>
    </div>
  )
}