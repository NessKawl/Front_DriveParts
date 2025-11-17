import clsx from "clsx";
interface FilterTableProps {
    value: string,
    children: React.ReactNode,
}


export default function FilterTable({ titulo, FilterTableProps = [], color = "black", onChange }: {
    titulo: any,
    color?: "black" | "orange",
    FilterTableProps?: FilterTableProps[],
    onChange?: (value: string) => void
}) {

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (onChange) {
            onChange(event.target.value);
        }
    };

    return (
        <div className="flex justify-end md:m-1 relative">
            <select
                defaultValue=""
                className={clsx("appearance-none  font-bold px-2 rounded-md sm:rounded-none w-32 lg:w-44 outline-none border cursor-pointer transition duration-200 h-8", color === "black" ? "bg-black-smooth text-primary-orange" : "bg-primary-orange text-black-smooth border-none")}
                onChange={handleChange}
            >
                <option value="" disabled hidden>
                    {titulo}
                </option>
                {FilterTableProps.map((option, index) => (
                    <option
                        key={index}
                        value={option.value}
                        className={clsx("font-semibold ", color === "black" ? "text-ice bg-black-smooth" : "text-black-smooth bg-ice")}
                    >
                        {option.children}
                    </option>
                ))}

            </select>

            {/* Seta customizada */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                    className={clsx("w-4 h-4 ", color === "black" ? "text-primary-orange" : "text-black-smooth")}
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