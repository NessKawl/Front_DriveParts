import NavBarSimples from "../components/navbar/NavbarSimples";
import FooterMain from "../components/footer/FooterMain";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { validarCodigoRecuperacao } from "../services/esqueciSenhaService";
import { ShieldCheck, AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";

export default function Verificacao() {
  const navigate = useNavigate();

  const [codigo, setCodigo] = useState<string[]>(["", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    if (error) setError("");

    const novoCodigo = [...codigo];
    novoCodigo[index] = value;
    setCodigo(novoCodigo);

    // Vai para o próximo input
    if (value && index < 4) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerificar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const telefone = localStorage.getItem("telefone_recuperacao");

      if (!telefone) {
        setError("Telefone não encontrado no processo de recuperação.");
        return;
      }

      const codigoFinal = codigo.join("");

      if (codigoFinal.length !== 5) {
        setError("Por favor, digite os 5 dígitos do código.");
        return;
      }

      await validarCodigoRecuperacao(telefone, codigoFinal);

      // Salva código validado
      localStorage.setItem("codigo_recuperacao", codigoFinal);
      navigate("/recuperar-senha");
    } catch (err) {
      console.error(err);
      setError("Código inválido ou expirado. Tente novamente.");
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
            onClick={() => navigate("/validar-usuario")}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-orange font-medium mb-6 transition-colors duration-200 group"
          >
            <ArrowLeft
              size={18}
              className="transform group-hover:-translate-x-1 transition-transform"
            />
            Voltar
          </button>
          <form
            onSubmit={handleVerificar}
            className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 space-y-6 text-center"
          >
            <div className="flex flex-col items-center mb-2">
              <div className="p-3 bg-orange-50 rounded-2xl text-primary-orange mb-3">
                <ShieldCheck size={28} />
              </div>
              <h1 className="text-3xl font-bold text-black-smooth tracking-tight">
                Verificação
              </h1>
              <p className="text-sm text-gray-500 mt-2 px-4">
                Para proteger sua conta, enviamos um código de verificação para o número cadastrado.
              </p>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700 text-left">
                Código de verificação de 5 dígitos
              </label>

              <div className="flex justify-center items-center gap-3 py-2">
                {codigo.map((value, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleChange(e.target.value, index)}
                    className="w-12 h-14 sm:w-14 sm:h-16 bg-ice text-black-smooth rounded-xl border border-gray-200 text-2xl font-bold text-center focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 focus:outline-none outline-none transition-all"
                  />
                ))}
              </div>

              {/* Mensagem de Erro */}
              {error && (
                <p className="text-red-500 text-sm font-semibold mt-2 flex items-center justify-center gap-1.5">
                  <AlertCircle size={16} />
                  {error}
                </p>
              )}
            </div>

            {/* Reenviar Código */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => console.log("Reenviar código")}
                className="text-xs font-bold text-primary-orange hover:text-orange-600 flex items-center gap-1 transition-colors"
              >
                <RefreshCw size={12} />
                Reenviar código
              </button>
            </div>

            {/* Botão de Verificação */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center bg-primary-orange hover:bg-orange-500 text-white font-bold py-3.5 px-6 rounded-xl hover:shadow-lg hover:shadow-primary-orange/20 transition-all duration-200 cursor-pointer text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? "Verificando..." : "Verificar"}
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