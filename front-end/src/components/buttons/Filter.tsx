import { useState } from "react";
import Button from "./Button";
import {FilterIcon, FilterX, FilterXIcon} from "lucide-react";

export default function Filter() {
    const [open, setOpen] = useState(false)
    return (
        <div className="flex justify-end m-5">
            <div className="bg-primary-orange p-2  flex felx-row">
                <Button
                    children="Filtar"
                    className="font-semibold"
                    onClick={() => setOpen(!open)}
                />
                <FilterX size={28} className="text-black-smooth" />
            </div>
        </div>
    );
}