import api from "./api";

// Autenticação

export const VerifyLogin = async (usu_tel: string, usu_senha: string) => {
    
    return await api.post("/auth/login", { usu_tel, usu_senha });
};

export const Register = async (usu_nome: string, usu_tel: string, usu_senha: string) => {
    try {
        
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