import api from "./api";


export const dashboardCaixaService = {
    async getCaixaAtual() {
        const response = await api.get("/dashboard/caixa/caixaAtual");
        return response.data;
    },


    getVendasPorPagamento: async (): Promise<{ formaPagamento: string; valor: number }[]> => {
        const { data } = await api.get("/dashboard/vendas/vendasPorPagamento");
        return data;
    },


    async getMovimentacoes() {
        const { data } = await api.get("/dashboard/caixa/movimentacoes");
        return data;
    }
};
