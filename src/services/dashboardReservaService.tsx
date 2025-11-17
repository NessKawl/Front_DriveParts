import api from "./api";

export const dashboardReservaService = {
  async listarReservas() {
    const response = await api.get("/dashboard/reserva/listarTodas");
    return response.data;
  },

  async atualizarStatusReserva(ven_id: number, status: "CANCELADA") {
    const response = await api.patch(`/dashboard/reserva/${ven_id}/status`, { status });
    return response.data;
  },

  async getReservasAtivas() {
    const response = await api.get("/dashboard/reserva/reservasAtivas");
    return response.data;
  }
};
