import Filter from "../components/buttons/Filter";
import NavBar from "../components/navbar/NavBar";

export default function Pesquisa() {
  return (
    <div className="bg-ice min-h-screen">
      <div>
        <NavBar/>
      </div>
      <div>
        <Filter/>
      </div>
    </div>
  );
}