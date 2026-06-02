import { useNavigate } from "react-router-dom";
import Button from "../components/buttons/Button";
import NavBarSimples from "../components/navbar/NavbarSimples";
import FooterMain from "../components/footer/FooterMain";
import { useState } from "react";
import { enviarCodigoRecuperacao } from "../services/esqueciSenhaService";

export default function RecuperarSenha() {
    const [telefone, setTelefone] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            const telefoneLimpo =telefone.replace(/\D/g,"");

            console.log(telefoneLimpo);

            const response = await enviarCodigoRecuperacao(telefoneLimpo);

            console.log(response);

            // Salva telefone para próxima tela
            localStorage.setItem(
                "telefone_recuperacao",
                telefoneLimpo
            );

            navigate("/verificacao");

        } catch (error) {
            console.error(error);

            alert("Erro ao enviar código.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-ice h-screen flex flex-col justify-between">
            <NavBarSimples rota={"catalogo"} />

            <div className="flex flex-col justify-center items-center">
                <h1 className="text-4xl font-bold my-4 mt-12 mb-12">
                    Informe seu número de telefone
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white flex flex-col justify-between items-center p-10 rounded-2xl sm:rounded-none w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12"
                >
                    <div className="w-full sm:w-10/12 flex flex-col gap-5 mb-4">
                        <div className="flex flex-col items-start">
                            <label className="font-semibold">
                                Telefone
                            </label>

                            <input
                                id="telefone"
                                type="tel"
                                value={telefone}
                                onChange={(e) =>setTelefone(e.target.value)}
                                placeholder="Insira seu número de telefone"
                                className="w-full border border-gray-300 rounded-lg p-2"
                                required
                            />
                        </div>
                    </div>

                    <Button
                        children={loading ? "Enviando...": "Confirmar"}
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