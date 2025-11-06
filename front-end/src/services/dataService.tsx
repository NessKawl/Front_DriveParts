import api from "./api";

export const VerifyLogin = async (usu_tel: string, usu_senha: string) => {
    console.log("Enviando login:", { usu_tel, usu_senha }); // debug
    return await api.post("/auth/login", {
        usu_tel,
        usu_senha,
    });
};

export const getUserProfile = async () => {
    return await api.get("/auth/me");
};
