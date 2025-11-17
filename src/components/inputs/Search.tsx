import { Search as SearchIcon } from "lucide-react"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
export default function Search() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate()

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    console.log("Search query:", query);
  };
  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    navigate(`/pesquisa?produto=${encodeURIComponent(query)}`)
  }
  return (
    <div className="bg-ice px-2 py-1 rounded-xl md:rounded-none ">
      <form
        onSubmit={handleSearch}
        className="flex flex-row items-center justify-between">
        <input
          type="text"
          name="search"
          id=""
          placeholder="Pesquisar..."
          className="bg-ice font-semibold placeholder:text-gray outline-none text-black-smooth text-md w-full"
          value={query}
          onChange={handleInputChange}
        />
        <button
          className="cursor-pointer"
          type="submit">
          <SearchIcon className="text-black-smooth mr-1" size={18} />
        </button>
      </form>



    </div>
  );
}