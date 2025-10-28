import Button from "../../components/buttons/Button";
import NavBarDashboard from "../../components/navbar/NavBarDashboard";
import TabelaLista from "../../components/tabelas/TabelaLista";
import { useState, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import Cropper from "react-easy-crop";
import FormGenerator from "../../components/forms/FormGenerator";

export default function DashProdutos() {
    const [form, setForm] = useState({
        nome: "",
        descricao: "",
        valor: "",
        estoque: "",
        status: "Ativo",
    });
    const fields = [
        { name: "nome", type: "text", placeholder: "Nome do produto", required: true },
        { name: "descricao", type: "text", placeholder: "Descrição do produto" },
        { name: "valor", type: "number", placeholder: "Valor do produto (R$)", required: true },
        { name: "estoque", type: "number", placeholder: "Estoque disponível" },
        {
            name: "status",
            type: "select",
            placeholder: "Status do produto",
            options: [
                { label: "Ativo", value: "Ativo" },
                { label: "Inativo", value: "Inativo" },
            ],
        },
    ];
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);

    const [produtoEditando, setProdutoEditando] = useState<any>(null); // novo estado
    const [isOpenEdit, setIsOpenEdit] = useState(false);
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
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.nome || !form.valor || images.length === 0) {
            alert("Preencha todos os campos obrigatórios e adicione pelo menos uma imagem.");
            return;
        }
        console.log("Produto cadastrado:", form, images);
        alert("Produto cadastrado com sucesso!");
        setIsOpen(false);
    };
    // Função utilitária para recortar imagem
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
      setForm({
        nome: produtoEditando.produto || "",
        descricao: produtoEditando.descricao || "",
        valor: produtoEditando.valor?.replace("R$", "").replace(",", ".") || "",
        estoque: produtoEditando.estoque || "",
        status: produtoEditando.status || "Ativo",
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
                        children="Adicionar Produto"
                        className="bg-pear-green hover:bg-orange-300 w-48 h-full text-ice text-xl font-semibold rounded-md"
                        onClick={() => setIsOpen(true)}
                    />
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
                            { chave: "codigo", titulo: "Código" },
                            { chave: "produto", titulo: "Produto" },
                            { chave: "descricao", titulo: "Descrição" },
                            { chave: "valor", titulo: "Valor Unidade" },
                            { chave: "estoque", titulo: "Estoque" },
                            { chave: "status", titulo: "Status" },
                        ]}
                        fetchData={async () => [
                            {
                                codigo: 1,
                                produto: "Pneu Goodyear",
                                descricao: "Pneu Goodyear Direction Touring",
                                valor: "R$120,00",
                                estoque: 2,
                                status: "Ativo",
                            },
                        ]}
                        alturaMax="max-h-[550px]"
                        acoes={[
                            {
                                label: "Editar",
                                cor: "bg-primary-orange text-black-smooth hover:bg-orange-300",
                                onClick: (item) => {
                                    setProdutoEditando(item); // 🔥 salva o produto
                                    setIsOpenEdit(true);      // abre o modal
                                },
                            },
                        ]}
                    />
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
                            <FormGenerator
                                fields={fields}
                                form={form}
                                setForm={setForm}
                                className="grid grid-cols-2 gap-4"
                            />

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
        </div>
    );
}