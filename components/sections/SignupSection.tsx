import { EmailSignup } from "@/components/forms/EmailSignup";

export function SignupSection() {
  return (
    <section aria-labelledby="signup-h" className="on-pink px-gutter bg-peacock pt-[clamp(72px,9vw,128px)] text-canvas">
      <div className="container-x flex flex-wrap items-end gap-x-[72px] gap-y-14 border-b-2 border-canvas pb-[clamp(72px,9vw,120px)]">
        <h2 id="signup-h" className="min-w-0 flex-[1_1_520px] text-[clamp(64px,8.6vw,136px)] leading-[0.88] tracking-[0.015em]">
          Get in on <em>the hum.</em>
        </h2>
        <EmailSignup className="min-w-0 flex-[1_1_400px]" />
      </div>
    </section>
  );
}
