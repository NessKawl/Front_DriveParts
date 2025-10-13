export default function inputQtd() {
    return(
        <div>
            <p className="text-[16px]">Selecione a quantidade: </p>

            <input type="number" min={1} className="mt-2 px-2 w-full bg-white shadow-lg/30" placeholder="Digite a quantidade..." />
        </div>
    )
}