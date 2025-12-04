import Button from "../../components/buttons/Button";
import NavBarDashboard from "../../components/navbar/NavBarDashboard";
import TabelaLista from "../../components/tabelas/TabelaLista";
import { useState, useCallback, useEffect } from "react";
import { BanknoteArrowDown, BanknoteArrowUp, PackagePlus, X } from "lucide-react";
import Cropper from "react-easy-crop";
import FormGenerator from "../../components/forms/FormGenerator";
import { CadProduto, BuscaTodosProdutos, EditProduto, CriarMovimentacaoProduto, GetLastProduct, } from "../../services/dataService";
import { CadEspecificacao, GetLastEsp, VincularEspecificacao, BuscaMetricas } from "../../services/especificacaoService"

interface Metrica {
    met_id: number,
    met_nome: string
}

export default function DashProdutos() {

    const [metrica, setMetrica] = useState<Metrica[]>([])

    useEffect(() => {
        const fetchMetricas = async () => {
            const data = await BuscaMetricas()
            setMetrica(data);
        }

        fetchMetricas()
    }, [])


    const [form, setForm] = useState({
        nome: "",
        valor: 0,
        marca: "",
        cod: "",
        estoque: 0,
        status: "Ativo",
        esp_nome: "",
        pro_esp_valor: "",
        categoria: "1"
    });
    const [formEdit, setFormEdit] = useState({
        nome: "",
        valor: 0,
        marca: "",
        cod: "",
        status: "Ativo",
        esp_nome: "",
        pro_esp_valor: "",
        categoria: "1"
    });
    const [edit, setEdit] = useState(false);
    const fields = [
        { name: "nome", type: "text", placeholder: "Nome do produto", required: true },
        { name: "cod", type: "text", placeholder: "codigo do produto", required: true },
        { name: "marca", type: "text", placeholder: "Marca do produto", required: true },
        { name: "valor", type: "number", placeholder: "Valor do produto (R$)", required: true },
        edit == false && { name: "estoque", type: "number", placeholder: "Quantidade em estoque", required: true },
        {
            name: "status",
            type: "select",
            placeholder: "Status do produto",
            options: [
                { label: "Ativo", value: true },
                { label: "Inativo", value: false },
            ],
        },
        {
            name: "categoria",
            type: "select",
            placeholder: "Categoria do produto",
            options: [
                { label: "Motor", value: "1" },
                { label: "Freios", value: "4" },
                { label: "Suspensão", value: "2" },
                { label: "Pneus", value: "10" },
                { label: "Acessorios", value: "8" },
                { label: "Transmissão", value: "7" },
                { label: "Elétrica", value: "3" },
                { label: "Filtros", value: "5" },
                { label: "Óleos e Lubrificantes", value: "6" },
                { label: "Outros", value: "11" },
            ],
        },

    ].filter(Boolean) as any[];
    const [isOpenEstoque, setIsOpenEstoque] = useState(false);
    const [tipoEstoque, setTipoEstoque] = useState<"Entrada" | "Saida" | null>(null);
    const abrirModal = (tipo: "Entrada" | "Saida") => {
        setTipoEstoque(tipo);
        setIsOpenEstoque(true);
        setFormEstoque({ tipo: "", descricao: "", valor: "", data: "" });
    };
    const [formEstoque, setFormEstoque] = useState({
        tipo: "",
        descricao: "",
        valor: "",
        data: "",
    })
    const fieldsEstoque = [
        {
            name: "tipo",
            type: "select",
            placeholder: "Selecione o tipo de movimentação",
            options:
                tipoEstoque === "Saida" ? [
                    { label: "Venda", value: "Venda" },
                    { label: "Defeito", value: "Defeito" },
                ] : [
                    { label: "Compra", value: "Compra" },
                    { label: "Devolução", value: "Devolucao" },
                    { label: "Outros", value: "Outros" },
                ],
        },
        { name: "descricao", type: "text", placeholder: "Descrição da movimentação" },
        { name: "valor", type: "number", placeholder: "Valor da movimentação (R$)" },
        { name: "data", type: "date", placeholder: "Data da movimentação" },
    ]
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const [isOpen, setIsOpen] = useState(false);

    const [produtoEditando, setProdutoEditando] = useState<any>(null);
    const [isOpenEdit, setIsOpenEdit] = useState(false);

    const [espId, setEspId] = useState("")

    useEffect(() => {
        const loadEspId = async () => {
            const data = await GetLastEsp();
            setEspId(data.esp_id + 1);
        };

        loadEspId();
    }, []);

    const [especificacoes, setEspecificacoes] = useState([{
        esp_nome: "",
        pro_esp_valor: "",
        esp_id: "",
        pro_id: "",
        met_id: 1
    }]);

    const adicionarEspecificacao = async () => {
        setEspecificacoes([...especificacoes, { esp_nome: "", esp_id: "", pro_id: "", pro_esp_valor: "", met_id: 1 }]);

        setEspId(espId + 1)

        console.log("Teste ESP", espId);
    };

    const atualizarEspecificacaoNome = async (index: number, novoValor: string) => {
        const novas = [...especificacoes];
        novas[index].esp_nome = novoValor;

        const res = await GetLastProduct()
        const pro_id = res.pro_id + 1
        setEspecificacoes(novas);

        novas[index].pro_id = pro_id

        console.log(especificacoes);
    };

    const atualizarEspecificacaoValor = async (index: number, pro_esp_valor: string) => {
        const novas = [...especificacoes]
        novas[index].pro_esp_valor = pro_esp_valor

        setEspecificacoes(novas)

        novas[index].esp_id = espId

        console.log("esp_id",);
        console.log("pro_esp_valor: ", especificacoes);
    }

    const atualizarMetrica = (index: number, met_id: number) => {
        const novas = [...especificacoes];
        novas[index].met_id = met_id;
        setEspecificacoes(novas);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const validFiles: File[] = [];
        const urls: string[] = [];

        Array.from(files).forEach((file) => {
            if (!file.type.startsWith("image/")) return alert("Envie apenas imagens!");
            if (file.size > 5 * 1024 * 1024) return alert(`${file.name} excede 5MB`);

            const img = new Image();
            const objectUrl = URL.createObjectURL(file);
            img.src = objectUrl;
            img.onload = () => {
                validFiles.push(file);
                urls.push(objectUrl);
                setImages([...validFiles]);
                setPreviewUrls([...urls]);
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.nome || !form.valor || images.length === 0) {
            alert("Preencha todos os campos obrigatórios e adicione pelo menos uma imagem.");
            return;
        }

        let uploadedUrl = "";

        try {
            for (const image of images) {
                const formData = new FormData();
                formData.append("file", image);

                const res = await fetch("http://localhost:3000/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) {
                    throw new Error("Erro ao enviar imagem");
                }

                const data = await res.json();
                uploadedUrl = data.url.imageUrl;

            }

            const categoria = Number(form.categoria)

            const espNome = especificacoes.map(item => item.esp_nome)

            const resEspecificacao = await CadEspecificacao(espNome, categoria)

            const resProduct = await GetLastProduct()
            const proId = resProduct.pro_id + 1

            const espId = especificacoes.map(item => Number(item.esp_id))
            const proEspValor = especificacoes.map(item => item.pro_esp_valor)

            const metricaIds = especificacoes.map(item => Number(item.met_id));

            if (resEspecificacao) {

                const valor = Number(form.valor)
                const resProduto = await CadProduto(form.nome, valor, form.marca, form.cod, form.status, uploadedUrl)

                if (!resProduto || !resProduto.pro_id) {
                    throw new Error("Erro ao cadastrar produto");
                }

                if (resProduto) {
                    await VincularEspecificacao(proId, espId, proEspValor, metricaIds)
                }

                if (form.estoque && form.estoque > 0) {
                    const idNumber = Number(resProduto.pro_id)
                    const estoque = Number(form.estoque)
                    await CriarMovimentacaoProduto(idNumber, estoque, "COMPRA");
                }
            }

            alert("Produto cadastrado com sucesso!");
            setIsOpen(false);
            setImages([]);
            setPreviewUrls([]);
            setForm({
                nome: "",
                valor: 0,
                marca: "",
                cod: "",
                estoque: 0,
                status: "Ativo",
                esp_nome: "",
                pro_esp_valor: "",
                categoria: "1",
            });

            window.location.reload()

        } catch (error) {
            console.error(error);
            alert("Ocorreu um erro ao enviar o produto.");
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formEdit.nome || !formEdit.valor) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        let uploadedUrl = produtoEditando?.pro_caminho_img;

        try {
            const valor = Number(formEdit.valor);

            const resProduto = await EditProduto(
                produtoEditando?.id,
                formEdit.nome,
                valor,
                formEdit.marca,
                formEdit.cod,
                formEdit.status,
                uploadedUrl
            );

            alert("Produto atualizado com sucesso!");
            setIsOpenEdit(false);
            setProdutoEditando(null);
            setImages([]);
            setPreviewUrls([]);

            setFormEdit({
                nome: "",
                valor: 0,
                marca: "",
                cod: "",
                status: "Ativo",
                esp_nome: "",
                pro_esp_valor: "",
                categoria: "1",
            });

        } catch (error) {
            console.error(error);
            alert("Ocorreu um erro ao atualizar o produto.");
        }
    };



    const handleSubmitEstoque = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formEstoque.tipo || !formEstoque.descricao || !formEstoque.data || !formEstoque.valor) {
            alert("Preencha todos os campos obrigatórios");
            return;
        }
        console.log("Estoque cadastrado:", formEstoque);
        alert("Estoque cadastrado com sucesso");
        setIsOpenEstoque(false);
    };
    const getCroppedImg = useCallback(async (imageSrc: string, crop: any) => {
        const image = new Image();
        image.src = imageSrc;
        await new Promise((resolve) => (image.onload = resolve));
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;
        const { width, height } = crop;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(
            image,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            0,
            0,
            width,
            height
        );
        return new Promise<{ file: File; url: string }>((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) return;
                const file = new File([blob], "cropped.png", { type: "image/png" });
                const url = URL.createObjectURL(blob);
                resolve({ file, url });
            }, "image/png");
        });
    }, []);
    const onCropComplete = useCallback((_crop: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);
    const handleSaveCrop = async () => {
        if (!selectedImage || !croppedAreaPixels || selectedIndex === null) return;
        const cropped = await getCroppedImg(selectedImage, croppedAreaPixels);
        if (!cropped) return;
        const newImages = [...images];
        newImages[selectedIndex] = cropped.file;
        setImages(newImages);
        const newPreviews = [...previewUrls];
        newPreviews[selectedIndex] = cropped.url;
        setPreviewUrls(newPreviews);
        setSelectedImage(null);
        setSelectedIndex(null);
    };

    useEffect(() => {
        if (produtoEditando) {
            setFormEdit({
                nome: produtoEditando.produto || "",
                valor: produtoEditando.valor || "",
                marca: produtoEditando.marca || "",
                cod: produtoEditando.codigo || "",
                status: produtoEditando.status ? "Ativo" : "Inativo",
                esp_nome: produtoEditando.esp_nome || "",
                pro_esp_valor: produtoEditando.pro_esp_valor || "",
                categoria: produtoEditando.categoria || "11",
            });
        }
    }, [produtoEditando]);

    return (
        <div className="flex bg-black-smooth/95">
            <NavBarDashboard page="Produtos" />
            <div className="flex flex-col gap-2 py-10 px-5 w-screen">
                <div className="flex flex-row justify-between w-full">
                    <h1 className="text-3xl text-primary-orange font-semibold w-full text-start">
                        Gestão de Produtos
                    </h1>
                    <Button
                        className="bg-pear-green hover:bg-orange-300 w-54 h-full text-ice text-xl font-semibold rounded-md flex flex-row justify-center items-center"
                        onClick={() => {

                            setForm({
                                nome: "",
                                valor: 0,
                                marca: "",
                                cod: "",
                                estoque: 0,
                                status: "Ativo",
                                esp_nome: "",
                                pro_esp_valor: "",
                                categoria: "1",
                            })

                            setFormEdit({
                                nome: "",
                                valor: 0,
                                marca: "",
                                cod: "",
                                status: "Ativo",
                                esp_nome: "",
                                pro_esp_valor: "",
                                categoria: "1"
                            })

                            setEspecificacoes([{
                                esp_nome: "",
                                pro_esp_valor: "",
                                esp_id: "",
                                pro_id: "",
                                met_id: 1
                            }])
                            setIsOpen(true)
                        }}


                    >
                        <PackagePlus className="w-6 h-6 mr-2" />
                        Adicionar Produto
                    </Button>

                </div>
                <div>
                    <TabelaLista
                        titulo="Produtos"
                        filtro={true}
                        tituloFiltro="Filtar"
                        filtroChildren={[
                            { value: "A-Z", children: "De A-Z" },
                            { value: "Z-A", children: "De Z-A" },
                            { value: "Menor", children: "Menor preço" },
                            { value: "Maior", children: "Maior preço" },
                            { value: "Ativo", children: "Ativos" },
                            { value: "Inativo", children: "Inativos" },
                        ]}
                        pesquisa={true}
                        colunas={[
                            { chave: "codigo", titulo: "Código", size: "sm" },
                            { chave: "produto", titulo: "Produto", size: "auto" },
                            { chave: "descricao", titulo: "Descrição", size: "auto" },
                            { chave: "valor", titulo: "Valor Unidade", size: "md" },
                            { chave: "estoque", titulo: "Estoque", size: "sm" },
                            { chave: "status", titulo: "Status", size: "sm" },
                        ]}
                        fetchData={async () => {
                            const produtos = await BuscaTodosProdutos();

                            return produtos.map((p: any) => ({
                                codigo: p.pro_cod, // <-- sempre usar o código de produto (string)
                                id: p.pro_id, // opcional: guardar o ID separado
                                produto: p.pro_nome,
                                marca: p.pro_marca,
                                valor: p.pro_valor,
                                estoque: p.estoque ?? 0,
                                status: p.pro_status ? "Ativo" : "Inativo",
                            }));
                        }}
                        alturaMax="max-h-[500px]"
                        acoes={[
                            {
                                label: "Editar",
                                cor: "bg-primary-orange text-black-smooth hover:bg-orange-300",
                                onClick: (item) => {
                                    setProdutoEditando(item); // 🔥 salva o produto
                                    setIsOpenEdit(true);      // abre o modal
                                    setEdit(true);
                                },
                            },
                        ]}
                    />
                </div>
                <div className="flex lfex-row justify-between gap-5 mx-5">
                    <Button
                        type="button"
                        onClick={() => abrirModal("Saida")}
                        className="bg-primary-orange hover:bg-primary-orange/80 text-xl font-semibold hover:text-ice flex flex-row justify-center items-center p-2 rounded-lg"
                    >
                        <BanknoteArrowUp size={20} className="mr-2" />
                        Registrar saída de estoque
                    </Button>
                    <Button
                        type="button"
                        onClick={() => abrirModal("Entrada")}
                        className="bg-pear-green text-xl font-semibold hover:text-ice flex flex-row justify-center items-center p-2 rounded-lg"
                    >
                        <BanknoteArrowDown size={20} className="mr-2" />
                        Registrar entrada de estoque
                    </Button>
                </div>
            </div>
            {/* === Modal de Cadastro === */}
            {isOpen && (
                <div className="absolute flex justify-center items-center w-full h-full bg-black/50 z-50">
                    <div className="bg-black-smooth h-[90%] w-[60%] rounded-md p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                        <div className="flex flex-row justify-between mb-4">
                            <h1 className="text-2xl font-semibold text-primary-orange">
                                Cadastre um novo produto
                            </h1>
                            <X
                                size={30}
                                color="#FFF"
                                onClick={() => setIsOpen(false)}
                                className="cursor-pointer hover:scale-110 transition-transform"
                            />
                        </div>
                        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                            {/* Upload de imagens */}
                            <div>
                                <label className="text-md font-medium text-ice block mb-2">
                                    Imagens do produto (máx. 5MB cada):
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-ice file:mr-3 file:py-2 file:px-4 
                    file:rounded-md file:border-0 file:text-sm file:font-semibold 
                    file:bg-primary-orange file:text-black-smooth hover:file:bg-orange-300"
                                />
                                <div className="grid grid-cols-6 gap-3 mt-3">
                                    {previewUrls.map((url, i) => (
                                        <div
                                            key={i}
                                            className="relative group cursor-pointer"
                                            onClick={() => {
                                                setSelectedImage(url);
                                                setSelectedIndex(i);
                                            }}
                                        >
                                            <img
                                                src={url}
                                                alt="preview"
                                                className="h-32 w-32 object-cover rounded-md border border-gray-500"
                                            />
                                            <span className="absolute top-1 left-1 bg-black/60 text-ice px-1 text-xs rounded opacity-0 group-hover:opacity-100">
                                                Cortar
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Inputs dinâmicos */}
                            <FormGenerator fields={fields} form={form} setForm={setForm} className="grid grid-cols-2 gap-4" />

                            <div className="flex flex-col">
                                <label className="text-md font-medium text-ice">Especificações</label>

                                <div className="flex flex-col w-50 m-2">
                                    {especificacoes.map((esp, i) => (
                                        <div className="flex m-2">
                                            <input
                                                key={i}
                                                type="text"
                                                placeholder={`Especificação ${i + 1}`}
                                                value={esp.esp_nome}
                                                onChange={(e) => atualizarEspecificacaoNome(i, e.target.value)}
                                                className="bg-black-smooth border border-gray-600 text-ice p-2 me-2 rounded" />
                                            <input
                                                key={i}
                                                type="text"
                                                placeholder={`Valor ${i + 1}`}
                                                value={esp.pro_esp_valor}
                                                onChange={(e) => atualizarEspecificacaoValor(i, e.target.value)}
                                                className="bg-black-smooth border border-gray-600 text-ice p-2 me-2 rounded" />
                                            <select
                                                className="bg-black-smooth border border-gray-600 text-ice p-2 rounded"
                                                value={esp.met_id}
                                                onChange={(e) => atualizarMetrica(i, Number(e.target.value))}
                                            >
                                                {metrica.map((m) => (
                                                    <option key={m.met_id} value={m.met_id}>
                                                        {m.met_nome}
                                                    </option>
                                                ))}
                                            </select>


                                        </div>
                                    ))}
                                </div>


                                <button
                                    type="button"
                                    onClick={adicionarEspecificacao}
                                    className="bg-primary-orange px-3 py-1 rounded text-black-smooth font-bold w-10"
                                >
                                    +
                                </button>
                            </div>


                            <button
                                type="submit"
                                className="bg-pear-green hover:bg-orange-300 w-48 py-2 text-ice text-xl font-semibold rounded-md self-end"
                            >
                                Cadastrar
                            </button>
                        </form>
                    </div>
                    {/* Modal de corte de imagem */}
                    {selectedImage && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
                            <div className="bg-black-smooth p-5 rounded-lg relative">
                                <h2 className="text-primary-orange mb-3 text-lg font-semibold">
                                    Ajustar imagem
                                </h2>
                                <div className="relative w-[400px] h-[300px]">
                                    <Cropper
                                        image={selectedImage}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={1 / 1}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropComplete={onCropComplete}
                                    />
                                </div>
                                <div className="flex justify-between mt-3">
                                    <button
                                        onClick={() => setSelectedImage(null)}
                                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-ice rounded-md"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSaveCrop}
                                        className="px-4 py-2 bg-primary-orange hover:bg-orange-300 text-black-smooth rounded-md"
                                    >
                                        Salvar corte
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            )}

            {/* === MODAL DE EDIÇÃO === */}
            {isOpenEdit && (
                <div className="absolute flex justify-center items-center w-full h-full bg-black/50 z-50">
                    <div className="bg-black-smooth h-[90%] w-[60%] rounded-md p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                        <div className="flex flex-row justify-between mb-4">
                            <h1 className="text-2xl font-semibold text-primary-orange">
                                Editar produto
                            </h1>
                            <X
                                size={30}
                                color="#FFF"
                                onClick={() => {
                                    setIsOpenEdit(false);
                                    setProdutoEditando(null);
                                }}
                                className="cursor-pointer hover:scale-110 transition-transform"
                            />
                        </div>

                        <form className="flex flex-col gap-5" onSubmit={handleUpdate}>
                            {/* Upload de imagens */}
                            <div>
                                <label className="text-md font-medium text-ice block mb-2">
                                    Imagens do produto (máx. 5MB cada):
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-ice file:mr-3 file:py-2 file:px-4 
                    file:rounded-md file:border-0 file:text-sm file:font-semibold 
                    file:bg-primary-orange file:text-black-smooth hover:file:bg-orange-300"
                                />
                                <div className="grid grid-cols-6 gap-3 mt-3">
                                    {previewUrls.map((url, i) => (
                                        <div
                                            key={i}
                                            className="relative group cursor-pointer"
                                            onClick={() => {
                                                setSelectedImage(url);
                                                setSelectedIndex(i);
                                            }}
                                        >
                                            <img
                                                src={url}
                                                alt="preview"
                                                className="h-32 w-32 object-cover rounded-md border border-gray-500"
                                            />
                                            <span className="absolute top-1 left-1 bg-black/60 text-ice px-1 text-xs rounded opacity-0 group-hover:opacity-100">
                                                Cortar
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Inputs dinâmicos */}
                            <FormGenerator
                                fields={fields}
                                form={formEdit}
                                setForm={setFormEdit}
                                className="grid grid-cols-2 gap-4"
                            />

                            {/* <div className="flex flex-col">
                                <label className="text-md font-medium text-ice">Especificações</label>

                                <div className="flex flex-col w-50 m-2">
                                    {especificacoes.map((esp, i) => (
                                        <div className="flex m-2">
                                            <input
                                                key={i}
                                                type="text"
                                                placeholder={`Especificação ${i + 1}`}
                                                value={esp.esp_nome}
                                                onChange={(e) => atualizarEspecificacaoNome(i, e.target.value)}
                                                className="bg-black-smooth border border-gray-600 text-ice p-2 me-2 rounded" />
                                            <input
                                                key={i}
                                                type="text"
                                                placeholder={`Valor ${i + 1}`}
                                                value={esp.pro_esp_valor}
                                                onChange={(e) => atualizarEspecificacaoValor(i, e.target.value)}
                                                className="bg-black-smooth border border-gray-600 text-ice p-2 me-2 rounded" />
                                            <select
                                                className="bg-black-smooth border border-gray-600 text-ice p-2 rounded"
                                                value={esp.met_id}
                                                onChange={(e) => atualizarMetrica(i, Number(e.target.value))}
                                            >
                                                {metrica.map((m) => (
                                                    <option key={m.met_id} value={m.met_id}>
                                                        {m.met_nome}
                                                    </option>
                                                ))}
                                            </select>


                                        </div>
                                    ))}
                                </div>
                            </div> */}

                            <button
                                type="submit"
                                className="bg-pear-green hover:bg-orange-300 w-48 py-2 text-ice text-xl font-semibold rounded-md self-end"
                            >
                                Salvar alterações
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {/* === MODAL DE ENTRADA/SAIDA === */}
            {isOpenEstoque && (
                <div className="absolute flex justify-center items-center w-full h-full bg-black/50 z-50">
                    <div className="bg-black-smooth h-[90%] w-[60%] rounded-md p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                        <div className="flex flex-row justify-between mb-4">
                            <h1 className="text-2xl font-semibold text-primary-orange">
                                Cadastrar nova movimentação de{" "}
                                {tipoEstoque === "Saida" ? "Saída" : "Entrada"}
                            </h1>
                            <X
                                size={30}
                                color="#FFF"
                                onClick={() => setIsOpenEstoque(false)}
                                className="cursor-pointer hover:scale-110 transition-transform"
                            />
                        </div>

                        <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmitEstoque}>
                            <FormGenerator
                                fields={fieldsEstoque}
                                form={formEstoque}
                                setForm={setFormEstoque}
                                className="grid grid-cols-1 gap-4 w-full"
                            />

                            <button
                                type="submit"
                                className="bg-primary-orange hover:bg-orange-300 w-48 py-2 text-ice hover:text-black-smooth text-xl font-semibold rounded-md self-end"
                            >
                                Registrar
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}