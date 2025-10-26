interface Coluna {
  chave: string;
  titulo: string;
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
}: {
  item: any;
  colunas: Coluna[];
  acoes?: Acao[];
}) {
  return (
    <li className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] py-2 items-center transition">
      {colunas.map((c, i) => (
        <span key={i} className="text-ice text-sm truncate mr-3">
          {item[c.chave]}
        </span>
      ))}

      {acoes.length > 0 && (
        <div className="flex gap-2 justify-end">
          {acoes.map((acao, i) => (
            <button
              key={i}
              onClick={() => {
                if (acao.link) window.location.href = `${acao.link}?id=${item.id}`;
                else if (acao.onClick) acao.onClick(item);
              }}
              className={`font-semibold px-3 py-1 rounded-md transition 
                ${acao.cor || "bg-gray-600 hover:bg-gray-700"}`}
            >
              {acao.label}
            </button>
          ))}
        </div>
      )}
    </li>
  );
}
