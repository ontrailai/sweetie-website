import { Hero } from "@/components/home/Hero";
import { MarqueeBands } from "@/components/home/MarqueeBands";
import { Manifesto } from "@/components/home/Manifesto";
import { JarSequence } from "@/components/home/JarSequence";
import { DiscoveryDrop } from "@/components/home/DiscoveryDrop";
import { SkyRituals } from "@/components/home/SkyRituals";
import { SubscriptionDial } from "@/components/home/SubscriptionDial";
import { TraceTeaser } from "@/components/home/TraceTeaser";
import { Community } from "@/components/sections/Community";
import { SignupSection } from "@/components/sections/SignupSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MarqueeBands className="bg-canvas" />
      <Manifesto />
      <JarSequence />
      <DiscoveryDrop />
      <SkyRituals />
      <SubscriptionDial />
      <TraceTeaser />
      <Community />
      <SignupSection />
    </>
  );
}
