import api from "./api";

// Autenticação

export const VerifyLogin = async (usu_tel: string, usu_senha: string) => {
    console.log("Enviando login:", { usu_tel, usu_senha });
    return await api.post("/auth/login", { usu_tel, usu_senha });
};

export const Register = async (usu_nome: string, usu_tel: string, usu_senha: string) => {
    try {
        console.log("Recebendo cadastro:", { usu_nome, usu_tel, usu_senha });
        const response = await api.post("/auth/register", { usu_nome, usu_tel, usu_senha });
        return response.data;
    } catch (error) {
        console.error("Erro no registro:", error);
        throw error;
    }
};

export const getUserProfile = async () => {
    return await api.get("/auth/me");
};

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

export const CadEspecificacao = async (
    esp_nome: string[],
    cat_id: number
) => {
    try {

        console.log("Dados das especificações: ", {
            esp_nome,
            cat_id
        });

        const response = await api.post("/produto/cadastroEsp", {
            esp_nome, cat_id
        })

        return response
    } catch (error) {
        console.error("Erro ao cadastrar especificação:, ", error)
        throw error
    }
}

export async function VincularEspecificacao(pro_id: number, esp_id: number) {
    return api.post("/produto/especificacao", { pro_id, esp_id });
}


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

export async function BuscaProdutoPorCategoria(categoria: string | null) {
    console.log("Essa é a categoria: ", categoria);
    return api.get(`/produto/categoria?categoria=${categoria}`);
}