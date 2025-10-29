import { NayanAiLogo } from '@/components/truth-pulse-logo';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <NayanAiLogo className="h-8 w-8" />
            <span className="font-bold text-lg sm:inline-block">
              Nayan.ai
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* GitHub button removed */}
        </div>
      </div>
    </header>
  );
}
