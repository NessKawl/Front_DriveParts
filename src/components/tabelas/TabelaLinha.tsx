// TabelaLinha.tsx
interface Coluna {
  chave: string;
  titulo: string;
  size?: string;
}

interface Acao {
  label: string;
  cor?: string;
  onClick?: (item: any) => void;
  link?: string;
}

export default function TabelaLinha({
  item,
  colunas,
  acoes = [],
  gridTemplateColumns,
}: {
  item: any;
  colunas: Coluna[];
  acoes?: Acao[];
  gridTemplateColumns: string;
}) {
  return (
    <li
      style={{ gridTemplateColumns }}
      className="grid gap-2 py-2 items-center transition hover:bg-gray-900/20"
    >
      {colunas.map((c, i) => (
        <span
          key={i}
          className="text-ice text-sm truncate px-2"
          title={String(item[c.chave] ?? "")}
        >
          {item[c.chave]}
        </span>
      ))}

      {acoes.length > 0 && (
        <div className="flex gap-2 justify-end px-2">
          {acoes.map((acao, i) => (
            <button
              key={i}
              onClick={() => {
                if (acao.link) window.location.href = `${acao.link}?id=${item.id}`;
                else if (acao.onClick) acao.onClick(item);
              }}
              className={`font-semibold px-3 py-1 rounded-md transition ${acao.cor || "bg-gray-600 hover:bg-gray-700"}`}
            >
              {acao.label}
            </button>
          ))}
        </div>
      )}
    </li>
  );
}
