import GraficoLinhas from "../../components/graficos/GraficoLinhas"
import NavBarDashboard from "../../components/navbar/NavBarDashboard"
const data = [
    { name: "Jan", vendas: 400 },
    { name: "Fev", vendas: 800 },
    { name: "Mar", vendas: 600 },
    { name: "Abr", vendas: 1000 },
    { name: "Mai", vendas: 750 },
]
export default function DashGeral() {
    return (
        <div className="flex bg-black-smooth/95">
            <NavBarDashboard page="Geral" />
            <div className="flex m-auto items-center text-white">

                <div className="grid grid-cols-3 gap-20">
                    <div className="bg-black-smooth w-50 h-30 flex flex-col">
                        <span className="text-primary-orange ps-1">RESERVAS</span>
                        <span className="text-center mt-2 text-5xl">30</span>
                    </div>
                    <div className="bg-black-smooth flex flex-col">
                        <span className="text-primary-orange ps-1">VENDAS (30 DIAS)</span>
                        <span className="text-center mt-2 text-5xl">123</span>
                    </div>
                    <div className="bg-black-smooth flex flex-col">
                        <span className="text-primary-orange ps-1">CAIXA</span>
                        <span className="text-center mt-4 text-3xl">R$150,00</span>
                    </div>
                    <div className="bg-black-smooth col-span-3 h-80">
                        <span className="text-primary-orange ps-1">GRÁFICO</span>
                        <span></span>
                    </div>

                </div>
                <GraficoLinhas data={data} />

            </div>
        </div>
    )
}

