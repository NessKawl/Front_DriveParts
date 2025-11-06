import { useState } from "react";
import Button from "../components/buttons/Button";
import FooterMain from "../components/footer/FooterMain";
import NavBarSimples from "../components/navbar/NavbarSimples";
import { useNavigate } from "react-router-dom"

export default function Cadastro() {
  const navigate = useNavigate()
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    Nome: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.telefone || !form.senha) {
      setError("Preencha todos os campos obrigatórios.");
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    if(form.senha !== form.confirmarSenha){
      setError("As senhas devem ser iguais.");
      alert("As senhas devem ser iguais.");
      return;
    }
    navigate("/verificacao")
  }
  return (
    <div className="bg-ice h-screen flex flex-col justify-between">
      <NavBarSimples rota={"login"} />

      <div className="flex flex-col justify-center items-center ">
        <h1 className="text-4xl font-bold my-4">Cadastrar-se</h1>
        <form 
          action=""
          onSubmit={handleSubmit}
          className="bg-white flex flex-col justify-between items-center p-5 rounded-2xl sm:rounded-none w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12">
          <div className="w-full sm:w-10/12 flex flex-col gap-5 mb-4">
          <div>
            <label htmlFor="" className="font-semibold sm:w-full">Nome</label>
            <input 
              id="Nome"
              type="text"
              placeholder="Insira seu Nome Completo"
              className="w-full sm:w-full border border-gray-300 rounded-lg p-2 "
              value={form.Nome}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="" className="font-semibold sm:w-full">Telefone</label>
            <input 
              id="telefone"
              type="text"
              placeholder="Insira seu Telefone"
              className="w-full sm:w-full border border-gray-300 rounded-lg p-2 "
              value={form.telefone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="" className="font-semibold sm:w-full">Senha</label>
            <input 
              id="senha"
              type="password"
              placeholder="Insira sua Senha"
              className="w-full sm:w-full border border-gray-300 rounded-lg p-2 "
              value={form.senha}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="" className="font-semibold sm:w-full">Senha</label>
            <input 
              id="confirmarSenha"
              type="password"
              placeholder="Confirme sua Senha"
              className="w-full sm:w-full border border-gray-300 rounded-lg p-2 "
              value={form.confirmarSenha}
              onChange={handleChange}
            />
          </div>
            <p className="font-light text-md">
              Ao prosseguir com o cadastro, declaro que li e concordo com a <span className="border-b font-bold text-blue-700 " onClick={() => navigate("/termos-de-uso")}> Política de Privacidade</span>.
            </p>
          </div>
          <Button
            type="submit"
            children="Cadastrar"
            className="bg-pear-green text-ice font-semibold py-2 px-4 md:text-xl hover:bg-primary-orange"
          />
        </form>
      </div>
      <footer className="relative w-full">
        <FooterMain />
      </footer>
    </div>
  )
}