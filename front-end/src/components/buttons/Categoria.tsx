import { useNavigate } from "react-router-dom";
import { Wrench, Zap, Droplet, Settings, Gauge, Filter } from "lucide-react";

type CategoriaProps = {
  name: string;
  icon?: string;
};

export default function Categoria({ name, icon }: CategoriaProps) {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (icon) {
      case "engine": return <Wrench size={18} />;
      case "brake": return <Gauge size={18} />;
      case "shock": return <Settings size={18} />;
      case "bolt": return <Zap size={18} />;
      case "filter": return <Filter size={18} />;
      case "oil": return <Droplet size={18} />;
      default: return <Wrench size={18} />;
    }
  };

  return (
    <button
      onClick={() => navigate(`/pesquisa?categoria=${name}`)}
      className="flex items-center justify-between w-full md:w-auto bg-white md:bg-transparent md:shadow-none shadow-sm hover:shadow-md md:hover:shadow-none text-black-smooth md:hover:text-white hover:text-primary-orange font-semibold md:font-bold text-lg px-4 py-3 md:p-0 rounded-lg border border-transparent hover:border-primary-orange transition-all duration-200"
    >
      <span>{name}</span>
      <span className="text-primary-orange">{getIcon()}</span>
    </button>
  );
}
