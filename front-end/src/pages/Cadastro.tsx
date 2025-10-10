
export default function Cadastro() {
  return (
    <div>
      <div className="bg-primary-orange py-4 px-2">
        <div>
          <p className="text-black-smooth text-sm font-bold flex items-center justify-center">Mare Auto Peças</p>
        </div>
      </div>
      <div className="m-15 mb-15">
        <h1 className="text-4xl font-bold flex justify-center items-center">Crie sua conta</h1>
      </div>
      <div className="ml-8 mr-8">
        <div>
          <label htmlFor="telefone" className="font-semibold">Telefone</label>
          <input 
          id="telefone"
          type="text"
          placeholder="DDD + número"
          className = "w-full border border-gray-300 rounded-lg p-2 "
          />
        </div>
        <div className="mt-8">
          <label htmlFor="nome" className="font-semibold">Nome</label>
          <input 
          id="nome"
          type="text"
          placeholder="Insira seu nome completo"
          className = "w-full border border-gray-300 rounded-lg p-2 "
          />
        </div>
        <div className="mt-8">
          <label htmlFor="Senha" className="font-semibold">Senha</label>
          <input 
          id="Senha"
          type="password"
          placeholder="Insira uma senha"
          className = "w-full border border-gray-300 rounded-lg p-2 "
          />
        </div>
        <div className="mt-8 mb-8">
          <label htmlFor="Senha" className="font-semibold">Senha</label>
          <input 
          id="Senha"
          type="password"
          placeholder="Confirme sua senha"
          className = "w-full border border-gray-300 rounded-lg p-2 "
          />
        </div>
        <div className="pt-8 flex items-center justify-center">
          <button type="submit" className="mb-8 pl-4 pr-4 font-semibold bg-blue-600 text-white py-2 rounded-lg ">
            Continuar
          </button>
        </div>
      </div>
      <footer>
        
      </footer>
    </div>
  )
}