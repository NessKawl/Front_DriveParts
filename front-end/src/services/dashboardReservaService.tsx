import api from "./api";


export const dashboardReservaService = {
  async listarReservas() {
    const response = await api.get("/dashboard/reservas/listarTodas");
    return response.data;
  },


  async atualizarStatusReserva(ven_id: number, status: "CANCELADA") {
    const response = await api.patch(`/dashboard/reservas/${ven_id}/status`, { status });
    return response.data;
  },


  async getReservasAtivas() {
    const response = await api.get("/dashboard/reservas/reservasAtivas");
    return response.data;
  }
};
