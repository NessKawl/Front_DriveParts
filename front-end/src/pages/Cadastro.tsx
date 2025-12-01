import { useState } from "react";
import Button from "../components/buttons/Button";
import FooterMain from "../components/footer/FooterMain";
import NavBarSimples from "../components/navbar/NavbarSimples";
import { useNavigate } from "react-router-dom"
import { Register } from "../services/authService";

const formatTelefone = (value: string) => {
  value = value.replace(/\D/g, ""); // remove tudo que não for número

  if (value.length > 11) value = value.slice(0, 11);

  if (value.length <= 10) {
    // Fixo: (99) 9999-9999
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");
  } else {
    // Celular: (99) 99999-9999
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
  }

  return value;
};


export default function Cadastro() {
  const navigate = useNavigate()
  const [error, setError] = useState("");
  const [errorTelefone, setErrorTelefone] = useState("");
  const [senhaErro, setSenhaErro] = useState("");
  const [form, setForm] = useState({
    Nome: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    const novoForm = { ...form, [id]: value };
    setForm(novoForm);

    if (error) setError("");

    if (id === "senha" || id === "confirmarSenha") {
      if (
        novoForm.senha &&
        novoForm.confirmarSenha &&
        novoForm.senha !== novoForm.confirmarSenha
      ) {
        setSenhaErro("As senhas não coincidem!");
      } else {
        setSenhaErro("");
      }
    }
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.telefone || !form.senha) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    if (form.senha !== form.confirmarSenha) {
      setError("As senhas devem ser iguais.");
      return;
    }


    try {
      const telefoneSemMascara = form.telefone.replace(/\D/g, "");

      await Register(form.Nome, telefoneSemMascara, form.senha)

      setError("");
      setErrorTelefone("");
      setSenhaErro("");

      setTimeout(() => {
        navigate("/login");
      }, 100);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setErrorTelefone("Telefone já cadastrado! Insira um novo ou tente fazer login.");
      }
      console.error("Erro ao cadastrar: ", err)
    }
  }
  return (
    <div className="bg-ice h-screen flex flex-col justify-between">
      <NavBarSimples rota={"login"} />

      <div className="flex flex-col justify-center items-center ">
        <h1 className="text-4xl font-bold my-4">Cadastrar-se</h1>
        <form
          action="POST"
          onSubmit={handleSubmit}
          className="bg-white flex flex-col justify-between items-center p-5 rounded-2xl sm:rounded-none w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12">
          <div className="w-full sm:w-10/12 flex flex-col gap-5 mb-4">
            <div>
              <label htmlFor="" className="font-semibold sm:w-full">Nome</label>
              <input
                id="Nome"
                type="text"
                placeholder="Insira seu Nome Completo"
                // className="w-full sm:w-full border border-gray-300 rounded-lg p-2 "
                className={`w-full sm:w-full border  rounded-lg p-2 ${error ? "border-red-500" : "border-gray-300"}`}

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
                // className="w-full sm:w-full border border-gray-300 rounded-lg p-2 "
                className={`w-full sm:w-full rounded-lg p-2 border ${error || errorTelefone ? "border-red-500" : "border-gray-300"}`}

                value={formatTelefone(form.telefone)}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="" className="font-semibold sm:w-full">Senha</label>
              <input
                id="senha"
                type="password"
                placeholder="Insira sua Senha"
                // className="w-full sm:w-full border border-gray-300 rounded-lg p-2 "
                className={`w-full sm:w-full rounded-lg p-2 border ${senhaErro || error ? "border-red-500" : "border-gray-300"}`}

                value={form.senha}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="" className="font-semibold sm:w-full">Confirme sua senha</label>
              <input
                id="confirmarSenha"
                type="password"
                placeholder="Insira novamente sua Senha"
                // className="w-full sm:w-full border border-gray-300 rounded-lg p-2 "
                className={`w-full sm:w-full rounded-lg p-2 border ${senhaErro || error ? "border-red-500" : "border-gray-300"}`}

                value={form.confirmarSenha}
                onChange={handleChange}
              />
            </div>



            {(error || senhaErro || errorTelefone) && (
              <p className="text-red-600 font-semibold">
                {error || senhaErro || errorTelefone}
              </p>
            )}


            <p className="font-light text-md">
              Ao prosseguir com o cadastro, declaro que li e concordo com a <span className="border-b font-bold text-blue-700 cursor-pointer" onClick={() => navigate("/termos-de-uso")}> Política de Privacidade</span>.
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