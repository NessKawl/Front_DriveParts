//import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ProductsGrid from "../components/cards/ProductsGrid.tsx"
import InfiniteProductCarousel from "../components/carrosel/InfiniteProductCarousel.tsx"
import FooterMain from "../components/footer/FooterMain.tsx"
import Banner from "../components/imagens/Banner.tsx"
import NavBar from "../components/navbar/NavBar.tsx"
import { BuscaProdutoPorCategoria, GetProdutos } from "../services/dataService.tsx"


interface Produto { 
    pro_id: number;
    pro_nome: string;
    pro_valor: number;
    pro_marca?: string;
    pro_cod?: string;
    pro_status?: boolean;
    pro_caminho_img?: string;
}

export default function Catalogo() {

    const navigate = useNavigate()
    const [produtosAcessorios, setProdutosAcessorios] = useState<Produto[]>([])
    const [produtos, setProdutos] = useState<Produto[]>([])

    useEffect(() => {
        const fetchProdutos = async () => {
            const data = await GetProdutos();
            setProdutos(data);
        };
        fetchProdutos();
    }, []);

    useEffect(() => {
        const fetchProdutosAcessorios = async () => {
            try {
                const resultados = await BuscaProdutoPorCategoria("Acessórios");
                setProdutosAcessorios(resultados.data || []);
            } catch (error) {
                console.error("Erro ao buscar acessórios:", error);
                setProdutosAcessorios([]);
            }
        };
        fetchProdutosAcessorios();
    }, []); // E

    const productsGridMaisVendidos = produtos.map((p) => ({
        image: p.pro_caminho_img || "/sem-imagem.jpg",
        name: p.pro_nome,
        id: p.pro_id,
        price: `R$ ${p.pro_valor.toFixed(2).replace(".", ",")}`,
        parcelas: "ou 6x sem juros",
    }));

    const produtosCarrossel = produtosAcessorios.map((p) => ({
        image: p.pro_caminho_img || "/sem-imagem.jpg",
        name: p.pro_nome,
        id: p.pro_id,
        price: `R$ ${p.pro_valor.toFixed(2).replace(".", ",")}`,
    }))

    const handleCardClick = (id: number) => {
        navigate(`/detalhe-produto?id=${id}`)
    }

    return (
        <div className="bg-ice min-h-screen ">
            <aside >
                <NavBar />
            </aside>

            <main className="w-full">
                <div className="w-full h-auto flex items-center justify-center mt-2 ">
                    <Banner />
                </div>
                <div >
                    <InfiniteProductCarousel products={produtosCarrossel} speed={35} onCardClick={handleCardClick} />
                </div>

                <div className="md:mt-10 mx-4 flex justify-center">
                    <ProductsGrid
                        title="Mais vendidos"
                        tipo="catalogo"
                        products={productsGridMaisVendidos}
                    />
                </div>
            </main>
            <footer>
                <FooterMain />
            </footer>
        </div>
    )
}