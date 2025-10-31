import Search from "../inputs/Search.tsx";

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Profile from "../buttons/Profile.tsx";
import Categoria from "../buttons/Categoria.tsx";
import Avatar from "../imagens/Avatar.tsx";
import { useNavigate } from "react-router-dom";
export default function navbar() {

  const [open, setOpen] = useState(false)
  const navigate = useNavigate();
  return (
    <div className=" bg-primary-orange py-4 px-2 flex flex-col justify-between items-center ">
      <div className="flex justify-between items-center w-full">
        <div>
          <button onClick={() => window.location.href = "/"} >
            <p className="text-black-smooth text-xl md:text-2xl font-bold">DriveParts</p>
          </button>

        </div>
        <div className="hidden md:block md:w-6/12">
          <Search />
        </div>
        <div className="flex gap-2 mb-2">
          <Profile name={"Mare Autopeças"} />
          <button onClick={() => setOpen(!open)} className="md:hidden ">
            <Menu size={30} className="text-black-smooth" />
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="fixed inset-0 z-[9999] top-0 right-0 w-full h-full bg-black/60 flex justify-end md:hidden"
            >
              <div className="relative w-9/12 h-full bg-gradient-to-b from-[#fffdfa] to-[#f5f5f5] flex flex-col gap-8 border-l border-primary-orange rounded-l-3xl shadow-xl overflow-y-auto">

                {/* Header */}
                <div className="bg-primary-orange px-4 pt-5 pb-4 rounded-tl-3xl shadow-md">
                  <div className="flex justify-between items-center">
                    <button onClick={() => setOpen(!open)}>
                      <X size={28} className="text-black-smooth" />
                    </button>
                    <p className="text-black-smooth text-lg font-bold tracking-tight">DriveParts</p>
                  </div>

                  <div
                    className="flex justify-end items-center mt-4 cursor-pointer hover:opacity-80 transition"
                    onClick={() => navigate("/perfil")}
                  >
                    <div className="text-right mr-3">
                      <p className="text-sm text-black-smooth/80">Bem vindo(a)</p>
                      <p className="text-base font-bold text-black-smooth">Mare Autopeças</p>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-primary-orange blur-sm opacity-50" />
                      <Avatar
                        src="https://avatars.githubusercontent.com/u/52288913?v=4"
                        alt="Avatar do usuário"
                        size="md"
                        className="relative border-2 border-white shadow-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Categorias */}
                <div className="flex flex-col gap-3 px-4 mb-10">
                  <h2 className="text-black-smooth text-lg font-bold text-right border-b border-primary-orange pb-1 tracking-tight">
                    CATEGORIAS
                  </h2>

                  <div className="flex flex-col gap-3 mt-2">
                    <Categoria name="Motor" icon="engine" />
                    <Categoria name="Freios" icon="brake" />
                    <Categoria name="Suspensão" icon="shock" />
                    <Categoria name="Elétrica" icon="bolt" />
                    <Categoria name="Filtros" icon="filter" />
                    <Categoria name="Óleos e Lubrificantes" icon="oil" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      <div className="md:hidden w-11/12">
        <Search />
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