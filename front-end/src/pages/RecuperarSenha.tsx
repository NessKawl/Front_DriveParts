import { useNavigate } from "react-router-dom"
import Button from "../components/buttons/Button"
import NavBarSimples from "../components/navbar/NavbarSimples"
import FooterMain from "../components/footer/FooterMain"


export default function RecuperarSenha() {
    const navigate = useNavigate()
    return (
        <div className="bg-ice h-screen flex flex-col justify-between">
            <NavBarSimples rota={"catalogo"} />
            <div className="flex flex-col justify-center items-center ">
                <h1 className="text-4xl font-bold my-4">Redefinir senha</h1>
                <form
                    action=""
                    className="bg-white flex flex-col justify-between items-center p-10 rounded-2xl sm:rounded-none w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12">
                    <div className="w-full sm:w-10/12 flex flex-col gap-5 mb-4">
                        <div>
                            <div className="flex flex-col items-start">
                                <label htmlFor="" className="font-semibold">Nova senha</label>
                                <input
                                    id="senha"
                                    type="password"
                                    placeholder="Insira sua nova Senha"
                                    className="w-full border border-gray-300 rounded-lg p-2 "
                                />
                            </div>

                        </div>

                        <div>
                            <div className="flex flex-col items-start">
                                <label htmlFor="" className="font-semibold">Confirmar nova senha</label>
                                <input
                                    id="senha"
                                    type="password"
                                    placeholder="Confirme sua nova senha"
                                    className="w-full border border-gray-300 rounded-lg p-2 "
                                />
                            </div>

                        </div>

                    </div>
                    <Button
                        onClick={() => navigate("/login")}
                        children="Confirmar"
                        className="bg-ocean-blue text-ice font-semibold mt-8 mb-2 py-2 px-4 md:text-xl hover:bg-primary-orange"
                        type="submit"
                    />
                </form>
            </div>
            <footer className="relative w-full">
                <FooterMain />
            </footer>
        </div>
    )
}    