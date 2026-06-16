import NavBarSimples from "../components/navbar/NavbarSimples";
import { useNavigate } from "react-router-dom";
import FooterMain from "../components/footer/FooterMain";
import { useState } from "react";
import { validarCodigoRecuperacao } from "../services/esqueciSenhaService";
import { AlertCircle } from "lucide-react";

export default function Verificacao() {
  const navigate = useNavigate();

  const [codigo, setCodigo] = useState<string[]>(["", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const novoCodigo = [...codigo];
    novoCodigo[index] = value;
    setCodigo(novoCodigo);

    if (error) setError("");

    // vai pro próximo input
    if (value && index < 4) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerificar = async () => {
    setError("");

    try {
      setLoading(true);

      const telefone = localStorage.getItem("telefone_recuperacao");

      if (!telefone) {
        setError("Telefone não encontrado.");
        return;
      }

      const codigoFinal = codigo.join("");

      if (codigoFinal.length !== 5) {
        setError("Digite os 5 números.");
        return;
      }

      const response = await validarCodigoRecuperacao(telefone, codigoFinal);

      console.log("res: ", response.user);

      localStorage.setItem("token", response.access_token);
      localStorage.setItem("usu_tipo", response.user.usu_tipo);

      // salva usuário
      localStorage.setItem("user", JSON.stringify(response.user));

      // salva código validado
      localStorage.setItem("codigo_recuperacao", codigoFinal);

      const tipoLogin = localStorage.getItem("tipo_login");

      if (tipoLogin === "login") {
        localStorage.removeItem("tipo_login");
        navigate("/catalogo");
        return;
      }

      // fluxo recuperação senha
      localStorage.setItem("codigo_recuperacao", codigoFinal);
      navigate("/recuperar-senha");
    } catch (err) {
      console.error(err);
      setError("Código inválido ou expirado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ice min-h-screen flex flex-col justify-between">
      <NavBarSimples rota={"login"} />

      <main className="w-full flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 space-y-6">
            <div className="text-center mb-2">
              <h1 className="text-3xl font-bold text-black-smooth tracking-tight">
                Verificação
              </h1>
              <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                Para proteger sua conta, enviamos um código de verificação para o número cadastrado.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                Código de verificação
              </label>

              <div className="flex justify-center gap-3">
                {codigo.map((value, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => {
                      // Se pressionar Backspace em um input vazio, foca no anterior
                      if (e.key === "Backspace" && !value && index > 0) {
                        const prevInput = document.getElementById(`code-${index - 1}`);
                        prevInput?.focus();
                      }
                    }}
                    className="w-12 h-14 bg-ice text-black-smooth border border-gray-200 rounded-xl text-center font-bold text-2xl outline-none transition-all focus:ring-2 focus:border-primary-orange focus:ring-primary-orange/20"
                  />
                ))}
              </div>

              {/* Mensagem de Erro Unificada */}
              {error && (
                <p className="text-red-500 text-sm font-semibold mt-4.5 flex items-center justify-center gap-1.5">
                  <AlertCircle size={16} />
                  {error}
                </p>
              )}
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => console.log("Reenviar código")}
                className="text-xs font-semibold text-primary-orange hover:underline cursor-pointer bg-transparent border-none outline-none"
              >
                Reenviar código
              </button>
            </div>

            {/* Botão de Verificação */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleVerificar}
                disabled={loading}
                className="w-full flex items-center justify-center bg-pear-green hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-xl hover:shadow-lg hover:shadow-pear-green/20 transition-all duration-200 cursor-pointer text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? "Verificando..." : "Verificar"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative w-full">
        <FooterMain />
      </footer>
    </div>
  );
}