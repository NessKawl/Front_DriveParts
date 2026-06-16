import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBarSimples from "../../components/navbar/NavbarSimples";
import Avatar from "../../components/imagens/Avatar";
import { atualizarPerfil, deletarConta } from "../../services/perfilService";
import { VerifyLogin } from "../../services/authService";
import Modal from "../../components/modal/Modal";
import {
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  X,
  ShieldAlert,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

// Formatação do telefone para exibição
const formatarTelefone = (value: string) => {
  const clean = value.replace(/\D/g, "");
  if (clean.length > 11) return clean.slice(0, 11);
  if (clean.length === 11) {
    return clean.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  if (clean.length === 10) {
    return clean.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return clean;
};

export default function EditarPerfil() {
  const navigate = useNavigate();

  // Estados dos dados do perfil (coluna esquerda)
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loadingSave, setLoadingSave] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Estados do modal de alteração de senha
  const [modalSenhaAberto, setModalSenhaAberto] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarNovaSenha, setShowConfirmarNovaSenha] = useState(false);
  const [loadingSenha, setLoadingSenha] = useState(false);
  const [senhaMsgErro, setSenhaMsgErro] = useState("");

  // Estados do modal de exclusão de conta
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [senhaExclusao, setSenhaExclusao] = useState("");
  const [senhaExclusaoValida, setSenhaExclusaoValida] = useState(false);
  const [showSenhaExclusao, setShowSenhaExclusao] = useState(false);
  const [loadingValidar, setLoadingValidar] = useState(false);
  const [loadingExcluir, setLoadingExcluir] = useState(false);
  const [exclusaoErro, setExclusaoErro] = useState("");
  const [exclusaoSucesso, setExclusaoSucesso] = useState("");

  // Estados do modal global de alerta
  const [modalGlobalAberto, setModalGlobalAberto] = useState(false);
  const [modalGlobalTitulo, setModalGlobalTitulo] = useState("");
  const [modalGlobalMensagem, setModalGlobalMensagem] = useState("");
  const [modalGlobalAcao, setModalGlobalAcao] = useState<(() => void) | undefined>();

  useEffect(() => {
    const userStorage = JSON.parse(localStorage.getItem("user") || "{}");
    setNome(userStorage.usu_nome || "");
    setTelefone(userStorage.usu_tel || "");
  }, []);

  // Salvar alterações de dados pessoais
  const handleSalvarDados = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!nome.trim()) {
      setErrorMsg("O nome não pode estar vazio.");
      return;
    }

    try {
      setLoadingSave(true);
      const response = await atualizarPerfil({
        nome: nome,
      });

      const userStorage = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = {
        ...userStorage,
        usu_nome: nome,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (response.data?.access_token) {
        localStorage.setItem("token", response.data.access_token);
      }

      setSuccessMsg("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      setErrorMsg("Erro ao atualizar o perfil. Tente novamente.");
    } finally {
      setLoadingSave(false);
    }
  };

  // Alterar Senha
  const handleConfirmarAlterarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setSenhaMsgErro("");

    if (novaSenha !== confirmarNovaSenha) {
      setSenhaMsgErro("As novas senhas não coincidem.");
      return;
    }

    if (novaSenha.length < 8) {
      setSenhaMsgErro("A nova senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    const senhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!senhaForte.test(novaSenha)) {
      setSenhaMsgErro(
        "A senha deve conter no mínimo 8 caracteres, incluindo letra maiúscula, número e caractere especial."
      );
      return;
    }

    try {
      setLoadingSenha(true);

      const userStorage = JSON.parse(localStorage.getItem("user") || "{}");
      if (!userStorage.usu_tel) {
        setSenhaMsgErro("Telefone do usuário não encontrado.");
        return;
      }

      // 1. Valida senha atual
      await VerifyLogin(userStorage.usu_tel, senhaAtual);

      // 2. Salva nova senha
      const response = await atualizarPerfil({
        nome: userStorage.usu_nome || nome,
        senha: novaSenha,
      });

      if (response.data?.access_token) {
        localStorage.setItem("token", response.data.access_token);
      }

      setModalSenhaAberto(false);

      // Notifica sucesso
      setModalGlobalTitulo("Sucesso");
      setModalGlobalMensagem("Senha atualizada com sucesso!");
      setModalGlobalAcao(() => () => {});
      setModalGlobalAberto(true);
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 401 || error.response?.status === 404) {
        setSenhaMsgErro("Senha atual incorreta.");
      } else {
        setSenhaMsgErro("Erro ao alterar senha. Tente novamente.");
      }
    } finally {
      setLoadingSenha(false);
    }
  };

  // Validar senha para exclusão de conta
  const handleValidarSenhaExclusao = async () => {
    setExclusaoErro("");
    setExclusaoSucesso("");
    setSenhaExclusaoValida(false);

    try {
      setLoadingValidar(true);
      const userStorage = JSON.parse(localStorage.getItem("user") || "{}");
      if (!userStorage.usu_tel) {
        setExclusaoErro("Telefone do usuário não encontrado.");
        return;
      }

      await VerifyLogin(userStorage.usu_tel, senhaExclusao);
      setSenhaExclusaoValida(true);
      setExclusaoSucesso("Senha confirmada com sucesso! Você já pode excluir sua conta.");
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 401 || error.response?.status === 404) {
        setExclusaoErro("Senha incorreta.");
      } else {
        setExclusaoErro("Erro ao validar senha. Tente novamente.");
      }
    } finally {
      setLoadingValidar(false);
    }
  };

  // Confirmar exclusão da conta
  const handleConfirmarExclusaoConta = async () => {
    if (!senhaExclusaoValida) return;

    try {
      setLoadingExcluir(true);
      await deletarConta();

      localStorage.clear();
      setModalExcluirAberto(false);

      setModalGlobalTitulo("Conta Excluída");
      setModalGlobalMensagem("Sua conta foi excluída com sucesso.");
      setModalGlobalAcao(() => () => {
        window.location.href = "/login";
      });
      setModalGlobalAberto(true);
    } catch (error) {
      console.error(error);
      setExclusaoErro("Erro ao excluir conta. Tente novamente.");
    } finally {
      setLoadingExcluir(false);
    }
  };

  return (
    <div className="bg-ice min-h-screen flex flex-col justify-between">
      <NavBarSimples rota={"perfil"} />

      <main className="w-full flex-grow flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-5xl bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="text-center mb-10 border-b border-gray-100 pb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-black-smooth tracking-tight">
              Editar Perfil
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Gerencie seus dados pessoais, senha e preferências de conta
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LADO ESQUERDO: Informações do Usuário (6 cols no lg) */}
            <div className="lg:col-span-6 space-y-6 border-b lg:border-b-0 lg:border-r border-gray-100 pb-8 lg:pb-0 lg:pr-8">
              <div className="flex flex-col items-center mb-6">
                <div className="relative group mb-4">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-orange to-orange-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <Avatar
                    size="xl"
                    className="relative border-4 border-white shadow-md transform transition duration-500 group-hover:scale-105"
                    src={"/icons/avatar.png"}
                  />
                </div>
                <h2 className="text-lg font-bold text-black-smooth">Informações Pessoais</h2>
              </div>

              <form onSubmit={handleSalvarDados} className="space-y-4">
                {/* Campo: Nome */}
                <div>
                  <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                      <User size={18} />
                    </span>
                    <input
                      id="nome"
                      type="text"
                      placeholder="Seu nome completo"
                      value={nome}
                      onChange={(e) => {
                        setNome(e.target.value);
                        if (successMsg) setSuccessMsg("");
                        if (errorMsg) setErrorMsg("");
                      }}
                      className="w-full pl-10 pr-4 py-3 bg-ice text-black-smooth rounded-xl border border-gray-200 outline-none transition-all font-medium text-sm focus:ring-2 focus:border-primary-orange focus:ring-primary-orange/20"
                      required
                    />
                  </div>
                </div>

                {/* Campo: Telefone */}
                <div>
                  <label
                    htmlFor="telefone"
                    className="block text-sm font-semibold text-gray-700 mb-1.5"
                  >
                    Telefone (Não editável)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                      <Phone size={18} />
                    </span>
                    <input
                      id="telefone"
                      type="text"
                      value={formatarTelefone(telefone)}
                      disabled
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-400 rounded-xl border border-gray-200 outline-none font-medium text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                {successMsg && (
                  <p className="text-green-600 text-sm font-semibold flex items-center gap-1.5 mt-2">
                    <CheckCircle2 size={16} />
                    {successMsg}
                  </p>
                )}

                {errorMsg && (
                  <p className="text-red-500 text-sm font-semibold flex items-center gap-1.5 mt-2">
                    <AlertCircle size={16} />
                    {errorMsg}
                  </p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loadingSave}
                    className="w-full bg-primary-orange hover:bg-orange-500 text-white py-3.5 px-6 rounded-xl hover:shadow-lg hover:shadow-primary-orange/20 transition-all duration-200 cursor-pointer text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-sm animate-pulse-once"
                  >
                    {loadingSave ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </div>
              </form>
            </div>

            {/* LADO DIREITO: Segurança e Ações de Conta (6 cols no lg) */}
            <div className="lg:col-span-6 space-y-6 lg:pl-4">
              <h2 className="text-lg font-bold text-black-smooth mb-4 flex items-center gap-2">
                <KeyRound size={20} className="text-primary-orange" />
                Segurança da Conta
              </h2>

              {/* Bloco 1: Alterar Senha */}
              <div className="bg-ice p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-black-smooth">Alterar Senha</h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                    Recomendamos alterar sua senha periodicamente para manter a segurança da sua
                    conta ativa.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSenhaAtual("");
                      setNovaSenha("");
                      setConfirmarNovaSenha("");
                      setSenhaMsgErro("");
                      setModalSenhaAberto(true);
                    }}
                    className="w-full flex items-center justify-center border border-primary-orange text-primary-orange hover:text-white hover:bg-primary-orange py-2.5 px-4 rounded-xl hover:shadow-md hover:shadow-orange-600/20 transition-all duration-200 cursor-pointer text-sm shadow-sm"
                  >
                    Alterar Senha
                  </button>
                </div>
              </div>

              {/* Bloco 2: Excluir Conta */}
              <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-red-700 flex items-center gap-1.5">
                    <ShieldAlert size={18} />
                    Excluir Conta
                  </h3>
                  <p className="text-xs text-red-600/80 mt-1.5 leading-relaxed">
                    Esta ação é permanente e irreversível. Todos os seus dados pessoais e reservas
                    associadas serão excluídos e anonimizados.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSenhaExclusao("");
                      setSenhaExclusaoValida(false);
                      setExclusaoErro("");
                      setExclusaoSucesso("");
                      setModalExcluirAberto(true);
                    }}
                    className="w-full flex items-center justify-center border border-red-600 text-red-600 hover:text-white hover:bg-red-600  py-2.5 px-4 rounded-xl hover:shadow-md hover:shadow-red-600/20 transition-all duration-200 cursor-pointer text-sm shadow-sm"
                  >
                    Excluir Perfil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* POPUP ALTERAR SENHA */}
      {modalSenhaAberto && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setModalSenhaAberto(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-black-smooth">Alterar Senha</h3>
              <p className="text-xs text-gray-500 mt-1.5">
                Digite sua senha atual e a nova senha desejada.
              </p>
            </div>

            <form onSubmit={handleConfirmarAlterarSenha} className="space-y-4">
              {/* Senha Atual */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Senha Atual
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showSenhaAtual ? "text" : "password"}
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    placeholder="Digite sua senha atual"
                    className="w-full pl-9 pr-9 py-2.5 bg-ice text-black-smooth rounded-xl border border-gray-200 outline-none text-sm transition-all focus:ring-2 focus:border-primary-orange focus:ring-primary-orange/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showSenhaAtual ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Nova Senha */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nova Senha</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showNovaSenha ? "text" : "password"}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="No mínimo 8 caracteres"
                    className="w-full pl-9 pr-9 py-2.5 bg-ice text-black-smooth rounded-xl border border-gray-200 outline-none text-sm transition-all focus:ring-2 focus:border-primary-orange focus:ring-primary-orange/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNovaSenha(!showNovaSenha)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showNovaSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirmar Nova Senha */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showConfirmarNovaSenha ? "text" : "password"}
                    value={confirmarNovaSenha}
                    onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                    placeholder="Confirme a nova senha"
                    className="w-full pl-9 pr-9 py-2.5 bg-ice text-black-smooth rounded-xl border border-gray-200 outline-none text-sm transition-all focus:ring-2 focus:border-primary-orange focus:ring-primary-orange/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmarNovaSenha(!showConfirmarNovaSenha)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmarNovaSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {senhaMsgErro && (
                <p className="text-red-500 text-xs font-semibold flex items-center gap-1 mt-2">
                  <AlertCircle size={14} />
                  {senhaMsgErro}
                </p>
              )}

              {/* Esqueci a senha */}
              <div className="text-left pt-1">
                <button
                  type="button"
                  onClick={() => navigate("/validar-usuario")}
                  className="text-xs font-semibold text-primary-orange hover:underline bg-transparent border-none cursor-pointer outline-none"
                >
                  Esqueci a senha
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalSenhaAberto(false)}
                  className="w-1/2 py-2.5 border border-gray-200 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loadingSenha}
                  className="w-1/2 py-2.5 bg-primary-orange hover:bg-primary-orange/90 text-white font-bold rounded-xl text-sm disabled:opacity-50 transition-colors shadow-sm"
                >
                  {loadingSenha ? "Alterando..." : "Confirmar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP EXCLUIR CONTA */}
      {modalExcluirAberto && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setModalExcluirAberto(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-red-700 flex items-center justify-center gap-2">
                <ShieldAlert size={24} />
                Excluir Conta
              </h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Esta ação é irreversível. Para confirmar que a conta é sua, por favor valide sua
                senha atual.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Sua Senha Atual
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                      <Lock size={16} />
                    </span>
                    <input
                      type={showSenhaExclusao ? "text" : "password"}
                      value={senhaExclusao}
                      onChange={(e) => {
                        setSenhaExclusao(e.target.value);
                        setSenhaExclusaoValida(false);
                        setExclusaoErro("");
                      }}
                      placeholder="Digite sua senha"
                      className="w-full pl-9 pr-9 py-2.5 bg-ice text-black-smooth rounded-xl border border-gray-200 outline-none text-sm transition-all focus:ring-2 focus:border-primary-orange focus:ring-primary-orange/20"
                      disabled={senhaExclusaoValida}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSenhaExclusao(!showSenhaExclusao)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      disabled={senhaExclusaoValida}
                    >
                      {showSenhaExclusao ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleValidarSenhaExclusao}
                    disabled={!senhaExclusao || senhaExclusaoValida || loadingValidar}
                    className="px-4 py-2.5 bg-primary-orange hover:bg-orange-500 text-white font-bold rounded-xl text-sm disabled:opacity-50 transition-colors shrink-0 shadow-sm"
                  >
                    {loadingValidar
                      ? "Validando..."
                      : senhaExclusaoValida
                      ? "Validada"
                      : "Validar"}
                  </button>
                </div>
              </div>

              {exclusaoErro && (
                <p className="text-red-500 text-xs flex items-center gap-1 mt-2">
                  <AlertCircle size={14} />
                  {exclusaoErro}
                </p>
              )}

              {exclusaoSucesso && (
                <p className=" text-xs flex items-center gap-1 mt-2">
                  <CheckCircle2 size={14} />
                  {exclusaoSucesso}
                </p>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalExcluirAberto(false)}
                  className="w-1/2 py-2.5 border border-gray-200 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmarExclusaoConta}
                  disabled={!senhaExclusaoValida || loadingExcluir}
                  className="w-1/2 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm disabled:opacity-50 transition-colors shadow-sm"
                >
                  {loadingExcluir ? "Excluindo..." : "Excluir Conta"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL GLOBAL PARA MENSAGENS DE SUCESSO/ALERTAS DO SISTEMA */}
      <Modal
        isOpen={modalGlobalAberto}
        title={modalGlobalTitulo}
        message={modalGlobalMensagem}
        actionText="OK"
        onClose={() => setModalGlobalAberto(false)}
        onAction={() => {
          modalGlobalAcao?.();
          setModalGlobalAberto(false);
        }}
      />
    </div>
  );
}

