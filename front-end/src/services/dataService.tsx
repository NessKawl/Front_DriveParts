import api from "./api";



// Produtos

export const CadProduto = async (
    pro_nome: string,
    pro_valor: number,
    pro_marca: string,
    pro_cod: string,
    pro_status: any,
    pro_caminho_img: string,
    pro_estoque?: number

) => {
    try {
        console.log("Dados do produto:", {
            pro_nome,
            pro_valor,
            pro_marca,
            pro_cod,
            pro_status: pro_status === "Ativo",
            pro_caminho_img,
            pro_estoque

        });

        const response = await api.post("/produto/cadastro", {
            pro_nome,
            pro_valor,
            pro_marca,
            pro_cod,
            pro_status: pro_status === "Ativo",
            pro_caminho_img,
            pro_estoque
        });


        return response.data;
    } catch (error) {
        console.error("Erro ao cadastrar produto:", error);
        throw error;
    }
};

export const EditProduto = async (
    pro_id: number,
    pro_nome: string,
    pro_valor: number,
    pro_marca: string,
    pro_cod: string,
    pro_status: any,
    pro_caminho_img: string
) => {
    try {
        console.log("Editando produto:", {
            pro_id,
            pro_nome,
            pro_valor,
            pro_marca,
            pro_cod,
            pro_status: pro_status === "Ativo",
            pro_caminho_img,
        });

        const response = await api.patch(`/produto/atualiza/${pro_id}`, {
            pro_nome,
            pro_valor,
            pro_marca,
            pro_cod,
            pro_status: pro_status === "Ativo",
            pro_caminho_img,
        });

        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        throw error;
    }
};

export const GetProdutos = async () => {
    try {
        const response = await api.get("/produto");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        throw error;
    }
};

export const BuscaTodosProdutos = async () => {
    try {
        const response = await api.get("/produto/all");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        throw error;
    }
};


export const GetProdutosId = async (pro_id: number) => {
    const response = await api.get(`/produto/${pro_id}`);
    return response;
}

export const CriarMovimentacaoProduto = async (pro_id: number, mov_qtd: number, mov_tipo: "COMPRA" | "VENDA") => {
    const response = await api.post("/estoque/movimentacao", {
        pro_id,
        mov_qtd,
        mov_tipo
    })
    return response.data
}

export const BuscaProdutoPorNome = async (termo: string | null) => {
    return await api.get(`/produto/search?termo=${termo}`)
}

export const GetLastProduct = async () => {
    const response = await api.get('/produto/ultimo')
    return response.data;
}


export async function BuscaProdutoPorCategoria(categoria: string | null) {
    console.log("Essa é a categoria: ", categoria);
    return api.get(`/produto/categoria?categoria=${categoria}`);
}