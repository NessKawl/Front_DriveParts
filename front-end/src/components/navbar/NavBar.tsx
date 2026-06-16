import Search from "../inputs/Search.tsx";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Categoria from "../buttons/Categoria.tsx";
import Avatar from "../imagens/Avatar.tsx";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

export default function NavBar() {
  const userStorage = JSON.parse(localStorage.getItem("user") || "{}");

  const [user, setUser] = useState({
    nome: userStorage.usu_nome || "",
    usu_tipo: userStorage.usu_tipo || "",
  });

  useEffect(() => {
    function atualizarUsuario() {
      const updatedUser = JSON.parse(localStorage.getItem("user") || "{}");

      setUser({
        nome: updatedUser.usu_nome || "",
        usu_tipo: updatedUser.usu_tipo || "",
      });
    }

    atualizarUsuario();

    window.addEventListener("storage", atualizarUsuario);

    return () => {
      window.removeEventListener("storage", atualizarUsuario);
    };
  }, []);

  function action() {
    if (user.nome) {
      navigate("/perfil");
    } else {
      navigate("/login");
    }
  }
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className=" bg-primary-orange py-4 px-2 flex flex-col justify-between items-center ">
      <div className="flex justify-between items-center w-full">
        <div className="h-20 md:h-15 md:w-1/12">
          <button
            onClick={() =>
              user.usu_tipo == "ADMIN"
                ? navigate("/dashboard/geral")
                : navigate("/catalogo")
            }
            className=" cursor-pointer "
          >
            <img
              src="/logo-black-full.png"
              alt=""
              className="absolute  md:block hidden md:w-25 top-0 "
            />
            <img
              src="/logo-black-mini.png"
              alt=""
              className="absolute md:hidden block w-30 top-10"
            />
          </button>
        </div>
        {/*Barra de pesquisa desktop e menu mobile*/}
        <div className="flex md:items-center justify-end gap-10 w-full">
          {/*Categorias da barra de menu*/}
          <div className="md:w-6/12 hidden md:flex justify-center">
            <nav className="md:flex gap-6">
              <Categoria name="Motor" />
              <Categoria name="Freios" />
              <Categoria name="Suspensão" />
              <Categoria name="Elétrica" />
              <Categoria name="Filtros" />
              <Categoria name="Óleos e Lubrificantes" />
            </nav>
          </div>
          <div className="flex flex-row items-center justify-end gap-10 w-6/12">
            <div className="w-8/12 hidden md:block">
              <Search />
            </div>

            <div className="flex gap-2 mb-2">
              <div className="flex flex-row gap-2" onClick={() => action()}>
                <div className="flex flex-col text-right border-r border-black-smooth pr-3 items-end justify-center cursor-pointer">
                  {user.nome ? (
                    <p className="font-light text-sm">Bem vindo(a)</p>
                  ) : (
                    <p className="font-semibold text-md">Acessar conta</p>
                  )}
                  <p className="font-semibold text-xl">{user.nome}</p>
                </div>
              </div>
              <div
                className="relative hidden md:block cursor-pointer"
                onClick={() => action()}
              >
                <div className="absolute inset-0 rounded-full bg-primary-orange blur-sm opacity-50" />

                <Avatar
                  src="/icons/avatar.png"
                  alt="Avatar do usuário"
                  size="md"
                  className="relative shadow-lg"
                />
              </div>
              <button onClick={() => setOpen(!open)} className="md:hidden ">
                <Menu size={30} className="text-black-smooth" />
              </button>
            </div>
          </div>
        </div>
        {/*Animação de entrada e saida do menu mobile*/}
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
                    <img
                      src="/logo-black-mini.png"
                      alt=""
                      className="md:hidden block w-35 "
                    />
                  </div>
                  <div
                    className={clsx(
                      "flex justify-end items-center mt-4 cursor-pointer hover:opacity-80 transition",
                    )}
                    onClick={() =>
                      user.nome ? navigate("/perfil") : navigate("/login")
                    }
                  >
                    <div className="text-right mr-3">
                      <div className="text-right border-r border-black-smooth pr-3 items-center">
                        {user.nome ? (
                          <p className="font-light text-sm md:text-lg">
                            Bem vindo(a)
                          </p>
                        ) : (
                          <p className="font-semibold text-md">Acessar conta</p>
                        )}
                        <p className="font-bold text-sm md:text-lg">
                          {user.nome}
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-primary-orange blur-sm opacity-50" />

                      <Avatar
                        src="/icons/avatar.png"
                        alt="Avatar do usuário"
                        size="md"
                        className="relative shadow-lg"
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
                    <Categoria name="Suspensão" icon="blinds" />
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

      {/*Barra de pesquisa mobile*/}
      <div className="md:hidden w-11/12">
        <Search />
      </div>
    </div>
  );
}
