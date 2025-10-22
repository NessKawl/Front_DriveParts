interface Coluna {
  chave: string;
  titulo: string;
}

export default function TabelaLinhaReserva({ item, colunas }: { item: any; colunas: Coluna[] }) {
  return (
    <li className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] py-2 transition">
      {colunas.map((c, i) => (
        <span key={i} className="text-ice text-sm truncate mr-3">{item[c.chave]} </span>
      ))}
    </li>
  );
}
