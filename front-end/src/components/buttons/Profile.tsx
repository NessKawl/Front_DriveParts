import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ProfileProps = {
  name?: string | null;
}

function handleLogin() {
  // Lógica para redirecionar para a página de login
    window.location.href = "/login";
}

export default function Profile({ name }: ProfileProps) {
  const navigate = useNavigate();
 return (
   <div className="flex flex-row items-center gap-2 cursor-pointer">
        <button onClick={() => name ? navigate("/perfil") : handleLogin()} className="flex flex-row items-center gap-2">
          <div className="text-right border-r border-gray pr-2">
            {name ? <p className="font-light">Bem vindo(a)</p> : <p className="font-light">Acessar conta</p>}
            <p className="font-bold">{name}</p>
          </div>
          <div className="border border-light-gray p-1 rounded-full">
            <User size={32} />
          </div>
        </button>
   </div>
 );
}