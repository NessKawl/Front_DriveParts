import { useNavigate } from "react-router-dom";
import Button from "../components/buttons/Button";
import NavBarSimples from "../components/navbar/NavbarSimples";
import FooterMain from "../components/footer/FooterMain";
import { useState } from "react";

import {
    redefinirSenha,
} from "../services/esqueciSenhaService";

export default function RecuperarSenha() {
    const navigate =
        useNavigate();

    const [senha, setSenha] =
        useState("");

    const [
        confirmarSenha,
        setConfirmarSenha,
    ] = useState("");

    const [loading, setLoading] =
        useState(false);

    const handleSubmit =
        async (e: React.FormEvent) => {
            e.preventDefault();

            try {
                if (senha !== confirmarSenha) {
                    alert(
                        "As senhas não coincidem."
                    );
                    return;
                }

                if (senha.length < 6) {
                    alert("A senha precisa ter pelo menos 6 caracteres.");
                    return;
                }

                setLoading(true);

                const telefone = localStorage.getItem("telefone_recuperacao");

                const codigo = localStorage.getItem("codigo_recuperacao");

                if (!telefone || !codigo) {
                    alert("Dados da recuperação inválidos.");
                    return;
                }

                const response =
                    await redefinirSenha(
                        telefone,
                        codigo,
                        senha
                    );
                // limpa storage
                localStorage.removeItem("telefone_recuperacao");

                localStorage.removeItem("codigo_recuperacao");

                alert("Senha redefinida com sucesso!");

                navigate("/login");

            } catch (error) {
                alert("Erro ao redefinir senha.");
            } finally {
                setLoading(false);
            }
        };

    return (
        <div className="bg-ice h-screen flex flex-col justify-between">
            <NavBarSimples rota={"catalogo"} />

            <div className="flex flex-col justify-center items-center">
                <h1 className="text-4xl font-bold my-4">
                    Redefinir senha
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white flex flex-col justify-between items-center p-10 rounded-2xl sm:rounded-none w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12"
                >
                    <div className="w-full sm:w-10/12 flex flex-col gap-5 mb-4">

                        <div className="flex flex-col items-start">
                            <label className="font-semibold">
                                Nova senha
                            </label>

                            <input
                                type="password"
                                value={senha}
                                onChange={(e) =>
                                    setSenha(e.target.value)
                                }
                                placeholder="Insira sua nova senha"
                                className="w-full border border-gray-300 rounded-lg p-2"
                                required
                            />
                        </div>

                        <div className="flex flex-col items-start">
                            <label className="font-semibold">
                                Confirmar nova senha
                            </label>

                            <input
                                type="password"
                                value={confirmarSenha}
                                onChange={(e) =>
                                    setConfirmarSenha(e.target.value)
                                }
                                placeholder="Confirme sua nova senha"
                                className="w-full border border-gray-300 rounded-lg p-2"
                                required
                            />
                        </div>
                    </div>

                    <Button
                        children={loading ? "Salvando..." : "Confirmar"}
                        className="bg-ocean-blue text-ice font-semibold mt-8 mb-2 py-2 px-4 md:text-xl hover:bg-primary-orange"
                        type="submit"
                    />
                </form>
            </div>

            <footer className="relative w-full">
                <FooterMain />
            </footer>
        </div>
    );
}