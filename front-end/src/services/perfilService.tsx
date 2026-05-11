import api from "./api";

interface UpdatePerfilData {
    nome: string;
    senha?: string;
}

export async function atualizarPerfil(data: UpdatePerfilData) {

    const response = await api.patch(
        "/perfil/atualizar",
        data
    );

    return response.data;
}