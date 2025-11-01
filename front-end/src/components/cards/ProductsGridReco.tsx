import ProductCard from "./CardProduto"
    
export default function ProductGridReco() {
    const products = [
        {
            image: "/produtos/pneu.png",
            name: "Pneu Aro 13 Goodyear 165/70R13 Assurance Maxlife 83T",
            price: "R$ 424,90",
            parcelas: "ou 6x de R$ 70,82 sem juros",
        },
        {
            image: "/produtos/oleo.png",
            name: "ÓLEO DE MOTOR - LUBRAX MINERAL DIESEL 15W40 (1 LITRO)",
            price: "R$ 35,90",
        },
        {
            image: "/produtos/cabecote.png",
            name: "JUNTA CABECOTE (5 PICS) - AMIANTO - L200 GL/ GLS - AJUSA - AJU10070330",
            price: "R$ 308,34",
            parcelas: "ou 6x de R$ 51,39",
        },
    ]
    return (
        <div>
            <div className="p-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-2 sm:gap-6 md:gap-10">
                {products.map((product, index) => (
                    <ProductCard
                        key={index}
                        image={product.image}
                        name={product.name}
                        price={product.price}
                        parcelas={product.parcelas}
                    />
                ))}
            </div>
        </div>

    )
}