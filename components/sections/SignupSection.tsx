import { EmailSignup } from "@/components/forms/EmailSignup";
import { SplitText } from "@/components/motion/SplitText";
import { HoneyDrip } from "@/components/fx/HoneyDrip";

export function SignupSection() {
  return (
    <section aria-labelledby="signup-h" className="on-pink px-gutter relative z-[1] bg-peacock pb-[clamp(72px,8vw,120px)] pt-[clamp(80px,9vw,150px)] text-canvas">
      <div className="container-x grid items-end gap-x-16 gap-y-10 lg:grid-cols-[1.3fr_1fr]">
        <h2 id="signup-h" className="display text-[clamp(80px,11vw,210px)]">
          <SplitText text="Get in on" /> <em><SplitText text="the hum." start={7} /></em>
        </h2>
        <EmailSignup />
      </div>
      <HoneyDrip className="absolute inset-x-0 top-[calc(100%-2px)] z-[2] h-[clamp(36px,5vw,80px)] text-peacock" />
    </section>
  );
}
