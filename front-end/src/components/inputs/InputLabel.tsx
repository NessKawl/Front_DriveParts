interface InputLabelProps {
    label?: string
    id: string
    type: string
    placeholder?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    classNameLABEL?: string
    classNameINPUT?: string
}
export default function InputLabel({label, id, type, placeholder, classNameLABEL, classNameINPUT, onChange}: InputLabelProps) {
    return (
        <div>
            <div className="flex flex-col">
                <label htmlFor="telefone" className={classNameLABEL}>{label}</label>
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    className={classNameINPUT}
                    onChange={onChange}
                />
            </div>
        </div>
    );
}