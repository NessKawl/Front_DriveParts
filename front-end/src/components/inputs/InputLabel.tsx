interface InputLabelProps {
    label?: string
    id: string
    type: string
    placeholder?: string
    classNameLABEL?: string
    classNameINPUT?: string
}
export default function InputLabel({label, id, type, placeholder, classNameLABEL, classNameINPUT}: InputLabelProps) {
    return (
        <div>
            <div>
                <label htmlFor="telefone" className={classNameLABEL}>{label}</label>
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    className={classNameINPUT}
                />
            </div>
        </div>
    );
}