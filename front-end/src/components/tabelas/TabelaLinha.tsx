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
      className="grid gap-2 py-2.5 items-center border-b border-[#151515] last:border-b-0 transition-all duration-150 hover:bg-[#121212]/40 rounded-xl px-2 my-0.5 group"
    >
      {colunas.map((c, i) => (
        <span
          key={i}
          className="text-gray-300 text-sm truncate px-2 group-hover:text-white transition-colors"
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
              className={`font-semibold text-xs px-3 py-1 rounded-lg transition-all duration-150 ${acao.cor || "bg-gray-600 hover:bg-gray-700"}`}
            >
              {acao.label}
            </button>
          ))}
        </div>
      )}
    </li>
  );
}

