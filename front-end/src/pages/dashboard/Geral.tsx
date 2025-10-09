export default function Gearal() {
    return (
        <div className="flex bg-black-smooth/95">

            <div className="bg-black-smooth border-primary-orange border-r-2 w-50 text-center text-white flex flex-col min-h-screen font-bold">

                <div className="mt-5">
                    <h1>Mare Auto Peças</h1>
                </div>

                <div className="m-auto w-50">
                    <div className="border-t border-primary-orange bg-primary-orange p-5 text-black ">Geral</div>
                    <div className="border-t border-primary-orange p-5">Reservas</div>
                    <div className="border-t border-primary-orange p-5">Venda</div>
                    <div className="border-t border-primary-orange p-5">Caixa</div>
                    <div className="border-t border-primary-orange border-b p-5">Produtos</div>
                </div>

                <div className="border-t border-red-alert text-red-alert p-5">Sair</div>
            </div>

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


            </div>
        </div>
    )
}

