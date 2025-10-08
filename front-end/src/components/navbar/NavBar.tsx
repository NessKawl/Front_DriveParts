import Search from "../inputs/Search.tsx";
export default function navbar() {
 return (
   <div className="bg-primary-orange p-4 flex justify-between items-center">
        <div>
            <p className="text-black-smooth text-sm font-bold">DriveParts</p>
        </div>
        <Search/>
   </div>
 );
}