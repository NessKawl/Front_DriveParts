interface FilterTableProps {
    value: string,
    children: React.ReactNode,
}


export default function FilterTable({ titulo, FilterTableProps = [], }: {
    titulo: any,
    FilterTableProps?: FilterTableProps[],
}) {
    return (
        <div className="flex justify-end md:m-1 relative">
            <select
                defaultValue=""
                className="appearance-none bg-black-smooth text-primary-orange font-bold px-2 rounded-md sm:rounded-none w-32 outline-none border cursor-pointer transition duration-200 h-8"
            >
                <option value="" disabled hidden>
                    {titulo}
                </option>
                {FilterTableProps.map((option, index) => (
                    <option
                        key={index}
                        value={option.value}
                        className="font-semibold text-ice bg-black-smooth"
                    >
                        {option.children}
                    </option>
                ))}

            </select>

            {/* Seta customizada */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                    className="w-4 h-4 text-primary-orange"
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