import { useEffect, useState, useRef } from "react";
import Button from "../../components/buttons/Button";
import TabelaLista from "../../components/tabelas/TabelaLista";
import { useSearchParams } from "react-router-dom";
import { dashboardReservaService } from "../../services/dashboardReservaService";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/modal/Modal";

interface ItemCarrinho {
    codigo: number;
    produto: string;
    quantidade: number;
    valor: number;
    estoque?: number;
}

const formaPagamentoMap: Record<string, string> = {
    dinheiro: "Dinheiro",
    cartaoCredito: "Cartão de Crédito",
    cartaoDebito: "Cartão de Débito",
    pix: "PIX",
};

export default function DashNovaVenda() {
    const colunas = [
        { chave: "codigo", titulo: "Código", size: "sm" },
        { chave: "produto", titulo: "Produto", size: "auto" },
        { chave: "quantidade", titulo: "Quantidade", size: "md" },
        { chave: "valor", titulo: "Valor", size: "sm" },
        { chave: "acoes", titulo: "", size: "sm" },
    ];

    const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
    const [produtoBusca, setProdutoBusca] = useState("");
    const [quantidade, setQuantidade] = useState(1);
    const [valorUnitario, setValorUnitario] = useState(0);
    const [produtoSelecionado, setProdutoSelecionado] = useState<ItemCarrinho[] | null>(null);
    const [valorTotal, setValorTotal] = useState("R$ 0,00");
    const [formaPagamento, setFormaPagamento] = useState("");
    const [totalRecebido, setTotalRecebido] = useState("R$");
    const [troco, setTroco] = useState("");
    const [searchParams] = useSearchParams();
    const reservaId = searchParams.get("reserva");
    const inputBuscaRef = useRef<HTMLInputElement>(null);
    const inputValorUnitarioRef = useRef<HTMLInputElement>(null);
    const inputQuantidadeRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const [modalAberto, setModalAberto] = useState(false);
    const [modalTitulo, setModalTitulo] = useState("");
    const [modalMensagem, setModalMensagem] = useState("");
    const [modalBotaoAcao, setModalBotaoAcao] = useState("");
    const [acaoModal, setAcaoModal] = useState<(() => void) | undefined>();
    const [modalTipo, setModalTipo] = useState<"erro" | "confirmacao">("confirmacao");
    const [reservaCriada, setReservaCriada] = useState(false);
    const [reservaIdState, setReservaIdState] = useState<number | null>(
        reservaId ? Number(reservaId) : null
    );
    const [produtoEscolhido, setProdutoEscolhido] = useState<ItemCarrinho | null>(null);

    useEffect(() => {
        if (produtoSelecionado && produtoSelecionado.length > 0) {
            const primeiro = produtoSelecionado[0];
            setProdutoEscolhido(primeiro);
            setValorUnitario(primeiro.valor);
        }
    }, [produtoSelecionado]);

    const abrirModalVoltar = async () => {
        setModalTipo("confirmacao");
        setModalTitulo("Você deseja sair sem finalizar a venda?");
        setModalBotaoAcao("Sair");
        setAcaoModal(() => async () => {
            try {
                if (reservaIdState && reservaCriada) {
                    await dashboardReservaService.removerReserva(Number(reservaIdState));
                }

            } catch (err) {
                console.error("Erro ao remover reserva vazia:", err);
            } finally {
                navigate("/dashboard/Reservas");
            }
        });
        setModalAberto(true);
    };

    useEffect(() => {
        async function iniciarReserva() {
            if (!reservaIdState) {
                try {
                    const novaReserva = await dashboardReservaService.criarNovaVenda();
                    setReservaIdState(novaReserva.id);
                    setReservaCriada(true);
                } catch (err) {
                    console.error("Erro ao criar nova reserva:", err);
                    abrirModalErro("Erro ao iniciar nova venda");
                }
            } else {
                setReservaCriada(true);
                // Carregar itens da reserva existente
                try {
                    const reserva = await dashboardReservaService.buscarReservaPorId(reservaIdState);
                    const itens = (reserva.ite_itemVenda || []).map((item: any) => ({
                        codigo: item.pro_produto.pro_cod,
                        produto: item.pro_produto.pro_nome,
                        valor: Number(item.ite_valor) / item.ite_qtd,
                        quantidade: item.ite_qtd ?? 1,
                    }));
                    setCarrinho(itens);
                } catch (err) {
                    console.error(err);
                    abrirModalErro("Erro! Reserva não encontrada");
                }
            }
        }

        iniciarReserva();
    }, [reservaIdState]);

    const abrirModalFinalizar = () => {
        if (!formaPagamento) {
            abrirModalErro("Erro! Selecione a forma de pagamento antes de finalizar.");
            return;
        }

        if (formaPagamento === "dinheiro") {
            const total = carrinho.reduce((acc, i) => acc + i.valor * i.quantidade, 0);
            const recebidoNum = parseFloat(totalRecebido.replace(/[R$\s]/g, "").replace(",", "."));
            if (isNaN(recebidoNum) || recebidoNum < total) {
                abrirModalErro("Erro! O valor recebido é menor que o total da compra.");
                return;
            }
        }
        setModalTipo("confirmacao");
        setModalTitulo("Você deseja finalizar a venda?");
        setModalBotaoAcao("Finalizar");
        setAcaoModal(() => confirmarVenda);
        setModalAberto(true);
    };

    const abrirModalErro = (mensagem: string) => {
        setModalTipo("erro");
        setModalTitulo(mensagem);
        setModalBotaoAcao("Entendi");
        setAcaoModal(() => undefined);
        setModalAberto(true);
    };

    const abrirModalSucesso = (mensagem: string, onConfirm?: () => void) => {
        setModalTipo("confirmacao");       // tipo confirmação para ter botão OK
        setModalTitulo(mensagem);
        setModalBotaoAcao("OK");
        setAcaoModal(() => () => {
            if (onConfirm) onConfirm();
            setModalAberto(false);
        });
        setModalAberto(true);
    };

    useEffect(() => {
        inputBuscaRef.current?.focus();
    }, []);

    // Lista de itens para a tabela
    const listaItens = async () =>
        carrinho.map((item) => ({
            ...item,
            valor: (item.valor * item.quantidade).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            }),
            acoes: (
                <button
                    onClick={() => removerItem(item.codigo)}
                    className="bg-red-700  px-1 py-1 rounded"
                >
                    Remover
                </button>
            ),
        }));

    // Calcular total do carrinho
    const calcularTotal = (itens: ItemCarrinho[]) => {
        const total = itens.reduce((acc, item) => acc + item.valor * item.quantidade, 0);
        setValorTotal(
            total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        );
    };

    // Buscar produto pelo termo
    const buscarProduto = async () => {
        if (!produtoBusca.trim()) return;

        try {
            const res = await dashboardReservaService.buscarProduto(produtoBusca.trim());
            console.log(res);

            const lista = Array.isArray(res) ? res : [res];

            if (!lista.length) {
                abrirModalErro("Erro! Produto não encontrado");
                return;
            }

            const produtos = lista.map((item: any) => ({
                codigo: item.pro_id,
                produto: item.pro_nome,
                quantidade: 1,
                valor: Number(item.pro_valor),
                estoque: item.estoque
            }));

            setProdutoSelecionado(produtos);

            setProdutoBusca("");
            setQuantidade(1);

        } catch (err: any) {
            console.error(err);
            abrirModalErro("Erro!" + err?.response?.data?.message || "Erro ao buscar produto");
        }
    };

    // Adicionar produto ao carrinho
    const adicionarProdutoAoCarrinho = async () => {
        if (!produtoEscolhido) return abrirModalErro("Erro! Selecione um produto antes de adicionar.");
        if (!reservaId) return abrirModalErro("Erro! Reserva não encontrada.");

        try {
            await dashboardReservaService.adicionarItemVenda(
                Number(reservaId),
                produtoEscolhido.codigo,
                quantidade,
                valorUnitario
            );

            setCarrinho((prev) => {
                const itemExistente = prev.find(p => p.codigo === produtoEscolhido.codigo);

                if (itemExistente) {
                    return prev.map(p =>
                        p.codigo === produtoEscolhido.codigo
                            ? { ...p, quantidade: p.quantidade + quantidade }
                            : p
                    );
                }

                return [
                    ...prev,
                    {
                        codigo: produtoEscolhido.codigo,
                        produto: produtoEscolhido.produto,
                        quantidade: quantidade,
                        valor: valorUnitario
                    }
                ];
            });

            setProdutoSelecionado(null);
            setProdutoEscolhido(null);
            setProdutoBusca("");
            setQuantidade(1);
            setValorUnitario(0);

            inputBuscaRef.current?.focus();

        } catch (err: any) {
            console.error(err);
            abrirModalErro("Erro! " + (err?.response?.data?.message || "Erro ao adicionar produto."));
        }
    };

    const removerItem = async (codigo: number) => {
        if (!reservaId) return;
        try {
            await dashboardReservaService.removerItemVenda(Number(reservaId), codigo);
            setCarrinho((prev) => prev.filter((p) => p.codigo !== codigo));
        } catch (err: any) {
            console.error(err);
            abrirModalErro("Erro!" + err?.response?.data?.message || "Erro ao remover item");
        }
    };

    // Confirmar venda com forma de pagamento
    const confirmarVenda = async () => {
        if (!reservaId) {
            abrirModalErro("Erro! Reserva não encontrada");
            return;
        }
        if (!formaPagamento) {
            abrirModalErro("Erro! Selecione a forma de pagamento antes de finalizar.");
            return;
        }

        try {
            await dashboardReservaService.finalizarVenda(
                Number(reservaId),
                formaPagamentoMap[formaPagamento]
            );
            abrirModalErro("Venda finalizada com sucesso!");
            setCarrinho([]);
            setValorTotal("R$ 0,00");
            setFormaPagamento("");
            setTotalRecebido("");
            setTroco("");

            abrirModalSucesso("Venda finalizada com sucesso!", () => {
                navigate("/dashboard/Reservas");
            });
        } catch (err) {
            console.error(err);
            abrirModalErro("Erro ao finalizar venda");
        }
    };

    useEffect(() => {
        calcularTotal(carrinho);

        if (formaPagamento === "dinheiro" && totalRecebido) {
            const recebidoNum = parseFloat(totalRecebido.replace(/[R$\s]/g, "").replace(",", "."));
            const total = carrinho.reduce((acc, i) => acc + i.valor * i.quantidade, 0);
            const trocoCalculado = recebidoNum - total;
            setTroco(`R$ ${trocoCalculado > 0 ? trocoCalculado.toFixed(2).replace(".", ",") : "0,00"}`);
        }
    }, [carrinho, totalRecebido, formaPagamento]);

    // Carregar reserva existente
    useEffect(() => {
        if (!reservaId) return;
        async function carregarReserva() {
            try {
                const reserva = await dashboardReservaService.buscarReservaPorId(Number(reservaId));
                const itens = (reserva.ite_itemVenda || []).map((item: any) => ({
                    codigo: item.pro_produto.pro_cod,
                    produto: item.pro_produto.pro_nome,
                    valor: Number(item.ite_valor) / item.ite_qtd,
                    quantidade: item.ite_qtd ?? 1,
                }));
                setCarrinho(itens);
            } catch (err) {
                console.error(err);
                abrirModalErro("Erro! Reserva não encontrada");
            }
        }
        carregarReserva();
    }, [reservaId]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (modalAberto) {
                // Modal aberto: apenas Enter e Esc para o modal
                if (e.key === "Enter") {
                    e.preventDefault();
                    if (modalTipo === "confirmacao") {
                        acaoModal?.();
                    }
                    setModalAberto(false);
                    return;
                }
                if (e.key === "Escape") {
                    e.preventDefault();
                    setModalAberto(false);
                    return;
                }
            } else {
                // Modal fechado: atalhos normais do dashboard
                if (["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F9"].includes(e.key)) e.preventDefault();

                switch (e.key) {
                    case "Enter":
                        if (!produtoSelecionado) buscarProduto();
                        break;
                    case "F1":
                        inputValorUnitarioRef.current?.focus();
                        break;
                    case "F2":
                        inputQuantidadeRef.current?.focus();
                        break;
                    case "F3":
                        setFormaPagamento("dinheiro");
                        break;
                    case "F4":
                        setFormaPagamento("cartaoCredito");
                        break;
                    case "F5":
                        setFormaPagamento("cartaoDebito");
                        break;
                    case "F6":
                        setFormaPagamento("pix");
                        break;
                    case "F7":
                        if (formaPagamento === "dinheiro") {
                            const inputRecebido = document.querySelector<HTMLInputElement>(
                                'input[placeholder="R$ 0,00"]'
                            );
                            inputRecebido?.focus();
                        }
                        break;
                    case "F8":
                        inputBuscaRef.current?.focus();
                        break;
                    case "F9":
                        abrirModalFinalizar();
                        break;
                    case "Insert":
                        if (produtoSelecionado) adicionarProdutoAoCarrinho();
                        break;
                    case "Escape":
                        abrirModalVoltar();
                        break;
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [produtoSelecionado, quantidade, carrinho, formaPagamento, totalRecebido, modalAberto, modalTipo, acaoModal]);

    return (
        <div className="flex-1 h-screen bg-black-smooth/95 p-6  pb-3">
            {/* Barra de busca */}
            <div className="flex gap-4 mb-6 items-center">
                <input
                    ref={inputBuscaRef}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            buscarProduto();
                        }
                    }}
                    value={produtoBusca}
                    onChange={(e) => setProdutoBusca(e.target.value)}
                    placeholder="Código ou nome do produto"
                    className="bg-ice/90 text-black font-semibold rounded-md p-2 w-full"
                />
                <Button className="bg-orange-400 px-2 py-2 w-20 text-md rounded-lg" onClick={buscarProduto}>Buscar</Button>
            </div>

            {/* Inputs para produto selecionado */}
            {produtoSelecionado && (
                <div className="flex flex-row gap-4 mb-6 items-end">
                    <div className="flex flex-col flex-1">
                        <label className="text-ice font-medium mb-1">Produto</label>
                        {/*{produtoSelecionado.map((prod) => (
                            <input
                                key={prod.codigo}
                                type="text"
                                value={prod.produto}
                                disabled={true}
                                className="bg-ice/80 rounded-md p-2 w-full mb-2"
                            />
                        ))}*/}

                        <select
                            className="bg-ice/80 rounded-md p-2 w-full mb-2"
                            style={{ color: produtoEscolhido?.estoque === 0 ? "gray" : "black" }}
                            value={produtoEscolhido?.codigo || ""}
                            onChange={(e) => {
                                const codigo = Number(e.target.value);
                                const produto = produtoSelecionado.find(p => p.codigo === codigo);

                                if (produto) {
                                    setProdutoEscolhido(produto);
                                    setValorUnitario(produto.valor);
                                }
                            }}
                        >
                            {produtoSelecionado.map((prod) => (
                                <option
                                    key={prod.codigo}
                                    value={prod.codigo}
                                    disabled={prod.estoque === 0}
                                    style={{ color: prod.estoque === 0 ? "gray" : "black" }}
                                >
                                    {prod.estoque === 0
                                        ? `${prod.produto} - Indisponível (sem estoque)`
                                        : prod.produto}
                                </option>
                            ))}
                        </select>

                    </div>
                    <div className="flex flex-col w-40">
                        <label className="text-ice font-medium mb-1">Valor Unitário</label>
                        <input
                            ref={inputValorUnitarioRef}
                            type="number"
                            value={valorUnitario}
                            onChange={(e) => setValorUnitario(Number(e.target.value))}
                            className="bg-ice/80 rounded-md p-2 w-full"
                        />
                    </div>
                    <div className="flex flex-col w-32">
                        <label className="text-ice font-medium mb-1">Quantidade</label>

                        <input
                            ref={inputQuantidadeRef}
                            type="number"
                            value={quantidade}
                            onChange={(e) => setQuantidade(Number(e.target.value))}
                            className="bg-ice/80 rounded-md p-2 w-full"
                        />
                    </div>
                    <Button onClick={adicionarProdutoAoCarrinho} className="bg-orange-400 px-2 py-2 w-20 text-center text-md rounded-lg">
                        Adicionar
                    </Button>
                </div>
            )}


            {/* Carrinho */}
            <div className="bg-black-smooth/80 rounded-lg p-4 mb-6">
                <TabelaLista titulo="Carrinho" colunas={colunas} fetchData={listaItens} alturaMax={formaPagamento === "dinheiro" ? "md:max-h-70" : "md:max-h-80"} />
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mt-6 bg-black-smooth/70 px-5 py-4 rounded-lg">
                <span className="text-xl text-ice">Total</span>
                <span className="text-3xl font-bold text-pear-green">{valorTotal}</span>
            </div>

            {/* Pagamento */}
            <div className="mt-6 flex flex-col gap-4">
                <label className="text-ice font-medium">Forma de Pagamento</label>
                <select
                    value={formaPagamento}
                    onChange={(e) => setFormaPagamento(e.target.value)}
                    className="bg-ice/90 rounded-lg p-2"
                >
                    <option hidden value="">
                        Selecione
                    </option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="cartaoCredito">Cartão de Crédito</option>
                    <option value="cartaoDebito">Cartão de Débito</option>
                    <option value="pix">PIX</option>
                </select>

                {formaPagamento === "dinheiro" && (
                    <div className="flex flex-row gap-4">
                        <div className="flex flex-col w-full">
                            <label>Total Recebido</label>
                            <input
                                type="text"
                                value={totalRecebido}
                                onChange={(e) => setTotalRecebido(e.target.value)}
                                placeholder="R$ 0,00"
                                className="bg-ice/80 rounded-md p-2"
                            />
                        </div>
                        <div className="flex flex-col w-full">
                            <label>Troco</label>
                            <input type="text" value={troco} disabled={true} readOnly className="bg-ice/80 rounded-md p-2" />
                        </div>
                    </div>
                )}


            </div>

            <div className="mt-5 absolute bottom-0 left-0 w-full flex justify-between px-10 py-4 bg-black-smooth/80">
                <Button
                    onClick={abrirModalVoltar}
                    className="bg-red-500 text-white px-4 py-3 text-lg rounded-lg"
                >
                    Voltar
                </Button>
                <Button
                    onClick={abrirModalFinalizar}
                    className="bg-pear-green text-white px-4 py-3 text-lg rounded-lg"
                >
                    Finalizar Venda
                </Button>
            </div>

            <Modal
                isOpen={modalAberto}
                title={modalTitulo}
                message={modalMensagem}
                actionText={modalBotaoAcao}
                onClose={() => setModalAberto(false)}
                onAction={() => {
                    if (modalTipo === "confirmacao") acaoModal?.();
                    setModalAberto(false);
                }}
                {...(modalTipo === "confirmacao" && {
                    cancelText: "Cancelar",
                    onCancel: () => setModalAberto(false)
                })}
            />
        </div>
    );
}
