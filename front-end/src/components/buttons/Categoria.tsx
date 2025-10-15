import { useNavigate } from "react-router-dom";

type CategoriaProps = {
    name: string;
};
export default function Categoria({ name }: CategoriaProps) {
  const navigate = useNavigate();
 return (
   <div>
        <button 
            className="flex justify-end w-full text-black-smooth hover:text-ice font-bold text-xl md:text-lg border-b md:border-primary-orange border-black-smooth/10 hover:border-b hover:border-ice"
            onClick={() => navigate(`/pesquisa?categoria=${name}`)}
        >
          {name}
        </button>
   </div>
 );
}