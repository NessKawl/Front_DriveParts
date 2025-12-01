import api from "./api";

export const CadEspecificacao = async (
    esp_nome: string[],
    cat_id: number
) => {
    try {

        console.log("Dados das especificações: ", {
            esp_nome,
            cat_id
        });

        const response = await api.post("/especificacao/cadastroEsp", {
            esp_nome, cat_id
        })

        return response
    } catch (error) {
        console.error("Erro ao cadastrar especificação:, ", error)
        throw error
    }
}

export async function VincularEspecificacao(
    pro_id: number,
    esp_id: number[],
    valores: string[],
    metricaIds: number[]
) {
    const esp = esp_id.map((id, index) => ({
        esp_id: id,
        pro_esp_valor: valores[index],
        met_id: metricaIds[index]
    }));

    return api.post("/especificacao/vinculaEsp", { pro_id, esp });
}

export const GetLastEsp = async () => {
    const response = await api.get('/especificacao/ultimaEsp')
    return response.data
}

export const BuscaMetricas = async () => {
    try {
        const response = await api.get("/especificacao/metricas");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar metrica:", error);
        throw error;
    }
}