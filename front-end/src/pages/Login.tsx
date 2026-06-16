import { useNavigate } from "react-router-dom";
import NavBarSimples from "../components/navbar/NavbarSimples";
import FooterMain from "../components/footer/FooterMain";
import { useState } from "react";
import { enviarCodigoRecuperacao } from "../services/esqueciSenhaService";
import { Phone, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

const formatTelefone = (value: string) => {
  // Remove tudo que não for número (bloqueia letras e símbolos)
  let numeros = value.replace(/\D/g, "");

  // Limita a 11 dígitos (DDD + celular)
  if (numeros.length > 11) {
    numeros = numeros.slice(0, 11);
  }

  // Fixo: (99) 9999-9999
  if (numeros.length <= 10) {
    return numeros
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  // Celular: (99) 99999-9999
  return numeros
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
};

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ telefone: "", senha: "" });

  const [showSenha, setShowSenha] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError("");

    if (e.target.id === "telefone") {
      const somenteNumeros = e.target.value.replace(/\D/g, "");
      setForm({
        ...form,
        telefone: somenteNumeros, // 🔥 valor limpo armazenado
      });
    } else {
      setForm({ ...form, [e.target.id]: e.target.value });
    }
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
      const response = await enviarCodigoRecuperacao(form.telefone);

      if (response.message == "Usuário não encontrado.") {
        setError("Usuário não encontrado.");
        return;
      }

      localStorage.setItem("tipo_login", "login");
      localStorage.setItem("telefone_recuperacao", form.telefone);

      navigate("/verificacao");

      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (err: any) {
      console.log(err);

      if (err.response?.status === 429) {
        setError("Muitas tentativas erradas. Tente novamente após 1 minuto.");
      } else if (err.response?.status === 401 || err.response?.status === 404) {
        setError("Telefone ou senha incorretos.");
      } else {
        setError("Erro ao realizar login. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ice min-h-screen flex flex-col justify-between">
      <NavBarSimples rota={"catalogo"} />

      <main className="w-full flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 space-y-5"
          >
            <div className="text-center mb-2">
              <h1 className="text-3xl font-bold text-black-smooth tracking-tight">
                Entrar
              </h1>
              <p className="text-sm text-gray-500 mt-1.5">
                Faça login para gerenciar suas reservas e produtos
              </p>
            </div>

            {/* Campo: Telefone */}
            <div>
              <label htmlFor="telefone" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Telefone
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                  <Phone size={18} />
                </span>
                <input
                  id="telefone"
                  type="tel"
                  placeholder="Insira seu Telefone"
                  className={`w-full pl-10 pr-4 py-3 bg-ice text-black-smooth rounded-xl border outline-none transition-all font-medium text-sm focus:ring-2 ${
                    error 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-gray-200 focus:border-primary-orange focus:ring-primary-orange/20"
                  }`}
                  value={formatTelefone(form.telefone)}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Campo: Senha */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="senha" className="block text-sm font-semibold text-gray-700">
                  Senha
                </label>
                <span
                  className="text-xs font-semibold text-primary-orange hover:underline cursor-pointer"
                  onClick={() => navigate("/validar-usuario")}
                >
                  Esqueceu sua senha?
                </span>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                  <Lock size={18} />
                </span>
                <input
                  id="senha"
                  type={showSenha ? "text" : "password"}
                  placeholder="Insira sua Senha"
                  className={`w-full pl-10 pr-10 py-3 bg-ice text-black-smooth rounded-xl border outline-none transition-all font-medium text-sm focus:ring-2 ${
                    error 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-gray-200 focus:border-primary-orange focus:ring-primary-orange/20"
                  }`}
                  value={form.senha}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Mensagem de Erro Unificada */}
              {error && (
                <p className="text-red-500 text-sm font-semibold mt-2.5 flex items-center gap-1.5">
                  <AlertCircle size={16} />
                  {error}
                </p>
              )}
            </div>

            {/* Botão de Login */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center bg-pear-green hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-xl hover:shadow-lg hover:shadow-pear-green/20 transition-all duration-200 cursor-pointer text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? "Acessando..." : "ACESSAR"}
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => navigate("/cadastro")}
                className="font-semibold text-sm text-black-smooth hover:text-primary-orange transition-colors cursor-pointer underline"
              >
                Não possui uma conta? Cadastre-se agora!
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="relative w-full">
        <FooterMain />
      </footer>
    </div>
  );
}

