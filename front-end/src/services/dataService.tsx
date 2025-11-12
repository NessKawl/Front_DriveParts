import api from "./api";

// Autenticação

export const VerifyLogin = async (usu_tel: string, usu_senha: string) => {
    try {
        console.log("Enviando login:", { usu_tel, usu_senha });
        const response = await api.post("/auth/login", { usu_tel, usu_senha });
        return response.data;
    } catch (error) {
        console.error("Erro no login:", error);
        throw error;
    }
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
    try {
        const response = await api.get("/auth/me");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        throw error;
    }
};

// Produtos

export const CadProduto = async (
    pro_nome: string,
    pro_valor: number,
    pro_marca: string,
    pro_cod: string,
    pro_status: boolean,
    pro_caminho_img: string
) => {
    try {
        console.log("Dados do produto:", {
            pro_nome,
            pro_valor,
            pro_marca,
            pro_cod,
            pro_status,
            pro_caminho_img,
        });

        const response = await api.post("/produto/cadastro", {
            pro_nome,
            pro_valor,
            pro_marca,
            pro_cod,
            pro_status,
            pro_caminho_img,
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
            pro_status,
            pro_caminho_img,
        });

        const response = await api.patch(`/produto/atualiza/${pro_id}`, {
            pro_nome,
            pro_valor,
            pro_marca,
            pro_cod,
            pro_status: pro_status === true || pro_status === "true",
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
