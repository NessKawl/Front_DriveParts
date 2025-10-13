export default function  informacoes() {
    return(
        <div>
            <p className="text-lg lg:text-2xl font-semibold ">Características do Produto</p>

            <div className="mx-5">
                <ul className="list-disc text-sm lg:text-base">
                <li className="mt-3">Marca: Goodyear</li>
                <li className="mt-3">Modelo: Kelly Edge</li>
                <li className="mt-3">Índice de carga: 88</li>
                <li className="mt-3">Velocidade máxima: 210 km/h</li>
                <li className="mt-3">Design da banda de rodagem simétrico</li>
            </ul>
            </div>
        </div>
    )
}