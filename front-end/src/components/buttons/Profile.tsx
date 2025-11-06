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
   <div className="flex flex-row items-center cursor-pointer">
        <button 
          onClick={() => name ? navigate("/perfil") : handleLogin()} 
          className="flex flex-row items-center gap-1 cursor-pointer">
          <div className="text-right border-r border-gray pr-2">
            {name ? <p className="font-light text-sm md:text-lg ">Bem vindo(a) </p> : <p className="font-light text-sm md:text-lg">Acessar conta</p>}
            <p className="font-bold text-sm md:text-lg">{name}</p>
          </div>
          <div className="hidden md:block border border-light-gray p-1 rounded-full">
            <User size={28} />
          </div>
        </button>
   </div>
 );
}