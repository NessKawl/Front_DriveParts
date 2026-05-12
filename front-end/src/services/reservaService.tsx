import axios from "axios";

const API_URL = "http://localhost:3000/reserva";

export async function criarReservaBackend(
  pro_aux_uuid: string | null,
  quantidade: number,
  periodo: string
) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Usuário não logado");



  const response = await axios.post(
    API_URL,
    { pro_aux_uuid, ite_qtd: quantidade, periodo },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data;
}
