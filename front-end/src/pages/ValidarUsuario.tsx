import { useNavigate } from "react-router-dom";
import NavBarSimples from "../components/navbar/NavbarSimples";
import FooterMain from "../components/footer/FooterMain";
import { useState } from "react";
import { enviarCodigoRecuperacao } from "../services/esqueciSenhaService";
import { Phone, AlertCircle } from "lucide-react";

const formatTelefone = (value: string) => {
  value = value.replace(/\D/g, "");

  if (value.length > 11) value = value.slice(0, 11);

  if (value.length <= 10) {
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");
  } else {
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
  }

  return value;
};

export default function ValidarUsuario() {
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanValue = e.target.value.replace(/\D/g, "");
    setTelefone(cleanValue);
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!telefone) {
      setError("Por favor, preencha o número de telefone.");
      return;
    }

    try {
      setLoading(true);
      const response = await enviarCodigoRecuperacao(telefone);

      if (response.message === "Usuário não encontrado.") {
        setError("Usuário não encontrado.");
        return;
      }

      // Salva telefone para próxima tela
      localStorage.setItem("telefone_recuperacao", telefone);

      navigate("/verificacao");
    } catch (err) {
      console.error(err);
      setError("Erro ao enviar código de recuperação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ice min-h-screen flex flex-col justify-between">
      <NavBarSimples rota={"login"} />

      <main className="w-full flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 space-y-5"
          >
            <div className="text-center mb-2">
              <h1 className="text-3xl font-bold text-black-smooth tracking-tight">
                Recuperar Senha
              </h1>
              <p className="text-sm text-gray-500 mt-1.5">
                Informe seu número de telefone para receber o código de verificação
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
                  placeholder="Insira seu número de telefone"
                  className={`w-full pl-10 pr-4 py-3 bg-ice text-black-smooth rounded-xl border outline-none transition-all font-medium text-sm focus:ring-2 ${
                    error 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-gray-200 focus:border-primary-orange focus:ring-primary-orange/20"
                  }`}
                  value={formatTelefone(telefone)}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Mensagem de Erro Unificada */}
              {error && (
                <p className="text-red-500 text-sm font-semibold mt-2.5 flex items-center gap-1.5">
                  <AlertCircle size={16} />
                  {error}
                </p>
              )}
            </div>

            {/* Botão de Envio */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center bg-pear-green hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-xl hover:shadow-lg hover:shadow-pear-green/20 transition-all duration-200 cursor-pointer text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? "Enviando..." : "Confirmar"}
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