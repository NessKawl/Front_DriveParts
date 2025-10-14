import { useState } from "react";
import Button from "./Button";
import {ListFilter} from "lucide-react";


export default function Filter() {
    const [open, setOpen] = useState(false)
    return (
        <div className="flex justify-end md:m-5">
            <div className="bg-primary-orange px-2 py-1 md:px-4 md:mx-10  flex felx-row items-center gap-1">
                <Button
                    children="Filtar"
                    className="font-semibold text-lg md:text-xl cursor-pointer"
                    onClick={() => setOpen(!open)}
                />
                <ListFilter size={26} className="text-black-smooth" />
            </div>
        </div>
    );
}