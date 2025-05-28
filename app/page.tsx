import { HeroHeader } from '@/components/sections/HeroHeader';

export default function Home() {
  return (
    <>
      <HeroHeader />
      <div className="h-screen w-full bg-black text-white">
        <h1>Hello</h1>
      </div>
    </>
  );
}
