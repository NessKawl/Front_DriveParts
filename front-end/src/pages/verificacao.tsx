import NavBarSimples from "../components/navbar/NavbarSimples";
import { useNavigate } from "react-router-dom";
import Button from "../components/buttons/Button";
import { useState } from "react";

import {
  validarCodigoRecuperacao,
} from "../services/esqueciSenhaService";

export default function Verificacao() {
  const navigate = useNavigate();

  const [codigo, setCodigo] =
    useState<string[]>(["", "", "", "", ""]);

  const [loading, setLoading] =
    useState(false);

  const handleChange = (value: string,index: number) => {
    if (!/^\d?$/.test(value))
      return;

    const novoCodigo = [...codigo];

    novoCodigo[index] = value;

    setCodigo(novoCodigo);

    // vai pro próximo input
    if (value &&index < 4) {
      const nextInput = document.getElementById(`code-${index + 1}`);
    
      nextInput?.focus();
    }
  };

  const handleVerificar =
    async () => {
      try {
        setLoading(true);

        const telefone = localStorage.getItem("telefone_recuperacao");

        if (!telefone) {
          alert("Telefone não encontrado.");
          return;
        }

        const codigoFinal = codigo.join("");

        if (codigoFinal.length !== 5) {
          alert("Digite os 5 números.");
          return;
        }

        const response = await validarCodigoRecuperacao(telefone, codigoFinal);

        console.log(response);

        // salva código validado
        localStorage.setItem(
          "codigo_recuperacao",
          codigoFinal
        );

        navigate("/recuperar-senha");

      } catch (error) {
        alert("Código inválido ou expirado.");
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="bg-ice h-screen">
      <NavBarSimples rota={"login"} />

      <div className="flex flex-col justify-center items-center mt-6">
        <h1 className="text-xl font-bold flex justify-center items-center mb-4">
          Verificação de Segurança
        </h1>

        <div className="bg-white flex flex-col justify-between items-center p-10 rounded-2xl sm:rounded-none w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12">
          <p className="font-medium text-lg mb-6">
            Para proteger sua conta,
            enviamos um código
            de verificação
            para o número
            cadastrado
          </p>

          <h2 className="font-light text-start w-full mb-2">
            Código de verificação
          </h2>

          <div className="w-full sm:w-10/12 flex flex-row justify-center items-center gap-3">
            {codigo.map((value,index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleChange(e.target.value,index)}
                  className="w-10 h-12 sm:w-18 sm:h-16 border border-gray-300 rounded-lg text-2xl text-center focus:border-primary-orange focus:outline-none"
                />
              )
            )}
          </div>

          <button
            onClick={() =>console.log("Reenviar código")}
            className="w-full text-end font-semibold mb-8"
          >
            Reenviar código
          </button>

          <Button
            onClick={handleVerificar}
            children={loading ? "Verificando..." : "Verificar"
            }
            className="bg-pear-green text-ice font-semibold py-2 px-4 md:text-xl rounded-xl hover:bg-primary-orange"
          />
        </div>
      </div>
    </div>
  );
}