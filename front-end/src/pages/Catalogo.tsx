import { useNavigate } from "react-router-dom"
export default function Catalogo() {
    const navigate = useNavigate()
    return (
         <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Catálogo de Peças</h1>
      <button
        className="bg-gray-700 text-white px-4 py-2 rounded"
        onClick={() => navigate("/")}
      >
        Voltar
      </button>
    </div>
    )
}