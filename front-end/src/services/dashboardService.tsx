import api from "./api"; 

export const dashboardService = {
  async listarReservas() {
    const response = await api.get("/dashboard/reservas");
    return response.data;
  },

  async atualizarStatusReserva(ven_id: number, status: "CANCELADA" | "EXPIRADA") {
    const response = await api.patch(`/dashboard/reservas/${ven_id}/status`, { status });
    return response.data;
  },
};
