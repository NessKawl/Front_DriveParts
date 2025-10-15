export default function Filter() {

    return (
        <div className="flex justify-end md:m-2">
            <select
                className="bg-primary-orange w-30 h-10 font-bold px-2 rounded-md sm:rounded-none "              
            >   
                <option value="">FILTRAR</option>
                <option
                    value="A-Z"
                    className="font-semibold text-lg sm:text-md sm:font-medium text-black-smooth bg-ice"
                >
                    De A - Z
                </option>
                <option
                    value="Z-A"
                    className="font-semibold text-lg sm:text-md sm:font-medium text-black-smooth bg-ice"
                >
                    De Z - A
                </option>
                <option
                    value="Menor"
                    className="font-semibold text-lg sm:text-md sm:font-medium text-black-smooth bg-ice"
                >
                    Preço Menor
                </option>
                <option
                    value="Maior"
                    className="font-semibold text-lg sm:text-md sm:font-medium text-black-smooth bg-ice"
                >
                    Preço Maior
                </option>
            </select>


        </div>
    );
}