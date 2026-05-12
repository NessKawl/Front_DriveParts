import api from "./api";

export const dashProdutosService = {
    async CriarMovimentacaoProduto(
        pro_id: number,
        mov_qtd: number,
        mov_tipo: string,
        mov_data: string
    ) {
        const response = await api.post("/estoque/movimentacao/manual", {
            pro_id,
            mov_qtd,
            mov_tipo,
            mov_data,
        });

        return response.data;
    }
};