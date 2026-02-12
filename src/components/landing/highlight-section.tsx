export function HighlightSection() {
  return (
    <section className="relative h-[300px] md:h-[400px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#013648] via-[#012A3A] to-[#011E2D]" />
      <div className="absolute inset-0 hero-atmosphere opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#EAD8AC]/[0.04] to-transparent" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#EAD8AC]/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#EAD8AC]/20 to-transparent" />
    </section>
  );
}
