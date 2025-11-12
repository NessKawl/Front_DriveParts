    import api from "./api";

    export const VerifyLogin = async (usu_tel: string, usu_senha: string) => {
        console.log("Enviando login:", { usu_tel, usu_senha }); // debug
        return await api.post("/auth/login", {
            usu_tel,
            usu_senha,
        });
    };

    export const Register = async (usu_nome: string, usu_tel: string, usu_senha: string ) => {
        console.log("Recebendo cadastro: ", {usu_nome, usu_tel, usu_senha});
        return await api.post("/auth/register", {
            usu_nome,
            usu_tel,
            usu_senha
        })
    };

    export const CadProduto = async (pro_nome: string, pro_valor: number, pro_marca: string, pro_cod: string, pro_status: boolean, pro_caminho_img: string) => {
        console.log("Dados produto: ", {pro_nome, pro_valor, pro_marca, pro_cod, pro_status, pro_caminho_img});
        return await api.post("/produto/cadastro", {
            pro_nome,
            pro_valor,
            pro_marca,
            pro_cod,
            pro_status,
            pro_caminho_img
        })
    }

    export const getUserProfile = async () => {
        return await api.get("/auth/me");
    };
