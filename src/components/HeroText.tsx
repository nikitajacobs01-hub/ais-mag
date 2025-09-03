type HeroTextProps = {
  text: string;
};

export default function HeroText({ text }: HeroTextProps) {
  return (
    <h1 className="text-4xl md:text-6xl font-bold text-[#021024] max-w-3xl leading-snug">
      {text}
    </h1>
  );
}
