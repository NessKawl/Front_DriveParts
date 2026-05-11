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
    <div className="bg-ice h-screen">
      <NavBarSimples rota={"perfil"} />

      <main className="flex flex-col justify-center items-center w-full">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-10/12 h-auto bg-white p-4"
        >
          <div className="w-full flex flex-col justify-center items-center my-5">
            <h1 className="text-black-smooth md:text-4xl text-2xl font-bold">
              Editar Perfil
            </h1>

            <Avatar size="xl" className={"my-4"} src={"/icons/avatar.png"} />

            <p className="text-gray md:text-lg text-sm">
              Altere suas informações abaixo
            </p>
          </div>

          <div className="flex-1 w-10/12">
            <FormGenerator
              fields={fields}
              form={form}
              setForm={setForm}
              className="grid grid-cols-1 gap-4"
            />
          </div>

          <Button
            children={"Salvar Alterações"}
            type="submit"
            className={
              "bg-primary-orange md:text-xl sm:text-sm font-semibold text-black-smooth hover:text-ice px-4 py-2 mb-10 hover:shadow-sm hover:shadow-primary-orange mt-5 rounded-md"
            }
          />
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
