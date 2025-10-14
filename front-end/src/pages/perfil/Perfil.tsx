import Button from "../../components/buttons/Button";
import ProductsGrid from "../../components/cards/ProductsGrid";
import Avatar from "../../components/imagens/Avatar";
import NavBarSimples from "../../components/navbar/NavbarSimples";
import FooterMain from "../../components/footer/FooterMain";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
    const navigate = useNavigate()
    return (
        <div className="bg-ice min-h-screen ">
            <NavBarSimples rota={"catalogo"} />
            <main>
                <div className="w-full flex flex-col justify-center items-center mt-10">
                    <h1 className="text-black-smooth md:text-4xl text-2xl font-bold">Suas informações</h1>
                </div>
                <div className="w-full flex justify-center items-center my-5">
                    <div className="bg-white md:w-4/12 w-10/12 h-auto p-4 rounded-2xl">
                        <div className="w-full flex items-end justify-end">
                            <Button
                                children={"Editar"}
                                onClick={() => navigate("/editar-perfil")}
                                className={"bg-primary-orange md:text-xl sm:text-sm font-semibold text-black-smooth hover:text-ice p-2 rounded-xs hover:shadow-sm hover:shadow-primary-orange"}
                            />
                        </div>
                        <div className="flex flex-col justify-center items-center border-b border-b-gray-300 pb-6">
                            <Avatar
                                src="/icons/avatar.png"
                                alt="Avatar"
                                size="xl2"
                                className="mx-auto"
                            />
                            <div className="flex flex-col justify-start items-start">
                                <p>Nome: <span className="font-bold md:text-2xl text-xl text-black-smooth">Fulano da Silva</span></p>
                                <p>Telefone: <span className="font-bold md:text-2xl text-xl text-black-smooth">(11) 98765-4321</span></p>
                            </div>

                        </div>
                        <div className="w-full flex justify-center items-center mt-10">
                            <Button
                                children={"Sair"}
                                onClick={() => navigate("/catalogo")}
                                className={"bg-red-alert text-xl font-semibold text-ice hover:text-black-smooth py-2 md:px-10 px-8 hover:shadow-sm hover:shadow-primary-orange rounded-md"}
                            />
                        </div>
                    </div>
                </div>
                <div className="md:px-10">
                    <h2 className="md:text-3xl text-xl font-semibold border-b border-gray-300 p-2">Suas Reservas</h2>
                    <ProductsGrid tipo="reservasAtivas" />
                </div>
                <div className="md:px-10">
                    <h2 className="md:text-3xl text-xl font-semibold border-b border-gray-300 p-2">Histórico de Reservas</h2>
                    <ProductsGrid  tipo="historico"/>
                </div>
            </main>
            <footer>
                <FooterMain/>
            </footer>
        </div>
    )
}