import Button from "../../components/buttons/Button";
import NavBarDashboard from "../../components/navbar/NavBarDashboard";
import TabelaLista from "../../components/tabelas/TabelaLista";
import { useState, useCallback, useEffect } from "react";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  PackagePlus,
  X,
} from "lucide-react";
import Cropper from "react-easy-crop";
import FormGenerator from "../../components/forms/FormGenerator";
import {
  CadProduto,
  BuscaTodosProdutos,
  EditProduto,
  GetLastProduct,
} from "../../services/dataService";
import {
  CadEspecificacao,
  GetLastEsp,
  VincularEspecificacao,
  BuscaMetricas,
} from "../../services/especificacaoService";
import { dashboardReservaService } from "../../services/dashboardReservaService";
import { dashProdutosService } from "../../services/dashProdutosService";
import Modal from "../../components/modal/Modal";

interface Metrica {
  met_id: number;
  met_nome: string;
}

export default function DashProdutos() {
  const [metrica, setMetrica] = useState<Metrica[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalTitulo, setModalTitulo] = useState("");
  const [modalMensagem, setModalMensagem] = useState("");
  const [modalBotaoAcao, setModalBotaoAcao] = useState("");
  const [acaoModal, setAcaoModal] = useState<(() => void) | undefined>();
  const [modalTipo, setModalTipo] = useState<"erro" | "confirmacao">(
    "confirmacao",
  );

  const abrirModalErro = (mensagem: string) => {
    setModalTipo("erro");
    setModalTitulo(mensagem);
    setModalMensagem("");
    setModalBotaoAcao("Entendi");
    setAcaoModal(() => undefined);
    setModalAberto(true);
  };

  const abrirModalSucesso = (mensagem: string, onConfirm?: () => void) => {
    setModalTipo("confirmacao");
    setModalTitulo(mensagem);
    setModalMensagem("");
    setModalBotaoAcao("OK");

    setAcaoModal(() => () => {
      if (onConfirm) onConfirm();

      setModalAberto(false);
    });

    setModalAberto(true);
  };

  const abrirModalConfirmacao = (mensagem: string, onConfirm: () => void) => {
    setModalTipo("confirmacao");
    setModalTitulo(mensagem);
    setModalMensagem("");
    setModalBotaoAcao("Confirmar");

    setAcaoModal(() => () => {
      onConfirm();
      setModalAberto(false);
    });

    setModalAberto(true);
  };

  useEffect(() => {
    const fetchMetricas = async () => {
      const data = await BuscaMetricas();
      setMetrica(data);
    };

    fetchMetricas();
  }, []);

  const [form, setForm] = useState({
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
  const [formEdit, setFormEdit] = useState({
    nome: "",
    valor: 0,
    marca: "",
    cod: "",
    status: "Ativo",
    esp_nome: "",
    pro_esp_valor: "",
    categoria: "1",
  });
  const [edit, setEdit] = useState(false);
  const fields = [
    {
      name: "nome",
      type: "text",
      placeholder: "Nome do produto",
      required: true,
    },
    {
      name: "cod",
      type: "text",
      placeholder: "codigo do produto",
      required: true,
    },
    {
      name: "marca",
      type: "text",
      placeholder: "Marca do produto",
      required: true,
    },
    {
      name: "valor",
      type: "number",
      placeholder: "Valor do produto (R$)",
      required: true,
    },
    edit == false && {
      name: "estoque",
      type: "number",
      placeholder: "Quantidade em estoque",
      required: true,
    },
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
        { label: "Pneus", value: "9" },
        { label: "Acessorios", value: "8" },
        { label: "Transmissão", value: "7" },
        { label: "Elétrica", value: "3" },
        { label: "Filtros", value: "5" },
        { label: "Óleos e Lubrificantes", value: "6" },
        { label: "Outros", value: "10" },
      ],
    },
  ].filter(Boolean) as any[];
  const [isOpenEstoque, setIsOpenEstoque] = useState(false);
  const [tipoEstoque, setTipoEstoque] = useState<"Entrada" | "Saida" | null>(
    null,
  );
  const abrirModal = (tipo: "Entrada" | "Saida") => {
    setTipoEstoque(tipo);
    setIsOpenEstoque(true);
    setFormEstoque({
      tipo: "",
      descricao: "",
      valor: "",
      data: "",
      quantidade: "",
      produtoId: "",
    });
  };
  const [formEstoque, setFormEstoque] = useState({
    tipo: "",
    descricao: "",
    valor: "",
    data: "",
    quantidade: "",
    produtoId: "",
  });
  const fieldsEstoque = [
    {
      name: "tipo",
      type: "select",
      placeholder: "Selecione o tipo de movimentação",
      options:
        tipoEstoque === "Saida"
          ? [
              { label: "Venda", value: "VENDA" },
              { label: "Defeito", value: "DEFEITO" },
              { label: "Perda", value: "PERDA" },
              { label: "Vencimento", value: "VENCIMENTO" },
              { label: "Uso e Consumo", value: "USO_E_CONSUMO" },
            ]
          : [
              { label: "Compra", value: "COMPRA" },
              { label: "Devolução", value: "DEVOLUCAO" },
              { label: "Outros", value: "OUTROS" },
            ],
    },
    { name: "data", type: "date", placeholder: "Data da movimentação" },
    { name: "quantidade", type: "number", placeholder: "Quantidade", min: 1 },
  ];

  const [produtoBuscaEstoque, setProdutoBuscaEstoque] = useState("");
  const [produtosEncontrados, setProdutosEncontrados] = useState<any[]>([]);
  const [produtoSelecionadoEstoque, setProdutoSelecionadoEstoque] = useState<
    any | null
  >(null);
  const [produtos, setProdutos] = useState<any[]>([]);

  const buscarProdutoEstoque = async () => {
    if (!produtoBuscaEstoque.trim()) return;

    try {
      const res =
        await dashboardReservaService.buscarProduto(produtoBuscaEstoque);

      setProdutosEncontrados(res);
    } catch (error) {
      console.error(error);
      abrirModalErro("Erro ao buscar produtos");
    }
  };

  const salvarMovimentacao = async () => {
    try {
      await dashProdutosService.CriarMovimentacaoProduto(
        Number(formEstoque.produtoId),
        Number(formEstoque.quantidade),
        formEstoque.tipo,
        formEstoque.data,
      );

      abrirModalSucesso("Movimentação cadastrada com sucesso!", () => {
        window.location.reload();
      });

      setIsOpenEstoque(false);

      setFormEstoque({
        tipo: "",
        descricao: "",
        valor: "",
        data: "",
        quantidade: "",
        produtoId: "",
      });

      setProdutoBuscaEstoque("");
      setProdutosEncontrados([]);
      setProdutoSelecionadoEstoque(null);
    } catch (error) {
      console.error(error);
      abrirModalErro("Erro ao registrar movimentação");
    }
  };

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

  const [espId, setEspId] = useState("");

  useEffect(() => {
    const loadEspId = async () => {
      const data = await GetLastEsp();
      setEspId(data.esp_id + 1);
    };

    loadEspId();
  }, []);

  const [especificacoes, setEspecificacoes] = useState([
    {
      esp_nome: "",
      pro_esp_valor: "",
      esp_id: "",
      pro_id: "",
      met_id: 1,
    },
  ]);

  const adicionarEspecificacao = async () => {
    setEspecificacoes([
      ...especificacoes,
      { esp_nome: "", esp_id: "", pro_id: "", pro_esp_valor: "", met_id: 1 },
    ]);

    setEspId(espId + 1);

    console.log("Teste ESP", espId);
  };

  const atualizarEspecificacaoNome = async (
    index: number,
    novoValor: string,
  ) => {
    const novas = [...especificacoes];
    novas[index].esp_nome = novoValor;

    const res = await GetLastProduct();
    const pro_id = res.pro_id + 1;
    setEspecificacoes(novas);

    novas[index].pro_id = pro_id;

    console.log(especificacoes);
  };

  const atualizarEspecificacaoValor = async (
    index: number,
    pro_esp_valor: string,
  ) => {
    const novas = [...especificacoes];
    novas[index].pro_esp_valor = pro_esp_valor;

    setEspecificacoes(novas);

    novas[index].esp_id = espId;

    console.log("esp_id");
    console.log("pro_esp_valor: ", especificacoes);
  };

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
      if (!file.type.startsWith("image/"))
        return alert("Envie apenas imagens!");
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
      alert(
        "Preencha todos os campos obrigatórios e adicione pelo menos uma imagem.",
      );
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

      const categoria = Number(form.categoria);

      const espNome = especificacoes.map((item) => item.esp_nome);

      const resEspecificacao = await CadEspecificacao(espNome, categoria);

      const resProduct = await GetLastProduct();
      const proId = resProduct.pro_id + 1;

      const espId = especificacoes.map((item) => Number(item.esp_id));
      const proEspValor = especificacoes.map((item) => item.pro_esp_valor);

      const metricaIds = especificacoes.map((item) => Number(item.met_id));

      if (resEspecificacao) {
        const valor = Number(form.valor);
        const resProduto = await CadProduto(
          form.nome,
          valor,
          form.marca,
          form.cod,
          form.status,
          uploadedUrl,
        );

        if (!resProduto || !resProduto.pro_id) {
          throw new Error("Erro ao cadastrar produto");
        }

        if (resProduto) {
          await VincularEspecificacao(proId, espId, proEspValor, metricaIds);
        }

        if (form.estoque && form.estoque > 0) {
          const idNumber = Number(resProduto.pro_id);
          const estoque = Number(form.estoque);
          await dashProdutosService.CriarMovimentacaoProduto(
            idNumber,
            estoque,
            "COMPRA",
            new Date().toISOString(),
          );
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

      window.location.reload();
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
        uploadedUrl,
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

    if (
      !formEstoque.tipo ||
      !formEstoque.data ||
      !formEstoque.quantidade ||
      !formEstoque.produtoId
    ) {
      abrirModalErro("Preencha todos os campos obrigatórios");
      return;
    }

    const quantidade = Number(formEstoque.quantidade);

    if (
      tipoEstoque === "Saida" &&
      produtoSelecionadoEstoque &&
      quantidade > produtoSelecionadoEstoque.estoque
    ) {
      abrirModalErro(
        `Estoque insuficiente. Estoque atual: ${produtoSelecionadoEstoque.estoque}`,
      );
      return;
    }

    abrirModalConfirmacao(
      `Deseja confirmar a ${
        tipoEstoque === "Saida" ? "saída" : "entrada"
      } de estoque?`,
      salvarMovimentacao,
    );
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
      height,
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

      // Exibir imagem existente se houver
      if (produtoEditando.pro_caminho_img) {
        setPreviewUrls([produtoEditando.pro_caminho_img]);
      } else {
        setPreviewUrls([]);
      }
    }
  }, [produtoEditando]);

  const fecharModalCadastro = () => {
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
    setEspecificacoes([
      {
        esp_nome: "",
        pro_esp_valor: "",
        esp_id: "",
        pro_id: "",
        met_id: 1,
      },
    ]);
  };

  const fecharModalEdicao = () => {
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
  };

  const carregarProdutos = useCallback(async () => {
    const data = await BuscaTodosProdutos();

    const produtosFormatados = data.map((p: any) => ({
      ...p,
      codigo: p.pro_cod,
      id: p.pro_id,
      produto: p.pro_nome,
      marca: p.pro_marca,
      valor: p.pro_valor,
      estoque: p.estoque ?? 0,
      status: p.pro_status ? "Ativo" : "Inativo",
    }));

    setProdutos(produtosFormatados);

    return produtosFormatados;
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, []);

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
              });

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

              setEspecificacoes([
                {
                  esp_nome: "",
                  pro_esp_valor: "",
                  esp_id: "",
                  pro_id: "",
                  met_id: 1,
                },
              ]);
              setIsOpen(true);
            }}
          >
            <PackagePlus className="w-6 h-6 mr-2" />
            Adicionar Produto
          </Button>
        </div>
        <div>
          <TabelaLista
            titulo="Produtos"
            filtro={false}
            tituloFiltro="Filtar"
            filtroChildren={[
              { value: "A-Z", children: "De A-Z" },
              { value: "Z-A", children: "De Z-A" },
              { value: "Menor", children: "Menor preço" },
              { value: "Maior", children: "Maior preço" },
              { value: "Ativo", children: "Ativos" },
              { value: "Inativo", children: "Inativos" },
            ]}
            pesquisa={false}
            colunas={[
              { chave: "codigo", titulo: "Código", size: "sm" },
              { chave: "produto", titulo: "Produto", size: "auto" },
              { chave: "descricao", titulo: "Descrição", size: "auto" },
              { chave: "valor", titulo: "Valor Unidade", size: "md" },
              { chave: "estoque", titulo: "Estoque", size: "sm" },
              { chave: "status", titulo: "Status", size: "sm" },
            ]}
            fetchData={() => Promise.resolve(produtos)}
            alturaMax="max-h-[500px]"
            acoes={[
              {
                label: "Editar",
                cor: "bg-primary-orange text-black-smooth hover:bg-orange-300",
                onClick: (item) => {
                  setProdutoEditando(item);
                  setIsOpenEdit(true); 
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
        <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50 transition-all duration-300">
          <div className="bg-black-smooth w-full max-w-4xl h-auto max-h-[95vh] rounded-3xl p-8 md:p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex flex-row justify-between items-center mb-8 border-b border-white/10 pb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-orange/20 text-primary-orange rounded-2xl">
                  <PackagePlus size={28} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    Cadastrar Produto
                  </h1>
                  <p className="text-white/50 text-sm">Adicione um novo item ao seu catálogo</p>
                </div>
              </div>
              <button
                onClick={fecharModalCadastro}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
              >
                <X size={28} />
              </button>
            </div>

            <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
              {/* Upload de imagens */}
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <label className="text-lg font-semibold text-white block mb-4 flex items-center gap-2">
                  <div className="w-2 h-6 bg-primary-orange rounded-full"></div>
                  Imagens do Produto
                </label>
                <div className="flex flex-col md:flex-row gap-6">
                   <div className="flex-1">
                      <div className="relative group border-2 border-dashed border-white/20 hover:border-primary-orange/50 rounded-2xl p-8 transition-all duration-300 bg-black/20 flex flex-col items-center justify-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className="p-4 bg-white/5 rounded-full text-white/50 group-hover:text-primary-orange transition-colors">
                           <PackagePlus size={32} />
                        </div>
                        <div className="text-center">
                          <p className="text-white font-medium">Clique para enviar</p>
                          <p className="text-white/40 text-xs mt-1">PNG, JPG até 5MB cada</p>
                        </div>
                      </div>
                   </div>

                   <div className="flex-[2]">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {previewUrls.map((url, i) => (
                          <div
                            key={i}
                            className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 shadow-lg"
                          >
                            <img
                              src={url}
                              alt="preview"
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div 
                              className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              onClick={() => {
                                setSelectedImage(url);
                                setSelectedIndex(i);
                              }}
                            >
                              <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/20">
                                Cortar
                              </span>
                            </div>
                          </div>
                        ))}
                        {previewUrls.length === 0 && (
                           <div className="col-span-full h-full flex items-center justify-center text-white/20 text-sm italic py-10">
                              Nenhuma imagem selecionada
                           </div>
                        )}
                      </div>
                   </div>
                </div>
              </div>

              {/* Inputs dinâmicos */}
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <label className="text-lg font-semibold text-white block mb-6 flex items-center gap-2">
                  <div className="w-2 h-6 bg-primary-orange rounded-full"></div>
                  Informações Gerais
                </label>
                <FormGenerator
                  fields={fields}
                  form={form}
                  setForm={setForm}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                />
              </div>

              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <label className="text-lg font-semibold text-white flex items-center gap-2">
                    <div className="w-2 h-6 bg-primary-orange rounded-full"></div>
                    Especificações
                  </label>
                  <button
                    type="button"
                    onClick={adicionarEspecificacao}
                    className="bg-primary-orange hover:bg-orange-500 px-4 py-2 rounded-xl text-black-smooth font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary-orange/20"
                  >
                    <PackagePlus size={18} />
                    Adicionar
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {especificacoes.map((esp, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-black/20 rounded-xl border border-white/5">
                      <input
                        type="text"
                        placeholder="Nome (ex: Material)"
                        value={esp.esp_nome}
                        onChange={(e) =>
                          atualizarEspecificacaoNome(i, e.target.value)
                        }
                        className="bg-ice/5 border border-white/10 text-white p-3 rounded-lg focus:border-primary-orange/50 outline-none transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Valor (ex: Aço)"
                        value={esp.pro_esp_valor}
                        onChange={(e) =>
                          atualizarEspecificacaoValor(i, e.target.value)
                        }
                        className="bg-ice/5 border border-white/10 text-white p-3 rounded-lg focus:border-primary-orange/50 outline-none transition-colors"
                      />
                      <select
                        className="bg-ice/5 border border-white/10 text-white p-3 rounded-lg focus:border-primary-orange/50 outline-none transition-colors"
                        value={esp.met_id}
                        onChange={(e) =>
                          atualizarMetrica(i, Number(e.target.value))
                        }
                      >
                        {metrica.map((m) => (
                          <option key={m.met_id} value={m.met_id} className="bg-black-smooth">
                            {m.met_nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end items-center gap-4 pt-4 border-t border-white/10 mt-4">
                <button
                  type="button"
                  onClick={fecharModalCadastro}
                  className="px-8 py-3 text-white/70 hover:text-white font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-pear-green hover:bg-green-600 px-12 py-3 text-white text-lg font-bold rounded-xl shadow-lg shadow-pear-green/20 hover:shadow-pear-green/40 transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
                >
                  Cadastrar Produto
                </button>
              </div>
            </form>
          </div>
          

        </div>
      )}

      {/* === MODAL DE EDIÇÃO === */}
      {isOpenEdit && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50 transition-all duration-300">
          <div className="bg-black-smooth w-full max-w-4xl h-auto max-h-[95vh] rounded-3xl p-8 md:p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex flex-row justify-between items-center mb-8 border-b border-white/10 pb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-orange/20 text-primary-orange rounded-2xl">
                  <PackagePlus size={28} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    Editar Produto
                  </h1>
                  <p className="text-white/50 text-sm">Atualize as informações e imagens do produto</p>
                </div>
              </div>
              <button
                onClick={fecharModalEdicao}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
              >
                <X size={28} />
              </button>
            </div>

            <form className="flex flex-col gap-8" onSubmit={handleUpdate}>
              {/* Upload de imagens */}
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <label className="text-lg font-semibold text-white block mb-4 flex items-center gap-2">
                  <div className="w-2 h-6 bg-primary-orange rounded-full"></div>
                  Imagens do Produto
                </label>
                <div className="flex flex-col md:flex-row gap-6">
                   <div className="flex-1">
                      <div className="relative group border-2 border-dashed border-white/20 hover:border-primary-orange/50 rounded-2xl p-8 transition-all duration-300 bg-black/20 flex flex-col items-center justify-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className="p-4 bg-white/5 rounded-full text-white/50 group-hover:text-primary-orange transition-colors">
                           <PackagePlus size={32} />
                        </div>
                        <div className="text-center">
                          <p className="text-white font-medium">Clique para enviar</p>
                          <p className="text-white/40 text-xs mt-1">PNG, JPG até 5MB cada</p>
                        </div>
                      </div>
                   </div>

                   <div className="flex-[2]">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {previewUrls.map((url, i) => (
                          <div
                            key={i}
                            className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 shadow-lg"
                          >
                            <img
                              src={url}
                              alt="preview"
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div 
                              className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              onClick={() => {
                                setSelectedImage(url);
                                setSelectedIndex(i);
                              }}
                            >
                              <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/20">
                                Cortar
                              </span>
                            </div>
                          </div>
                        ))}
                        {previewUrls.length === 0 && (
                           <div className="col-span-full h-full flex items-center justify-center text-white/20 text-sm italic py-10">
                              Nenhuma imagem selecionada
                           </div>
                        )}
                      </div>
                   </div>
                </div>
              </div>

              {/* Inputs dinâmicos */}
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <label className="text-lg font-semibold text-white block mb-6 flex items-center gap-2">
                  <div className="w-2 h-6 bg-primary-orange rounded-full"></div>
                  Informações Gerais
                </label>
                <FormGenerator
                  fields={fields}
                  form={formEdit}
                  setForm={setFormEdit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                />
              </div>

              <div className="flex justify-end items-center gap-4 pt-4 border-t border-white/10 mt-4">
                <button
                  type="button"
                  onClick={fecharModalEdicao}
                  className="px-8 py-3 text-white/70 hover:text-white font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-pear-green hover:bg-green-600 px-12 py-3 text-white text-lg font-bold rounded-xl shadow-lg shadow-pear-green/20 hover:shadow-pear-green/40 transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* === MODAL DE ENTRADA/SAIDA === */}
      {isOpenEstoque && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50 transition-all duration-300">
          <div className="bg-black-smooth w-full max-w-2xl h-auto max-h-[90vh] rounded-3xl p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex flex-row justify-between items-center mb-8 border-b border-white/10 pb-4">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-2xl ${tipoEstoque === "Saida" ? "bg-red-500/20 text-red-500" : "bg-pear-green/20 text-pear-green"}`}
                >
                  {tipoEstoque === "Saida" ? (
                    <BanknoteArrowDown size={28} />
                  ) : (
                    <BanknoteArrowUp size={28} />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Registrar {tipoEstoque === "Saida" ? "Saída" : "Entrada"}
                  </h1>
                  <p className="text-white/50 text-sm">
                    Preencha os dados da movimentação abaixo
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpenEstoque(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
              >
                <X size={28} />
              </button>
            </div>

            <form
              className="flex flex-col gap-8 w-full"
              onSubmit={handleSubmitEstoque}
            >
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <FormGenerator
                  fields={fieldsEstoque}
                  form={formEstoque}
                  setForm={setFormEstoque}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
                />

                <div className="flex flex-col gap-4">
                  <label className="text-white font-semibold">
                    Buscar Produto
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={produtoBuscaEstoque}
                      onChange={(e) => setProdutoBuscaEstoque(e.target.value)}
                      placeholder="Digite nome ou código"
                      className="bg-ice/90 text-black rounded-md p-2 w-full"
                    />

                    <button
                      type="button"
                      onClick={buscarProdutoEstoque}
                      className="bg-primary-orange px-4 rounded-md font-semibold"
                    >
                      Buscar
                    </button>
                  </div>

                  {produtosEncontrados.length > 0 && (
                    <select
                      className="bg-ice/90 text-black rounded-md p-2"
                      value={produtoSelecionadoEstoque?.pro_id || ""}
                      onChange={(e) => {
                        const produto = produtosEncontrados.find(
                          (p) => p.pro_id === Number(e.target.value),
                        );

                        setProdutoSelecionadoEstoque(produto);

                        setFormEstoque((prev) => ({
                          ...prev,
                          produtoId: produto?.pro_id || "",
                        }));
                      }}
                    >
                      <option value="">Selecione um produto</option>

                      {produtosEncontrados.map((produto) => (
                        <option key={produto.pro_id} value={produto.pro_id}>
                          {produto.pro_nome} - Estoque: {produto.estoque ?? 0}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="flex justify-end items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    abrirModalConfirmacao(
                      "Deseja realmente cancelar a movimentação?",
                      () => {
                        setIsOpen(false);
                        setSelectedImage(null);
                        setIsOpenEdit(false);
                        setIsOpenEstoque(false);
                      },
                    )
                  }
                  className="px-6 py-3 text-white/70 hover:text-white font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-primary-orange hover:bg-orange-500 px-10 py-3 text-black-smooth text-lg font-bold rounded-xl shadow-lg shadow-primary-orange/20 hover:shadow-primary-orange/40 transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
                >
                  Confirmar {tipoEstoque === "Saida" ? "Saída" : "Entrada"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
          onCancel: () => setModalAberto(false),
        })}
      />

      {/* Modal de corte de imagem (Global para Cadastro e Edição) */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-sm">
          <div className="bg-black-smooth p-8 rounded-3xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-primary-orange mb-6 text-xl font-bold flex items-center gap-2">
              <div className="w-2 h-6 bg-primary-orange rounded-full"></div>
              Ajustar Imagem
            </h2>
            <div className="relative w-[500px] h-[400px] rounded-xl overflow-hidden border border-white/5">
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
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setSelectedImage(null)}
                className="px-6 py-2 text-white/70 hover:text-white font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCrop}
                className="px-8 py-3 bg-primary-orange hover:bg-orange-500 text-black-smooth font-bold rounded-xl shadow-lg shadow-primary-orange/20 transition-all active:scale-95"
              >
                Salvar Corte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
