import CardEstatistica from "../../components/cards/CardEstatistica"
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
            <div className="flex flex-1 flex-col justify-center items-center p-5 gap-5">
                <div className="flex fle-row justify-between w-full">
                    <CardEstatistica
                        titulo="RESERVAS ATIVAS"
                        valor="30"
                    />
                    <CardEstatistica
                        titulo="VENDAS NOS ULTIMOS 30 DIAS"
                        valor="30"
                    />
                    <CardEstatistica
                        titulo="CAIXA ATUAL (R$)"
                        valor="30.000,00"
                    />
                    
                </div>
                

                <GraficoLinhas data={data} />

            </div>
        </div>
    )
}

