import Search from "../inputs/Search.tsx";

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Profile from "../buttons/Profile.tsx";
export default function navbar() {

  const [open, setOpen] = useState(false)
  return (
    <div className="bg-primary-orange py-4 px-2 flex justify-between items-center">
      <div>
        <p className="text-black-smooth text-sm font-bold">DriveParts</p>
      </div>
      <Search />

      <button onClick={() => setOpen(!open)} className="md:hidden ">
        <Menu size={28} className="text-black-smooth" />
      </button>

      <nav className="hidden md:flex gap-6">
        <a href="/" className="hover:text-blue-400">Início</a>
        <a href="/catalogo" className="hover:text-blue-400">Catálogo</a>
        <a href="/sobre" className="hover:text-blue-400">Sobre</a>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 0 }}
            className="absolute top-0 right-0 w-full h-full bg-black/50 flex justify-end  md:hidden"
          >
            <div className="w-10/12 h-full bg-primary-orange flex flex-col gap-8 pt-4 px-4">
              <div className="w-full px-4 flex justify-between items-center">
                <button onClick={() => setOpen(!open)}>
                  <X size={28} className="text-black-smooth" />
                </button>
                <p className="text-black-smooth text-sm font-bold">DriveParts</p>
              </div>
              <div className="flex justify-center items-center">
                <Profile/>
              </div>

              <a href="/" className="hover:text-blue-400" onClick={() => setOpen(false)}>Início</a>
              <a href="/catalogo" className="hover:text-blue-400" onClick={() => setOpen(false)}>Catálogo</a>
              <a href="/sobre" className="hover:text-blue-400" onClick={() => setOpen(false)}>Sobre</a>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}