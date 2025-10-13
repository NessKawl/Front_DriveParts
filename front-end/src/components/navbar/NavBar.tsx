import Search from "../inputs/Search.tsx";

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Profile from "../buttons/Profile.tsx";
import Categoria from "../buttons/Categoria.tsx";
export default function navbar() {

  const [open, setOpen] = useState(false)
  return (
    <div className=" bg-primary-orange py-4 px-2 flex flex-col justify-between items-center ">
      <div className="flex justify-between items-center w-full">
        <div>
          <button onClick={() => window.location.href = "/"} >
            <p className="text-black-smooth text-sm md:text-2xl font-bold">DriveParts</p>
          </button>

        </div>
        <div className="md:w-6/12">
          <Search />
        </div>


        <button onClick={() => setOpen(!open)} className="md:hidden ">
          <Menu size={28} className="text-black-smooth" />
        </button>

        <div className="hidden md:flex">
          <Profile name={"Mare Autopeças"} />
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 0 }}
              className="fixed inset-0 z-[9999] top-0 right-0 w-full h-full bg-black/60 flex justify-end  md:hidden"
            >
              <div className="relative w-9/12 h-full bg-primary-orange flex flex-col gap-8 pt-4 px-4">
                <div className="w-full px-4 flex justify-between items-center">
                  <button onClick={() => setOpen(!open)}>
                    <X size={28} className="text-black-smooth" />
                  </button>
                  <p className="text-black-smooth text-sm font-bold">DriveParts</p>
                </div>
                <div className="flex justify-center items-center border-b-1 border-gray pb-2">
                  <Profile name={"Mare Autopeças"} />
                </div>
                <h2 className="text-black-smooth text-md font-bold text-right">CATEGORIAS</h2>
                <Categoria name="Motor" />
                <Categoria name="Freios" />
                <Categoria name="Suspensão" />
                <Categoria name="Elétrica" />
                <Categoria name="Filtros" />
                <Categoria name="Óleos e Lubrificantes" />
                
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div>
        <nav className="hidden md:flex gap-6">
          <Categoria name="Motor" />
          <Categoria name="Freios" />
          <Categoria name="Suspensão" />
          <Categoria name="Elétrica" />
          <Categoria name="Filtros" />
          <Categoria name="Óleos e Lubrificantes" />
        </nav>
      </div>

    </div>
  );
}