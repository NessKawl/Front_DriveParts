type CategoriaProps = {
    name: string;
};
export default function Categoria({ name }: CategoriaProps) {
 return (
   <div>
        <button 
            className="text-black-smooth hover:text-ice font-semibold text-xl md:text-lg hover:border-b border-ice"
            onClick={() => window.location.href = `/pesquisa?categoria=${name}`}
        >
          {name}
        </button>
   </div>
 );
}