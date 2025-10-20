interface Coluna {
  chave: string;
  titulo: string;
}

export default function TabelaHeader({ colunas }: { colunas: Coluna[] }) {
  return (
    <li className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] font-bold text-ice text-sm py-2">
      {colunas.map((c, i) => (
        <span key={i}>{c.titulo}</span>
      ))}
    </li>
  );
}
