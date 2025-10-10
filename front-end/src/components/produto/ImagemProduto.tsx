import imagem from "../../assets/pneu.jpg"

export default function imagemProduto() {
    return (
        <div className="w-full h-full flex items-center justify-center overflow-hidden shadow-sm/20">
            <img src={imagem} alt="Produto" className="w-full object-cover" />
        </div>
    )
}