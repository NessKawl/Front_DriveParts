export default function Filter() {
  return (
    <div className="flex justify-end md:m-2 relative">
      <select
        defaultValue=""
        className="appearance-none bg-primary-orange text-white font-bold px-4 py-2 rounded-md sm:rounded-none w-32 outline-none border-none cursor-pointer focus:ring-2 focus:ring-white transition duration-200"
      >
        <option value="" disabled hidden>
          FILTRAR
        </option>
        <option
          value="A-Z"
          className="font-semibold text-black-smooth bg-ice"
        >
          De A - Z
        </option>
        <option
          value="Z-A"
          className="font-semibold text-black-smooth bg-ice"
        >
          De Z - A
        </option>
        <option
          value="Menor"
          className="font-semibold text-black-smooth bg-ice"
        >
          Preço Menor
        </option>
        <option
          value="Maior"
          className="font-semibold text-black-smooth bg-ice"
        >
          Preço Maior
        </option>
      </select>

      {/* Seta customizada */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
