import { useState } from "react";
import FooterMain from "../components/footer/FooterMain";
import NavBarSimples from "../components/navbar/NavbarSimples";
import { useNavigate } from "react-router-dom";
import { Register } from "../services/authService";
import { User, Phone, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

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

export default function Cadastro() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [errorTelefone, setErrorTelefone] = useState("");
  const [senhaErro, setSenhaErro] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    Nome: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
  });

  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    const novoForm = { ...form, [id]: value };
    setForm(novoForm);

    if (error) setError("");
    if (errorTelefone) setErrorTelefone("");

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

    if (!form.Nome || !form.telefone || !form.senha) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    if (form.senha !== form.confirmarSenha) {
      setError("As senhas devem ser iguais.");
      return;
    }
    const senhaForte =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!senhaForte.test(form.senha)) {
      setError(
        "A senha deve conter no mínimo 8 caracteres, incluindo letra maiúscula, número e caractere especial."
      );
      return;
    }

    try {
      setLoading(true);
      const telefoneSemMascara = form.telefone.replace(/\D/g, "");

      await Register(form.Nome, telefoneSemMascara, form.senha);

      setError("");
      setErrorTelefone("");
      setSenhaErro("");

      setTimeout(() => {
        navigate("/login");
      }, 100);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setErrorTelefone("Telefone já cadastrado! Insira um novo ou tente fazer login.");
      } else {
        setError("Erro ao cadastrar. Tente novamente.");
      }
      console.error("Erro ao cadastrar: ", err);
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
                Cadastrar-se
              </h1>
              <p className="text-sm text-gray-500 mt-1.5">
                Crie uma conta para começar a reservar seus produtos
              </p>
            </div>

            {/* Campo: Nome */}
            <div>
              <label htmlFor="Nome" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nome
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                  <User size={18} />
                </span>
                <input
                  id="Nome"
                  type="text"
                  placeholder="Insira seu Nome Completo"
                  className={`w-full pl-10 pr-4 py-3 bg-ice text-black-smooth rounded-xl border outline-none transition-all font-medium text-sm focus:ring-2 ${
                    error 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-gray-200 focus:border-primary-orange focus:ring-primary-orange/20"
                  }`}
                  value={form.Nome}
                  onChange={handleChange}
                  required
                />
              </div>
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
                  type="text"
                  placeholder="Insira seu Telefone"
                  className={`w-full pl-10 pr-4 py-3 bg-ice text-black-smooth rounded-xl border outline-none transition-all font-medium text-sm focus:ring-2 ${
                    error || errorTelefone 
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
              <label htmlFor="senha" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                  <Lock size={18} />
                </span>
                <input
                  id="senha"
                  type={showSenha ? "text" : "password"}
                  placeholder="Insira sua Senha"
                  className={`w-full pl-10 pr-10 py-3 bg-ice text-black-smooth rounded-xl border outline-none transition-all font-medium text-sm focus:ring-2 ${
                    senhaErro || error 
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
            </div>

            {/* Campo: Confirmar Senha */}
            <div>
              <label htmlFor="confirmarSenha" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Confirme sua senha
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                  <Lock size={18} />
                </span>
                <input
                  id="confirmarSenha"
                  type={showConfirmarSenha ? "text" : "password"}
                  placeholder="Insira novamente sua Senha"
                  className={`w-full pl-10 pr-10 py-3 bg-ice text-black-smooth rounded-xl border outline-none transition-all font-medium text-sm focus:ring-2 ${
                    senhaErro || error 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-gray-200 focus:border-primary-orange focus:ring-primary-orange/20"
                  }`}
                  value={form.confirmarSenha}
                  onChange={handleChange}
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

              {/* Mensagem de Erro Unificada */}
              {(error || senhaErro || errorTelefone) && (
                <p className="text-red-500 text-sm font-semibold mt-2.5 flex items-center gap-1.5">
                  <AlertCircle size={16} />
                  {error || senhaErro || errorTelefone}
                </p>
              )}
            </div>

            <p className="text-xs text-gray-500 font-light leading-relaxed">
              Ao prosseguir com o cadastro, declaro que li e concordo com a{" "}
              <span 
                className="font-semibold text-primary-orange hover:underline cursor-pointer" 
                onClick={() => navigate("/termos-de-uso")}
              >
                Política de Privacidade
              </span>.
            </p>

            {/* Botão de Cadastro */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center bg-pear-green hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-xl hover:shadow-lg hover:shadow-pear-green/20 transition-all duration-200 cursor-pointer text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? "Cadastrando..." : "Cadastrar"}
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