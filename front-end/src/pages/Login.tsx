import { useNavigate } from "react-router-dom"
import Button from "../components/buttons/Button"
import NavBarSimples from "../components/navbar/NavbarSimples"
import FooterMain from "../components/footer/FooterMain"
import { useState } from "react"
import { VerifyLogin } from "../services/dataService"

export default function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    telefone: "",
    senha: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.telefone || !form.senha) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }


    try {
      setLoading(true);
      const response = await VerifyLogin(form.telefone, form.senha);
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      console.log(localStorage.getItem("user"));

      navigate("/catalogo");
    } catch (err: any) {
      console.log(err);
      setError(err.response?.data?.message || "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="bg-ice h-screen flex flex-col justify-between">
      <NavBarSimples rota={"catalogo"} />

      <div className="flex flex-col justify-center items-center ">
        <h1 className="text-4xl font-bold my-4">Entrar</h1>
        <form
          action=""
          onSubmit={handleSubmit}
          className="bg-white flex flex-col justify-between items-center p-10 rounded-2xl sm:rounded-none w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12">
          <div className="w-full sm:w-10/12 flex flex-col gap-5 mb-4">
            <div className="flex flex-col items-start">
              <label htmlFor="" className="font-semibold">Telefone</label>
              <input
                id="telefone"
                type="text"
                placeholder="Insira seu Telefone"
                className="w-full border border-gray-300 rounded-lg p-2 "
                value={form.telefone}
                onChange={handleChange}
              />
            </div>

            <div>
              <div className="flex flex-col items-start">
                <label htmlFor="" className="font-semibold">Senha</label>
                <input
                  id="senha"
                  type="password"
                  placeholder="Insira sua Senha"
                  className="w-full border border-gray-300 rounded-lg p-2 "
                  value={form.senha}
                  onChange={handleChange}
                />
              </div>

              <div className="font-bold flex justify-end items-end mb-8 w-full">
                <p>Esqueceu sua senha?</p>
              </div>
            </div>

          </div>
          <Button
            children="ACESSAR"
            className="bg-ocean-blue text-ice font-semibold py-2 px-4 md:text-xl hover:bg-primary-orange"
            type="submit"
          />
          <Button
            onClick={() => navigate("/cadastro")}
            children="Não possui uma conta? Cadastre-se agora!"
            className="font-medium text-black-smooth hover:text-primary-orange mt-5  underline"
          />
        </form>
      </div>
      <footer className="relative w-full">
        <FooterMain />
      </footer>
    </div>
  )
}