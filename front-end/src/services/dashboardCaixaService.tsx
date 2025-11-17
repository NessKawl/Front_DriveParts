import api from "./api";

export const dashboardCaixaService = {
    async getCaixaAtual() {
        const response = await api.get("/dashboard/caixa-atual");
        return response.data;
    },

    getVendasPorPagamento: async (): Promise<{ formaPagamento: string; valor: number }[]> => {
        const { data } = await api.get("/dashboard/vendas-por-pagamento");
        return data;
    },

    async getMovimentacoes() {
        const { data } = await api.get("/dashboard/movimentacoes");
        return data;
    }
};