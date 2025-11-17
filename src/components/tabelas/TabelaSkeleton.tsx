export default function TabelaSkeleton() {
  return (
    <div className="space-y-2">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="animate-pulse bg-black-smooth h-6 rounded"></div>
        ))}
    </div>
  );
}
