import { useNavigate } from "react-router-dom";

interface Produto {
    pro_id: number;
    pro_nome: string;
    pro_valor: number;
    pro_marca?: string;
    pro_cod?: string;
    pro_status?: boolean;
    pro_caminho_img?: string;
}

export default function PesquisaGrid({ products }: { products: Produto[] }) {
    const navigate = useNavigate()

    return (
        <div className="w-full flex justify-center">
            <div className="
                grid 
                grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 
                gap-2 md:gap-4 xl:gap-8 
                mx-2 mt-5"
            >
                {products.map((product) => (
                    <div
                        key={product.pro_id}
                        onClick={() => navigate(`/detalhe-produto?id=${product.pro_id}`)}
                        className="
                            w-full h-44 sm:w-56 sm:h-76 
                            bg-white 
                            rounded-md sm:rounded-lg
                            shadow-md hover:shadow-primary-orange/40
                            p-2 
                            hover:scale-105 transition
                            flex flex-row sm:flex-col sm:justify-between sm:items-center"
                    >
                        <div className="hidden sm:flex flex-col items-center">
                            <img
                                src={product.pro_caminho_img}
                                alt={product.pro_nome}
                                className="w-40 h-full sm:h-40 "
                            />
                            <div>
                                <p className="text-sm font-medium">{product.pro_nome}</p>
                            </div>

                        </div>
                        <img
                            src={product.pro_caminho_img}
                            alt={product.pro_nome}
                            className="w-40 h-full sm:h-40 sm:hidden"
                        />
                        <div className="flex flex-col justify-between items-start w-full mt-2">
                            <p className="text-md font-medium sm:hidden line-clamp-3">{product.pro_nome}</p>
                            <div>
                                <p className="text-2xl text-pear-green font-bold">
                                    R$ {product.pro_valor.toFixed(2).replace(".", ",")}
                                </p>
                                {/* <p className="text-sm font-light">{product.parcelas}</p> */}
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}