import axios from "axios";

const API_URL = "http://localhost:3000/reserva";

export async function criarReservaBackend(pro_id: number, quantidade: number, periodo: string) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Usuário não logado");

  

  const response = await axios.post(
    API_URL,
    { pro_id, ite_qtd: quantidade, periodo },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data;
}
