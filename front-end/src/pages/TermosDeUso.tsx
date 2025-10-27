import NavBarSimples from "../components/navbar/NavbarSimples"

export default function TermsoDeUso() {
    return (
        <div className="bg-ice h-screen">
            <NavBarSimples rota={"cadastro"} />
            <div className="flex flex-col justify-center items-center h-full">
                <h1>Termos de Uso</h1>
                <p>Aqui estarão os termos de uso do aplicativo.</p>
            </div>

        </div>
    );
}