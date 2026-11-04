import { Marquee } from "@/components/motion/Marquee";

/** Two crossing bands: forest (from the mockup) over a reversed peacock band. */
export function MarqueeBands({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-[clamp(150px,15vw,220px)] overflow-hidden ${className}`}>
      <div className="on-pink absolute -left-[5%] top-[44%] w-[110%] rotate-[2.5deg] border-y-2 border-nero bg-peacock py-4 text-canvas">
        <Marquee
          items={["Raw", "Local", "Traceable", "Small batch", "Feel the hum"]}
          reverse
          duration={38}
          className="font-serif text-[clamp(30px,3vw,42px)] uppercase italic tracking-[0.06em]"
        />
      </div>
      <div className="on-dark absolute -left-[5%] top-[18%] w-[110%] -rotate-2 border-y-2 border-nero bg-forest py-5 text-canvas">
        <Marquee
          label="Six jars, three sizes. Zero sleepy honey."
          items={["Six jars", "Three sizes", "Zero sleepy honey", "No. 01 – No. 06"]}
          duration={32}
          className="font-serif text-[clamp(30px,3vw,42px)] uppercase tracking-[0.06em]"
        />
      </div>
    </div>
  );
}
