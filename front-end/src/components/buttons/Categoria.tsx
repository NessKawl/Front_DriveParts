type CategoriaProps = {
    name: string;
};
export default function Categoria({ name }: CategoriaProps) {
 return (
   <div>
        <button 
            className="text-black-smooth hover:text-ice font-semibold text-xl md:text-lg border-b border-primary-orange hover:border-b hover:border-ice"
            onClick={() => window.location.href = `/pesquisa?categoria=${name}`}
        >
          {name}
        </button>
   </div>
 );
}