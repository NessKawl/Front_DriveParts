import { useEffect, useState } from "react";
import ProductCard from "./CardProduto"
import { GetProdutos } from "../../services/dataService";


interface Produto {
    pro_id: number;
    pro_nome: string;
    pro_valor: number;
    pro_marca?: string;
    pro_cod?: string;
    pro_status?: boolean;
    pro_caminho_img?: string;
}


export default function ProductGridReco() {
    const [produtos, setProdutos] = useState<Produto[]>([])

    useEffect(() => {
        const fetchProdutos = async () => {
            const data = await GetProdutos();
            setProdutos(data);
        };
        fetchProdutos();
    }, []);

    const produtosRecomendados = produtos.map((p) => ({
        image: p.pro_caminho_img || "/sem-imagem.jpg",
        name: p.pro_nome,
        id: p.pro_id,
        price: `R$ ${p.pro_valor.toFixed(2).replace(".", ",")}`,
        // parcelas: "ou 6x sem juros",
    }))

    return (
        <div>
            <div className="p-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-2 sm:gap-6 md:gap-10">
                {produtosRecomendados.slice(0, 5).map((product, index) => (
                    <ProductCard
                        key={index}
                        image={product.image}
                        name={product.name}
                        price={product.price}
                        id={product.id}
                        // parcelas={product.parcelas}
                    />
                ))}
            </div>
        </div>

    )
}