import { useState } from "react";
import ComCrop from "../../components/crop/ComCrop";
 // ajuste o caminho conforme seu projeto

export default function ProdutoForm() {
  const [form, setForm] = useState({
    nome: "",
    cod: "",
    marca: "",
    valor: "",
    categoria: "",
    status: true,
  });

  const [image, setImage] = useState<string | null>(null); 
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // -------------------------
  // Selecionar produto para editar
  // -------------------------
  function selectProduct(prod: any) {
    setIsEdit(true);

    setForm({
      nome: prod.nome,
      cod: prod.cod,
      marca: prod.marca,
      valor: prod.valor,
      categoria: prod.categoria,
      status: prod.status,
    });

    setImage(prod.image || null); // só UMA fonte da imagem
  }

  // -------------------------
  // Upload de imagem
  // -------------------------
  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result as string); // imagem original
      setIsCropOpen(true);               // abre cropper
    };

    reader.readAsDataURL(file);
  }

  // -------------------------
  // Submit (create/update)
  // -------------------------
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      ...form,
      image: image, // sempre a imagem final
    };

    console.log("ENVIANDO PARA O BACK-END:", payload);

    alert("Payload enviado para teste. Confira no console.");
  }

  // ------------------------------------------------
  return (
    <div className="w-full min-h-screen flex justify-center items-start p-10 bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-6 rounded-lg w-full max-w-lg flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold">{isEdit ? "Editar Produto" : "Novo Produto"}</h2>

        <input
          type="text"
          placeholder="Nome"
          value={form.nome}
          onChange={e => setForm({ ...form, nome: e.target.value })}
          className="p-2 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Código"
          value={form.cod}
          onChange={e => setForm({ ...form, cod: e.target.value })}
          className="p-2 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Marca"
          value={form.marca}
          onChange={e => setForm({ ...form, marca: e.target.value })}
          className="p-2 border rounded"
          required
        />

        <input
          type="number"
          placeholder="Valor (R$)"
          value={form.valor}
          onChange={e => setForm({ ...form, valor: e.target.value })}
          className="p-2 border rounded"
          required
        />

        {/* Categoria */}
        <select
          value={form.categoria}
          onChange={e => setForm({ ...form, categoria: e.target.value })}
          className="p-2 border rounded"
          required
        >
          <option value="">Selecione uma categoria</option>
          <option value="motor">Motor</option>
          <option value="freios">Freios</option>
          <option value="pneus">Pneus</option>
          <option value="acessorios">Acessórios</option>
        </select>

        {/* Status */}
        <select
          value={form.status ? "ativo" : "inativo"}
          onChange={e => setForm({ ...form, status: e.target.value === "ativo" })}
          className="p-2 border rounded"
        >
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>

        {/* Upload */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Imagem do Produto:</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="p-2 border rounded"
          />

          {image && (
            <img
              src={image}
              alt="preview"
              className="w-32 h-32 object-cover rounded border"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded"
        >
          {isEdit ? "Salvar Alterações" : "Cadastrar Produto"}
        </button>

      </form>

      {/* CROP MODAL */}
      <ComCrop
        isOpen={isCropOpen}
        setIsOpen={setIsCropOpen}
        image={image}
        onCropComplete={cropped => setImage(cropped)}
      />
    </div>
  );
}
