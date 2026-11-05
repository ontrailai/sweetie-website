import { Star } from "@/components/brand/Star";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";

const A = ["Zero sleepy honey", "Raw", "Local", "Traceable", "San Diego County"];
const B = ["No. 01 — No. 06", "Six jars", "Three sizes", "One hum"];

/** Two tilted bands that race with your scroll (decorative; info lives elsewhere). */
export function MarqueeBands({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`relative z-[5] overflow-hidden py-[clamp(40px,6vw,96px)] ${className}`}>
      <div className="-mx-8 -rotate-[3deg] border-y-2 border-nero bg-nero py-3 text-canvas">
        <VelocityMarquee baseSpeed={55} trackClassName="items-center">
          {A.map((w) => (
            <span key={w} className="flex items-center gap-[0.4em] pr-[0.4em] font-serif text-[clamp(44px,7vw,112px)] font-medium uppercase italic leading-none tracking-[-0.02em]">
              {w}
              <Star className="size-[0.55em] text-peacock" />
            </span>
          ))}
        </VelocityMarquee>
      </div>
      <div className="-mx-8 -mt-3 rotate-[2deg] border-y-2 border-nero bg-jade py-2 text-canvas">
        <VelocityMarquee baseSpeed={45} reverse trackClassName="items-center">
          {B.map((w) => (
            <span key={w} className="flex items-center gap-[0.4em] pr-[0.4em] font-serif text-[clamp(32px,4.4vw,72px)] font-semibold leading-none tracking-[-0.02em]">
              {w}
              <span className="inline-block size-[0.5em] rounded-full border-2 border-nero bg-peacock" />
            </span>
          ))}
        </VelocityMarquee>
      </div>
    </div>
  );
}
