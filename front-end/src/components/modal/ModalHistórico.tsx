import { X } from "lucide-react";

interface ModalReservaProps {
    isOpen: boolean;
    dados: any;
    onClose: () => void;
}

export default function ModalReserva({ isOpen, dados, onClose }: ModalReservaProps) {
    if (!isOpen || !dados) return null;

    // Define a cor do status
    let statusColor = "text-gray-700";
    if (dados.ven_status === "CONCLUIDA") statusColor = "text-pear-green";
    if (dados.ven_status === "RESERVA") statusColor = "text-primary-orange";
    if (dados.ven_status === "CANCELADA" || dados.ven_status === "EXPIRADA") statusColor = "text-red-alert";

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-4 sm:p-6 w-[90%] max-w-md text-center shadow-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-end mb-3">
                    <X
                        size={30}
                        color="#000000ff"
                        onClick={onClose}
                        className="cursor-pointer hover:scale-110 transition-transform"
                    />
                </div>

                <h2 className="text-xl text-center font-bold mb-2">
                    {dados.ite_itemVenda[0].pro_produto?.pro_nome}
                </h2>

                <div className="w-100 h-1 bg-gray-200 mx-auto mb-6 rounded-full"></div>

                <p className="mb-2">
                    <span className="font-semibold">Código da Reserva:</span> #{dados.ven_id}
                </p>
                <p className="mb-2">
                    <span className="font-semibold">Data da reserva:</span> {new Date(dados.ven_data_criacao).toLocaleDateString("pt-BR")}
                </p>

                {dados.ite_itemVenda?.length > 0 && (
                    <div className="flex flex-col items-center gap-4">
                        {dados.ite_itemVenda.map((item: any, index: number) => (
                            <div key={index} className="text-center">
                                <p className="mb-2">
                                    <span className="font-semibold">Produto:</span> {item.pro_produto?.pro_nome}
                                </p>
                                <p className="mb-2">
                                    <span className="font-semibold">Quantidade:</span> {item.ite_qtd} unidade(s)
                                </p>
                                <p className="mb-2">
                                    <span className="font-semibold">Valor:</span> R$ {item.ite_valor.toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                <p className={`mb-2 font-semibold`}>
                    Status:<span className={statusColor}> {dados.ven_status}</span>
                </p>

                <p className={`mb-2 font-semibold`}>
                    Período Retirada:<span className="text-primary-orange"> {dados.ven_periodo}</span>
                </p>

                <div className="flex gap-4 justify-center">
                    <button
                        className="px-6 py-2 bg-primary-orange text-white rounded-lg font-semibold cursor-pointer hover:scale-110 transition-transform"
                        onClick={onClose}
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
