import api from "./api";

export const enviarCodigoRecuperacao =
    async (telefone: string) => {
        const response = await api.post("/esqueci-senha/solicitar", { telefone });
        return response.data;
    };

export const validarCodigoRecuperacao = async (telefone: string, codigo: string) => {
    const response =
        await api.post(
            "/esqueci-senha/validar",
            {
                telefone,
                codigo,
            }
        );

    return response.data;
};

export const redefinirSenha = async (telefone: string, codigo: string, novaSenha: string) => {
    const response =
        await api.post(
            "/esqueci-senha/redefinir",
            {
                telefone,
                codigo,
                novaSenha,
            }
        );

    return response.data;
};