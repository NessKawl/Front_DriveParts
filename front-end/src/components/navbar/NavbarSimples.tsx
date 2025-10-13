import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
    rota: string;
} 
export default function NavBarSimples({rota}: Props) {
    const navigate = useNavigate()
 return (
   <div className=" bg-primary-orange p-4 flex flex-col justify-between items-center">
        <div className="flex justify-between items-center w-full">
            <div>
                <button 
                    onClick={() => navigate("/" + rota)} 
                    className="mx-5">
                    <ArrowLeft size={28} className="text-black-smooth" />
                </button>
            </div>
            <div>
                <button onClick={() => window.location.href = "/"} >
                    <p className="text-black-smooth text-lg md:text-2xl font-bold">DriveParts</p>
                </button>
            </div>
        </div>
   </div>
 );
}