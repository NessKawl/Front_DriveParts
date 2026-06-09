import { useNavigate } from "react-router-dom";
import NavBarSimples from "../components/navbar/NavbarSimples";
import FooterMain from "../components/footer/FooterMain";
import { useState } from "react";
import { redefinirSenha } from "../services/esqueciSenhaService";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function RecuperarSenha() {
  const navigate = useNavigate();

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (senha !== confirmarSenha) {
        setError("As senhas não coincidem.");
        return;
      }

      if (senha.length < 6) {
        setError("A senha precisa ter pelo menos 6 caracteres.");
        return;
      }

      setLoading(true);

      const telefone = localStorage.getItem("telefone_recuperacao");
      const codigo = localStorage.getItem("codigo_recuperacao");

      if (!telefone || !codigo) {
        setError("Dados de recuperação inválidos ou expirados.");
        return;
      }

      await redefinirSenha(telefone, codigo, senha);

      // Limpa storage
      localStorage.removeItem("telefone_recuperacao");
      localStorage.removeItem("codigo_recuperacao");

      alert("Senha redefinida com sucesso!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Erro ao redefinir senha. Tente novamente.");
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
            className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 space-y-6"
          >
            <div className="text-center mb-2">
              <h1 className="text-3xl font-bold text-black-smooth tracking-tight">
                Redefinir Senha
              </h1>
              <p className="text-sm text-gray-500 mt-1.5">
                Escolha uma nova senha segura para acessar sua conta
              </p>
            </div>

            {/* Campo: Nova Senha */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nova senha
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                  <Lock size={18} />
                </span>
                <input
                  type={showSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => {
                    setSenha(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Insira sua nova senha"
                  className={`w-full pl-10 pr-10 py-3 bg-ice text-black-smooth rounded-xl border outline-none transition-all font-medium text-sm focus:ring-2 ${
                    error 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-gray-200 focus:border-primary-orange focus:ring-primary-orange/20"
                  }`}
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
            </div>

            {/* Campo: Confirmar Nova Senha */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Confirmar nova senha
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                  <Lock size={18} />
                </span>
                <input
                  type={showConfirmarSenha ? "text" : "password"}
                  value={confirmarSenha}
                  onChange={(e) => {
                    setConfirmarSenha(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Confirme sua nova senha"
                  className={`w-full pl-10 pr-10 py-3 bg-ice text-black-smooth rounded-xl border outline-none transition-all font-medium text-sm focus:ring-2 ${
                    error 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-gray-200 focus:border-primary-orange focus:ring-primary-orange/20"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Mensagem de Erro */}
              {error && (
                <p className="text-red-500 text-sm font-semibold mt-2.5 flex items-center gap-1.5">
                  <AlertCircle size={16} />
                  {error}
                </p>
              )}
            </div>

            {/* Botão de Confirmação */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center bg-primary-orange hover:bg-orange-500 text-white font-bold py-3.5 px-6 rounded-xl hover:shadow-lg hover:shadow-primary-orange/20 transition-all duration-200 cursor-pointer text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? "Salvando..." : "Confirmar"}
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