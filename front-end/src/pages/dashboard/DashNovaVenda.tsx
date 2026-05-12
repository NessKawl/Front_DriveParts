import { useEffect, useState, useRef } from "react";
import Button from "../../components/buttons/Button";
import TabelaLista from "../../components/tabelas/TabelaLista";
import { useSearchParams } from "react-router-dom";
import { dashboardReservaService } from "../../services/dashboardReservaService";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/modal/Modal";
import NavBarDashboard from "../../components/navbar/NavBarDashboard";
import { 
    Search, 
    ShoppingCart, 
    CreditCard, 
    Banknote, 
    QrCode, 
    ArrowLeft, 
    CheckCircle,
    Plus,
    Trash2,
    Package
} from "lucide-react";

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
        <div className="flex h-screen bg-black-smooth/95 overflow-hidden font-sans">
            <NavBarDashboard page="Vendas" />

            <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* === COLUNA ESQUERDA: BUSCA E SELEÇÃO === */}
                <div className="flex-[1.5] p-6 lg:p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <header className="mb-10">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-primary-orange/20 text-primary-orange rounded-2xl">
                                <Plus size={28} />
                            </div>
                            <h1 className="text-4xl font-bold text-white tracking-tight">Nova Venda</h1>
                        </div>
                        <p className="text-white/40 text-lg">Busque produtos e selecione as opções de pagamento</p>
                    </header>

                    {/* Barra de Busca */}
                    <section className="mb-10">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary-orange transition-colors" size={24} />
                            <input
                                ref={inputBuscaRef}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") buscarProduto();
                                }}
                                value={produtoBusca}
                                onChange={(e) => setProdutoBusca(e.target.value)}
                                placeholder="Escaneie o código ou digite o nome do produto..."
                                className="w-full bg-white/5 border border-white/10 text-white text-xl pl-14 pr-32 py-5 rounded-2xl focus:border-primary-orange/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
                            />
                            <button 
                                onClick={buscarProduto}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary-orange hover:bg-orange-500 text-black-smooth font-bold px-6 py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-primary-orange/20"
                            >
                                Buscar (Enter)
                            </button>
                        </div>
                    </section>

                    {/* Seleção de Produto */}
                    {produtoSelecionado && (
                        <section className="mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="bg-white/5 border border-primary-orange/30 rounded-3xl p-8 shadow-2xl shadow-primary-orange/5">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-2 h-6 bg-primary-orange rounded-full"></div>
                                    <h2 className="text-xl font-bold text-white">Item Selecionado</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                                    <div className="md:col-span-6 flex flex-col gap-2">
                                        <label className="text-white/50 text-sm font-medium ml-1">Produto / Opção</label>
                                        <select
                                            className="bg-black/40 border border-white/10 text-white p-4 rounded-xl focus:border-primary-orange/50 outline-none transition-colors w-full"
                                            style={{ color: produtoEscolhido?.estoque === 0 ? "#666" : "white" }}
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
                                                    className="bg-black-smooth text-white"
                                                >
                                                    {prod.estoque === 0
                                                        ? `${prod.produto} - [SEM ESTOQUE]`
                                                        : prod.produto}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="md:col-span-3 flex flex-col gap-2">
                                        <label className="text-white/50 text-sm font-medium ml-1">Valor Unit. (F1)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">R$</span>
                                            <input
                                                ref={inputValorUnitarioRef}
                                                type="number"
                                                value={valorUnitario}
                                                onChange={(e) => setValorUnitario(Number(e.target.value))}
                                                className="w-full bg-black/40 border border-white/10 text-white p-4 pl-10 rounded-xl focus:border-primary-orange/50 outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 flex flex-col gap-2">
                                        <label className="text-white/50 text-sm font-medium ml-1">Qtd. (F2)</label>
                                        <input
                                            ref={inputQuantidadeRef}
                                            type="number"
                                            value={quantidade}
                                            onChange={(e) => setQuantidade(Number(e.target.value))}
                                            className="w-full bg-black/40 border border-white/10 text-white p-4 rounded-xl focus:border-primary-orange/50 outline-none transition-colors text-center"
                                        />
                                    </div>

                                    <div className="md:col-span-1">
                                        <button 
                                            onClick={adicionarProdutoAoCarrinho} 
                                            className="w-full aspect-square bg-pear-green hover:bg-green-500 text-white flex items-center justify-center rounded-xl transition-all active:scale-90 shadow-lg shadow-pear-green/20"
                                            title="Adicionar ao Carrinho (Insert)"
                                        >
                                            <Plus size={32} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Forma de Pagamento */}
                    <section className="mb-20">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-2 h-6 bg-primary-orange rounded-full"></div>
                            <h2 className="text-xl font-bold text-white">Forma de Pagamento</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {[
                                { id: "dinheiro", label: "Dinheiro (F3)", icon: Banknote },
                                { id: "cartaoCredito", label: "Crédito (F4)", icon: CreditCard },
                                { id: "cartaoDebito", label: "Débito (F5)", icon: CreditCard },
                                { id: "pix", label: "PIX (F6)", icon: QrCode },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setFormaPagamento(item.id)}
                                    className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 ${
                                        formaPagamento === item.id
                                            ? "bg-primary-orange/10 border-primary-orange text-primary-orange shadow-lg shadow-primary-orange/10"
                                            : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10 hover:text-white/60"
                                    }`}
                                >
                                    <item.icon size={32} />
                                    <span className="font-bold text-sm uppercase tracking-wider">{item.label}</span>
                                </button>
                            ))}
                        </div>

                        {formaPagamento === "dinheiro" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-white/5 border border-white/10 rounded-3xl animate-in fade-in zoom-in duration-300">
                                <div className="flex flex-col gap-2">
                                    <label className="text-white/50 text-sm font-medium ml-1">Total Recebido (F7)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-lg">R$</span>
                                        <input
                                            type="text"
                                            value={totalRecebido}
                                            onChange={(e) => setTotalRecebido(e.target.value)}
                                            placeholder="0,00"
                                            className="w-full bg-black/40 border border-white/10 text-white text-2xl p-4 pl-12 rounded-xl focus:border-primary-orange/50 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-white/50 text-sm font-medium ml-1">Troco</label>
                                    <input 
                                        type="text" 
                                        value={troco} 
                                        disabled 
                                        readOnly 
                                        className="w-full bg-pear-green/10 border border-pear-green/30 text-pear-green text-2xl p-4 rounded-xl font-bold" 
                                    />
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                {/* === COLUNA DIREITA: CARRINHO E RESUMO === */}
                <div className="w-full lg:w-[480px] bg-black/40 border-l border-white/10 flex flex-col shadow-2xl relative">
                    <div className="p-8 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ShoppingCart className="text-primary-orange" size={24} />
                            <h2 className="text-2xl font-bold text-white tracking-tight">Carrinho</h2>
                        </div>
                        <span className="bg-white/10 text-white/60 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                            {carrinho.length} Itens
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10">
                        {carrinho.length > 0 ? (
                            <div className="space-y-4">
                                {carrinho.map((item) => (
                                    <div key={item.codigo} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:border-white/10 transition-colors">
                                        <div className="flex-1">
                                            <h3 className="text-white font-bold truncate pr-4">{item.produto}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-white/40 text-sm">{item.quantidade}x</span>
                                                <span className="text-primary-orange font-medium text-sm">
                                                    {(item.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-white font-bold text-lg whitespace-nowrap">
                                                {(item.valor * item.quantidade).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                            </span>
                                            <button 
                                                onClick={() => removerItem(item.codigo)}
                                                className="p-2 text-white/20 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                                <Package size={64} className="mb-4" />
                                <p className="italic text-lg">O carrinho está vazio</p>
                            </div>
                        )}
                    </div>

                    {/* Resumo de Valores */}
                    <div className="p-8 bg-black/60 border-t border-white/10 space-y-6">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-white/40 text-sm font-bold uppercase tracking-widest mb-1">Total a Pagar</p>
                                <div className="text-5xl font-black text-pear-green tracking-tighter">{valorTotal}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={abrirModalVoltar}
                                className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all active:scale-95 border border-white/10"
                            >
                                <ArrowLeft size={20} />
                                Voltar (Esc)
                            </button>
                            <button
                                onClick={abrirModalFinalizar}
                                className="flex items-center justify-center gap-2 px-6 py-4 bg-pear-green hover:bg-green-500 text-white font-black text-lg rounded-2xl transition-all active:scale-95 shadow-xl shadow-pear-green/20"
                            >
                                <CheckCircle size={24} />
                                Finalizar (F9)
                            </button>
                        </div>
                    </div>
                </div>
            </main>

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
