import { Header } from '@/components/header';
import { MainPage } from '@/components/main-page';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
        <div className="w-full max-w-4xl">
          <MainPage />
        </div>
      </main>
    </div>
  );
}
