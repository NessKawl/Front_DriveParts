import api from "./api";


export const dashboardGeralService = {
    async getReservasAtivas() {
        const response = await api.get("/dashboard/reservas/reservasAtivas");
        return response.data;
    },


    async listarReservas() {
        const response = await api.get("/dashboard/reservas/listarTodas");
        return response.data;
    },


    async getVendasUltimos30Dias() {
        const response = await api.get("/dashboard/vendas/ultimos30Dias");
        return response.data;
    },


    async getCaixaAtual(){
        const response = await api.get("/dashboard/caixa/caixaAtual");
        return response.data;
    },


    async listarVendas(){
        const response = await api.get("/dashboard/vendas/listarTodas");
        return response.data;
    }
};


