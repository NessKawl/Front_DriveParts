export default function selecionarPeriodo() {
    return (
        <div>
            <p className="text-[16px]">Selecione um período para retirada: </p>

            <div className="flex justify-center mt-5">
                <button className="rounded-xl bg-primary-orange text-ice px-10 py-2 mx-2">Manhã</button>
                <button className="rounded-xl bg-primary-orange text-ice px-10 py-2 mx-2">Tarde</button>

            </div>
        </div>
    )
}
