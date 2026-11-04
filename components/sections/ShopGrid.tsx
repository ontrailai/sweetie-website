import { PRODUCTS, type Product } from "@/lib/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/motion/Reveal";

export function ShopGrid({ products = PRODUCTS, headingLevel = 3 }: { products?: Product[]; headingLevel?: 2 | 3 }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-7 sm:gap-y-14 md:grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))]">
      {products.map((p, i) => (
        <Reveal key={p.slug} delay={(i % 3) * 0.08}>
          <ProductCard product={p} headingLevel={headingLevel} />
        </Reveal>
      ))}
    </div>
  );
}
