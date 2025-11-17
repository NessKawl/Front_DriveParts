// TabelaHeader.tsx
interface Coluna {
  chave: string;
  titulo: string;
  size?: string;
}

export default function TabelaHeader({
  colunas,
  temAcoes = false,
  gridTemplateColumns,
}: {
  colunas: Coluna[];
  temAcoes?: boolean;
  gridTemplateColumns: string;
}) {
  return (
    <li
      style={{ gridTemplateColumns }}
      className="grid gap-2 font-bold text-ice text-sm py-2 items-center border-b border-gray-600/40"
    >
      {colunas.map((c, i) => (
        <span key={i} className="truncate px-2" title={c.titulo}>
          {c.titulo}
        </span>
      ))}
      {temAcoes && <span className="text-end px-2">Ações</span>}
    </li>
  );
}
