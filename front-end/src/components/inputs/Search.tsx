import { Search as SearchIcon } from "lucide-react"
export default function Search() {
 return (
   <div className="bg-ice px-1 py-0.5 flex flex-row items-center ">
        
        <input 
          type="text" 
          name="search" 
          id=""
          placeholder="Pesquise..."
          className="bg-ice font-semibold placeholder:text-gray outline-none text-black-smooth text-md"
          />
          <SearchIcon className="text-black-smooth mr-1" size={18}/>

   </div>
 );
}