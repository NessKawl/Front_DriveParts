import imagem from "../../assets/pneu.jpg";

export default function ImagemProduto() { // Corrigi o nome da função para PascalCase (consistência em React)
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden shadow-sm/20">
      <img 
        src={imagem} 
        alt="Produto" 
        className="w-full h-full object-cover lg:object-contain" // Mudança aqui: contain em desktop para mostrar inteira
      />
    </div>
  );
}
