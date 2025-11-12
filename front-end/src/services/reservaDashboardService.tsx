import axios from "axios";

const API_URL = "http://localhost:3000/dashboard/reservas"; // ajuste conforme o seu backend

export async function buscarReservasDashboard(token: string) {
  const response = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function buscarReservaPorIdDashboard(id: number, token: string) {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function cancelarReservaDashboard(id: number, token: string) {
  const response = await axios.put(
    `${API_URL}/${id}/cancelar`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}
