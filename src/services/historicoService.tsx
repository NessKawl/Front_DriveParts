import axios from "axios";

const API_URL = "http://localhost:3000/perfil";

export async function getReservasAtivas(token: string) {
  const response = await axios.get(`${API_URL}/reservas/ativas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getHistoricoGeral(token: string) {
  const response = await axios.get(`${API_URL}/reservas/geral`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
