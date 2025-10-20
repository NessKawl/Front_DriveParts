import { useState } from "react";
import Button from "../buttons/Button";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

interface ButtonProps {
  page: string
}
export default function NavBarDashboard( {page}: ButtonProps) {
  const [isActive, setIsActive] = useState(page);
  const navigate = useNavigate();
  function handleClick(e: string) {
    setIsActive(e);
    navigate(`/dashboard/${e}`);
  }
 return (
   <div className="bg-black-smooth border-r border-gray-100/20 w-50 text-center text-white flex flex-col justify-between max-h-screen lg:min-h-screen font-bold">
      <h2 className="p-2 text-xl">Mare Auto Peças</h2>
      <div className="flex flex-col">
        <Button
         children="Geral"
         className={clsx("w-full h-26 md:h-20 border-t border-gray-100/20 bg-black-smooth p-5  text-xl", isActive === "Geral" && "bg-primary-orange text-black-smooth", isActive !== "Geral" && "hover:text-primary-orange")}
         onClick={() => handleClick("Geral")}
         
      />
      <Button
         children="Reservas"
         className={clsx("w-full h-26 md:h-20 border-t border-gray-100/20 bg-black-smooth p-5  text-xl", isActive === "Reserva" && "bg-primary-orange text-black-smooth", isActive !== "Reserva" && "hover:text-primary-orange")}
         onClick={() => handleClick("Reserva")}
      />
      <Button
         children="Vendas"
         className={clsx("w-full h-26 md:h-20 border-t border-gray-100/20 bg-black-smooth p-5  text-xl", isActive === "Vendas" && "bg-primary-orange text-black-smooth", isActive !== "Vendas" && "hover:text-primary-orange")}
         onClick={() => handleClick("Vendas")}
      />
      <Button
         children="Caixa"
         className={clsx("w-full h-26 md:h-20 border-t border-gray-100/20 bg-black-smooth p-5  text-xl", isActive === "Caixa" && "bg-primary-orange text-black-smooth", isActive !== "Caixa" && "hover:text-primary-orange")}
         onClick={() => handleClick("Caixa")}
      />
      <Button
         children="Produtos"
         className={clsx("w-full h-26 md:h-20 border-y border-gray-100/20 bg-black-smooth p-5 text-xl", isActive === "Produtos" && "bg-primary-orange text-black-smooth", isActive !== "Produtos" && "hover:text-primary-orange")}
         onClick={() => handleClick("Produtos")}
      />
      </div>
      <Button
         children="Sair"
         className="w-full h-20 border-t border-red-alert text-red-alert p-5 text-xl"
         onClick={() => navigate("/")}
      />
   </div>
 );
}