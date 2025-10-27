import { useState } from "react";
import FormGenerator from "../../components/forms/FormGenerator";
import NavBarSimples from "../../components/navbar/NavbarSimples";
import Button from "../../components/buttons/Button";
import Avatar from "../../components/imagens/Avatar";

export default function EdiarPerefil() {
    const user = {
        nome: "João Silva",
        telefone: "(11) 98765-4321",
    };
    const [form, setForm] = useState({
        nome: user.nome,
        telefone: user.telefone,
        novaSenha: "",
        senha: "",
        confirmarSenha: "",
    });
    const fields = [
        { name: "nome", type: "text", placeholder: "Nome Completo", required: true },
        { name: "telefone", type: "text", placeholder: "Telefone", required: true },
        { name: "novaSenha", type: "password", placeholder: "Nova Senha", required: false },
        { name: "senha", type: "password", placeholder: "Senha", required: true },
        { name: "confirmarSenha", type: "password", placeholder: "Confirmar Senha", required: true },
    ];
    return (
        <div className="bg-ice h-screen ">
            <NavBarSimples rota={"perfil"} />
            <main className="flex flex-col justify-center items-center w-full ">
                <form className="flex flex-col items-center w-10/12 h-auto bg-white p-4">
                    <div className="w-full flex flex-col justify-center items-center my-5">
                        <h1 className="text-black-smooth md:text-4xl text-2xl font-bold">Editar Perfil</h1>
                        <Avatar size="xl" className={"my-4"} src={"/icons/avatar.png"} />
                        <p className="text-gray md:text-lg text-sm">Altere suas informações abaixo</p>
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
                        className={"bg-primary-orange md:text-xl sm:text-sm font-semibold text-black-smooth hover:text-ice px-4 py-2 mb-10 hover:shadow-sm hover:shadow-primary-orange mt-5"}
                    />
                </form>
            </main>
        </div>
    );
}