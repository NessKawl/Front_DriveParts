import { useState, useEffect } from "react";
import FormGenerator from "../../components/forms/FormGenerator";
import NavBarSimples from "../../components/navbar/NavbarSimples";
import Button from "../../components/buttons/Button";
import Avatar from "../../components/imagens/Avatar";
import { atualizarPerfil } from "../../services/perfilService";
import Modal from "../../components/modal/Modal";

export default function EditarPerfil() {
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
    novaSenha: "",
    confirmarSenha: "",
  });

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
  setModalTitulo("Confirmar alteração");
  setModalMensagem("Deseja realmente salvar as alterações do perfil?");
  setModalBotaoAcao("Salvar");

  setAcaoModal(() => confirmarAtualizacao);

  setModalAberto(true);
};

const confirmarAtualizacao = async () => {
  try {
    const response = await atualizarPerfil({
      nome: form.nome,
      senha: form.novaSenha || undefined,
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

    abrirModalSucesso("Perfil atualizado com sucesso!", () => {
      window.location.href = "/perfil";
    });

  } catch (error) {
    console.error(error);
    abrirModalErro("Erro ao atualizar perfil");
  }
};

  useEffect(() => {
    const userStorage = JSON.parse(localStorage.getItem("user") || "{}");

    setForm((prev) => ({
      ...prev,
      nome: userStorage.usu_nome || "",
      telefone: formatarTelefone(userStorage.usu_tel || ""),
    }));
  }, []);

  const fields = [
    {
      name: "nome",
      type: "text",
      placeholder: "Nome Completo",
      required: true,
    },
    {
      name: "telefone",
      type: "text",
      placeholder: "Telefone",
      disabled: true,
    },
    {
      name: "novaSenha",
      type: "password",
      placeholder: "Nova Senha",
      required: false,
    },
    {
      name: "confirmarSenha",
      type: "password",
      placeholder: "Confirmar Senha",
      required: false,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (form.novaSenha !== form.confirmarSenha) {
    abrirModalErro("As senhas não coincidem");
    return;
  }

  abrirModalConfirmacao();
};

  return (
    <div className="bg-ice min-h-screen">
      <NavBarSimples rota={"perfil"} />

      <main className="flex flex-col justify-center items-center w-full py-10 px-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full max-w-xl h-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100"
        >
          <div className="w-full flex flex-col justify-center items-center mb-8">
            <h1 className="text-black-smooth md:text-4xl text-2xl font-bold tracking-tight">
              Editar Perfil
            </h1>

            <div className="relative group my-6">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-orange to-orange-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <Avatar 
                size="xl" 
                className="relative border-4 border-white shadow-md transform transition duration-500 group-hover:scale-105" 
                src={"/icons/avatar.png"} 
              />
            </div>

            <p className="text-gray-500 md:text-lg text-sm text-center">
              Mantenha seus dados atualizados para uma melhor experiência
            </p>
          </div>

          <div className="w-full space-y-6">
            <FormGenerator
              fields={fields}
              form={form}
              setForm={setForm}
              className="grid grid-cols-1 gap-6"
            />
          </div>

          <div className="w-full mt-10">
            <Button
              type="submit"
              className="w-full bg-primary-orange md:text-xl text-lg font-bold text-black-smooth hover:text-white px-6 py-4 rounded-2xl shadow-lg shadow-primary-orange/30 hover:shadow-xl hover:shadow-primary-orange/40 transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
            >
              Salvar Alterações
            </Button>
          </div>
        </form>
      </main>

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
