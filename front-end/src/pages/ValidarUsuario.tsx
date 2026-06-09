import { useNavigate } from "react-router-dom";
import NavBarSimples from "../components/navbar/NavbarSimples";
import FooterMain from "../components/footer/FooterMain";
import { useState } from "react";
import { enviarCodigoRecuperacao } from "../services/esqueciSenhaService";
import { Phone, AlertCircle, ArrowLeft } from "lucide-react";

const formatTelefone = (value: string) => {
  let numeros = value.replace(/\D/g, "");
  if (numeros.length > 11) {
    numeros = numeros.slice(0, 11);
  }
  if (numeros.length <= 10) {
    return numeros
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return numeros
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
};

export default function ValidarUsuario() {
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const telefoneLimpo = telefone.replace(/\D/g, "");

      if (!telefoneLimpo) {
        setError("Por favor, digite seu número de telefone.");
        return;
      }

      await enviarCodigoRecuperacao(telefoneLimpo);

      // Salva telefone para próxima tela
      localStorage.setItem("telefone_recuperacao", telefoneLimpo);
      navigate("/verificacao");
    } catch (err) {
      console.error(err);
      setError("Erro ao enviar código de verificação. Verifique o número digitado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ice min-h-screen flex flex-col justify-between">

      <main className="w-full flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Botão de Voltar para o Login */}
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-orange font-medium mb-6 transition-colors duration-200 group"
          >
            <ArrowLeft
              size={18}
              className="transform group-hover:-translate-x-1 transition-transform"
            />
            Voltar para o login
          </button>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 space-y-6"
          >
            <div className="text-center mb-2">
              <h1 className="text-3xl font-bold text-black-smooth tracking-tight">
                Recuperação de Acesso
              </h1>
              <p className="text-sm text-gray-500 mt-1.5">
                Informe o número de telefone de sua conta para receber o código
              </p>
            </div>

            {/* Campo: Telefone */}
            <div>
              <label htmlFor="telefone" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Telefone cadastrado
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                  <Phone size={18} />
                </span>
                <input
                  id="telefone"
                  type="tel"
                  value={formatTelefone(telefone)}
                  onChange={(e) => {
                    setTelefone(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Insira seu número de telefone"
                  className={`w-full pl-10 pr-4 py-3 bg-ice text-black-smooth rounded-xl border outline-none transition-all font-medium text-sm focus:ring-2 ${
                    error 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-gray-200 focus:border-primary-orange focus:ring-primary-orange/20"
                  }`}
                  required
                />
              </div>

              {/* Mensagem de Erro */}
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
                className="w-full flex items-center justify-center bg-primary-orange hover:bg-orange-500 text-white font-bold py-3.5 px-6 rounded-xl hover:shadow-lg hover:shadow-primary-orange/20 transition-all duration-200 cursor-pointer text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? "Enviando código..." : "Confirmar"}
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