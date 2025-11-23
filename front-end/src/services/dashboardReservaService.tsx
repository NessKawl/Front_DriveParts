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
  },

  async buscarReservaPorId(ven_id: number) {
    const response = await api.get(`/reserva/${ven_id}`);
    return response.data;
  },

  async buscarProduto(termo: string) {
    const response = await api.get(`/reserva/busca?termo=${termo}`);
    return response.data;
  },

  async adicionarItemVenda(pro_id: number, quantidade: number, valorUnitario: number) {
    const response = await api.post("/reserva/adicionarItem", {
      pro_id,
      quantidade,
      ite_valor_unit: valorUnitario 
    });
    return response.data;
  },


  async finalizarVenda(ven_id: number, formaPagamento: string) {
    const response = await api.patch(`/reserva/${ven_id}/finalizar`, {
      formaPagamento, // default para 1 se não informado
    });
    return response.data;
  },

  async removerItemVenda(ven_id: number, pro_id: number) {
    return api.delete(`/reserva/${ven_id}/item/${pro_id}`);
  }
};
