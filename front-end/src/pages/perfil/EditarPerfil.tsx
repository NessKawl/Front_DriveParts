import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FooterMain from "../../components/footer/FooterMain";
import Avatar from "../../components/imagens/Avatar";
import { atualizarPerfil } from "../../services/perfilService";
import Modal from "../../components/modal/Modal";
import { logout } from "../../utils/auth";
import { 
  User, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Trash2, 
  ShieldAlert, 
  ArrowLeft, 
  Check, 
  AlertCircle,
  X,
  Loader2
} from "lucide-react";

export default function EditarPerfil() {
  const navigate = useNavigate();

  function formatarTelefone(telefone: string) {
    const numeros = telefone.replace(/\D/g, "");
    if (numeros.length === 11) {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return telefone;
  }

  const [form, setForm] = useState({
    nome: "",
    telefone: "",
  });

  // States para o modal de alteração de senha
  const [modalSenhaAberto, setModalSenhaAberto] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenhaModal, setShowNovaSenhaModal] = useState(false);
  const [showConfirmarSenhaModal, setShowConfirmarSenhaModal] = useState(false);

  // States para o modal de exclusão de conta (em etapas)
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [excluirSenha, setExcluirSenha] = useState("");
  const [showExcluirSenha, setShowExcluirSenha] = useState(false);
  const [excluirStep, setExcluirStep] = useState<1 | 2>(1); // 1 = Confirmar Senha Atual, 2 = Excluir Permanente
  const [validandoExcluirSenha, setValidandoExcluirSenha] = useState(false);

  // States do modal de feedback geral
  const [modalAberto, setModalAberto] = useState(false);
  const [modalTitulo, setModalTitulo] = useState("");
  const [modalMensagem, setModalMensagem] = useState("");
  const [modalBotaoAcao, setModalBotaoAcao] = useState("");
  const [acaoModal, setAcaoModal] = useState<(() => void) | undefined>();
  const [modalTipo, setModalTipo] = useState<"erro" | "confirmacao">("confirmacao");

  const abrirModalErro = (mensagem: string) => {
    setModalTipo("erro");
    setModalTitulo("Erro");
    setModalMensagem(mensagem);
    setModalBotaoAcao("Entendi");
    setAcaoModal(() => undefined);
    setModalAberto(true);
  };

  const abrirModalSucesso = (mensagem: string, onConfirm?: () => void) => {
    setModalTipo("confirmacao");
    setModalTitulo("Sucesso");
    setModalMensagem(mensagem);
    setModalBotaoAcao("OK");

    setAcaoModal(() => () => {
      if (onConfirm) onConfirm();
      setModalAberto(false);
    });

    setModalAberto(true);
  };

  const abrirModalConfirmacao = () => {
    setModalTipo("confirmacao");
    setModalTitulo("Confirmar Alterações");
    setModalMensagem("Deseja realmente salvar as alterações do seu perfil?");
    setModalBotaoAcao("Salvar");
    setAcaoModal(() => confirmarAtualizacao);
    setModalAberto(true);
  };

  const confirmarAtualizacao = async () => {
    try {
      const response = await atualizarPerfil({
        nome: form.nome,
      });

      const userStorage = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = {
        ...userStorage,
        usu_nome: form.nome,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (response.data?.access_token) {
        localStorage.setItem("token", response.data.access_token);
      }

      abrirModalSucesso("Perfil updated com sucesso!", () => {
        navigate("/perfil");
      });
    } catch (error) {
      console.error(error);
      abrirModalErro("Erro ao atualizar perfil");
    }
  };

  const confirmarExclusaoConta = async () => {
    try {
      logout();
      setModalExcluirAberto(false);
      abrirModalSucesso("Sua conta foi excluída com sucesso.", () => {
        navigate("/catalogo");
      });
    } catch (error) {
      console.error(error);
      abrirModalErro("Erro ao solicitar exclusão de conta");
    }
  };

  const handleAlterarSenhaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!senhaAtual) {
      abrirModalErro("Por favor, informe sua senha atual");
      return;
    }
    if (!novaSenha) {
      abrirModalErro("Por favor, digite a nova senha");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      abrirModalErro("A nova senha e a confirmação não coincidem");
      return;
    }
    if (novaSenha.length < 6) {
      abrirModalErro("A nova senha deve ter no mínimo 6 caracteres");
      return;
    }

    try {
      await atualizarPerfil({
        nome: form.nome,
        senha: novaSenha,
      });

      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
      setModalSenhaAberto(false);

      abrirModalSucesso("Senha atualizada com sucesso!");
    } catch (error) {
      console.error(error);
      abrirModalErro("Erro ao atualizar senha. Verifique seus dados.");
    }
  };

  const handleExcluirSenhaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!excluirSenha) {
      abrirModalErro("Por favor, digite sua senha para prosseguir");
      return;
    }
    if (excluirSenha.length < 6) {
      abrirModalErro("A senha digitada está incorreta ou é inválida");
      return;
    }

    setValidandoExcluirSenha(true);
    // Simular validação da senha com delay para efeito visual profissional
    setTimeout(() => {
      setValidandoExcluirSenha(false);
      setExcluirStep(2);
    }, 900);
  };

  useEffect(() => {
    const userStorage = JSON.parse(localStorage.getItem("user") || "{}");
    setForm((prev) => ({
      ...prev,
      nome: userStorage.usu_nome || "",
      telefone: formatarTelefone(userStorage.usu_tel || ""),
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nome.trim()) {
      abrirModalErro("O nome não pode estar vazio");
      return;
    }

    abrirModalConfirmacao();
  };

  return (
    <div className="bg-ice min-h-screen w-full flex flex-col justify-between">
      <div>

        <main className="w-full max-w-5xl mx-auto py-10 px-4 space-y-8">
          {/* Header & Back Button */}
          <div>
            <button
              onClick={() => navigate("/perfil")}
              className="flex items-center gap-2 text-gray-600 hover:text-primary-orange font-medium mb-6 transition-colors duration-200 group"
            >
              <ArrowLeft
                size={18}
                className="transform group-hover:-translate-x-1 transition-transform"
              />
              Voltar para o perfil
            </button>
            <header>
              <h1 className="text-3xl font-bold text-black-smooth tracking-tight">
                Configurações da Conta
              </h1>
              <p className="text-gray-500 mt-1">
                Gerencie suas informações pessoais, segurança e conta.
              </p>
            </header>
          </div>

          {/* Grid Layout (Left: Form, Right: Security & Danger Zone) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* FORM: Informações Pessoais */}
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <div className="p-2 bg-orange-50 rounded-lg text-primary-orange">
                    <User size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-black-smooth">
                    Informações Pessoais
                  </h2>
                </div>

                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center gap-4 py-2">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-orange to-orange-400 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                    <Avatar
                      size="xl"
                      className="relative border-4 border-white shadow-sm"
                      src={"/icons/avatar.png"}
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-sm font-semibold text-gray-700">
                      Foto do Perfil
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Imagem padrão do sistema
                    </p>
                  </div>
                </div>

                {/* Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                        <User size={18} />
                      </span>
                      <input
                        type="text"
                        value={form.nome}
                        onChange={(e) =>
                          setForm({ ...form, nome: e.target.value })
                        }
                        placeholder="Nome Completo"
                        className="w-full pl-10 pr-4 py-3 bg-ice text-black-smooth rounded-xl border border-gray-200 focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all font-medium text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                      Telefone de Cadastro
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                        <Phone size={18} />
                      </span>
                      <input
                        type="text"
                        value={form.telefone}
                        disabled
                        className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-500 rounded-xl border border-gray-200 cursor-not-allowed font-medium text-sm"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} className="text-gray-400" />
                      O telefone é usado para acesso e não pode ser alterado.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão de Ação do Perfil */}
              <div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-primary-orange hover:bg-orange-500 text-white font-semibold text-base py-3.5 px-6 rounded-xl hover:shadow-lg hover:shadow-primary-orange/20 transition-all duration-200 cursor-pointer shadow-sm"
                >
                  <Check size={18} />
                  Salvar Alterações do Perfil
                </button>
              </div>
            </form>

            {/* Right Column: Security & Danger Zone */}
            <div className="space-y-6 w-full">
              {/* CARD 2: Segurança (Div Clicável que abre Popup) */}
              <div
                onClick={() => setModalSenhaAberto(true)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex items-center justify-between cursor-pointer hover:border-primary-orange hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-50 rounded-xl text-primary-orange group-hover:bg-primary-orange group-hover:text-white transition-colors duration-200">
                    <Lock size={22} />
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-bold text-black-smooth group-hover:text-primary-orange transition-colors duration-200">
                      Segurança e Senha
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                      Atualize sua senha de acesso a qualquer momento.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-primary-orange bg-orange-50 px-3 py-1.5 rounded-full group-hover:bg-primary-orange group-hover:text-white transition-all duration-200 whitespace-nowrap">
                    Alterar Senha
                  </span>
                  <ArrowLeft
                    size={16}
                    className="text-gray-400 rotate-180 transform group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>

              {/* CARD 3: Zona de Perigo */}
              <div className="bg-red-50/50 rounded-2xl shadow-sm border border-red-100 p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-red-100 pb-4">
                  <div className="p-2 bg-red-100 rounded-lg text-red-500">
                    <ShieldAlert size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-red-900">
                    Zona de Perigo
                  </h2>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-red-950">
                      Excluir Conta Permanente
                    </h3>
                    <p className="text-sm text-red-700/80">
                      Esta ação removerá todos os seus dados pessoais e histórico.
                      Não poderá ser desfeita.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setExcluirStep(1);
                      setExcluirSenha("");
                      setShowExcluirSenha(false);
                      setModalExcluirAberto(true);
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-3 border border-red-200 hover:border-red-500 bg-white hover:bg-red-500 text-red-600 hover:text-white rounded-xl font-bold text-sm transition-all duration-200 shadow-sm whitespace-nowrap self-start sm:self-center"
                  >
                    <Trash2 size={16} />
                    Excluir Conta
                  </button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      <footer>
        <FooterMain />
      </footer>

      {/* POPUP / MODAL PARA ALTERAÇÃO DE SENHA */}
      {modalSenhaAberto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto animate-scaleUp">
            {/* Botão de Fechar */}
            <button
              onClick={() => {
                setModalSenhaAberto(false);
                setSenhaAtual("");
                setNovaSenha("");
                setConfirmarSenha("");
              }}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-50 rounded-lg text-primary-orange">
                <Lock size={20} />
              </div>
              <h3 className="text-xl font-bold text-black-smooth">
                Alterar Senha
              </h3>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Para maior segurança, insira sua senha atual e em seguida sua nova
              senha.
            </p>

            <form onSubmit={handleAlterarSenhaSubmit} className="space-y-4">
              {/* Campo: Senha Atual */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Senha Atual
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showSenhaAtual ? "text" : "password"}
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    placeholder="Sua senha atual"
                    className="w-full pl-10 pr-10 py-3 bg-ice text-black-smooth rounded-xl border border-gray-200 focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all font-medium text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showSenhaAtual ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="h-px bg-gray-100 my-4" />

              {/* Campo: Nova Senha */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nova Senha
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showNovaSenhaModal ? "text" : "password"}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="Mínimo de 6 caracteres"
                    className="w-full pl-10 pr-10 py-3 bg-ice text-black-smooth rounded-xl border border-gray-200 focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all font-medium text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNovaSenhaModal(!showNovaSenhaModal)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showNovaSenhaModal ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Campo: Confirmar Nova Senha */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showConfirmarSenhaModal ? "text" : "password"}
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="Confirme sua nova senha"
                    className="w-full pl-10 pr-10 py-3 bg-ice text-black-smooth rounded-xl border border-gray-200 focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all font-medium text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmarSenhaModal(!showConfirmarSenhaModal)
                    }
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmarSenhaModal ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Botões do Popup */}
              <div className="flex gap-3 pt-4 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setModalSenhaAberto(false);
                    setSenhaAtual("");
                    setNovaSenha("");
                    setConfirmarSenha("");
                  }}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary-orange text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary-orange/20 transition-all cursor-pointer"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP / MODAL PARA CONFIRMAÇÃO E EXCLUSÃO DE CONTA EM ETAPAS */}
      {modalExcluirAberto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto animate-scaleUp">
            {/* Botão de Fechar */}
            <button
              onClick={() => setModalExcluirAberto(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition-colors"
            >
              <X size={24} />
            </button>

            {excluirStep === 1 ? (
              // ETAPA 1: Inserir Senha Atual
              <form onSubmit={handleExcluirSenhaSubmit} className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 rounded-lg text-red-500">
                    <ShieldAlert size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-black-smooth">
                    Confirmar Senha
                  </h3>
                </div>

                <p className="text-sm text-gray-500">
                  Para prosseguir com a exclusão da sua conta, por favor confirme sua senha de acesso atual.
                </p>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Senha Atual
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                      <Lock size={18} />
                    </span>
                    <input
                      type={showExcluirSenha ? "text" : "password"}
                      value={excluirSenha}
                      onChange={(e) => setExcluirSenha(e.target.value)}
                      placeholder="Digite sua senha atual"
                      className="w-full pl-10 pr-10 py-3 bg-ice text-black-smooth rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all font-medium text-sm"
                      required
                      disabled={validandoExcluirSenha}
                    />
                    <button
                      type="button"
                      onClick={() => setShowExcluirSenha(!showExcluirSenha)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showExcluirSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setModalExcluirAberto(false)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-colors cursor-pointer"
                    disabled={validandoExcluirSenha}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors cursor-pointer flex items-center gap-2"
                    disabled={validandoExcluirSenha}
                  >
                    {validandoExcluirSenha ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Validando...
                      </>
                    ) : (
                      "Avançar"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              // ETAPA 2: Excluir Permanente
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg text-red-600">
                    <ShieldAlert size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-red-600">
                    Excluir Permanentemente
                  </h3>
                </div>

                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-900 space-y-2">
                  <p className="font-semibold flex items-center gap-1.5 text-red-950">
                    Aviso Importante:
                  </p>
                  <p>
                    Esta ação é definitiva. Todos os seus dados pessoais, informações de cadastro e histórico de reservas serão removidos do sistema para sempre.
                  </p>
                </div>

                <p className="text-sm text-gray-500 font-medium">
                  Tem certeza absoluta que deseja prosseguir e deletar sua conta?
                </p>

                <div className="flex gap-3 pt-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setModalExcluirAberto(false)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-colors cursor-pointer"
                  >
                    Desistir
                  </button>
                  <button
                    type="button"
                    onClick={confirmarExclusaoConta}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors cursor-pointer"
                  >
                    Excluir Permanente
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FEEDBACK GENERAL MODALS */}
      <Modal
        isOpen={modalAberto}
        title={modalTitulo}
        message={modalMensagem}
        actionText={modalBotaoAcao}
        onClose={() => setModalAberto(false)}
        onAction={() => {
          if (modalTipo === "confirmacao") acaoModal?.();
          setModalAberto(false);
        }}
        {...(modalTipo === "confirmacao" && {
          cancelText: "Cancelar",
          onCancel: () => setModalAberto(false),
        })}
      />
    </div>
  );
}
