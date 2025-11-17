import api from "./api";

export const dashboardGeralService = {
    async getReservasAtivas() {
        const response = await api.get("/dashboard/reserva/reservasAtivas");
        return response.data; // deve ser um número
    },

    async listarReservas() {
        const response = await api.get("/dashboard/reserva/listarTodas");
        return response.data;
    },

    async getVendasUltimos30Dias() {
        const response = await api.get("/dashboard/geral/ultimos30Dias");
        return response.data;
    },

    async getCaixaAtual(){
        const response = await api.get("/dashboard/caixa-atual");
        return response.data;
    },

    async listarVendas() {
        const response = await api.get("/dashboard/reserva/listarTodas");
        return response.data;
    },
};
