import { Search as SearchIcon } from "lucide-react"
export default function Search() {
 return (
   <div className="bg-ice p-1 flex flex-row items-center ">
        
        <input 
          type="text" 
          name="search" 
          id=""
          placeholder="Pesquise"
          className="bg-ice"
          />
          <SearchIcon className=" left-3 text-black-smooth" size={20}/>
   </div>
 );
}