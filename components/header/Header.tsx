import { HeartPulse } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur bg-white/70 dark:bg-gray-950/80">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-7 w-7 text-red-600" />
          <a href="/" className="text-gray-900 dark:text-white">
            <span className="text-xl font-semibold tracking-tight">
              VitalScope
            </span>
          </a>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <a href="#features" className="hover:text-primary transition-colors">
            Features
          </a>
          <a href="#mission" className="hover:text-primary transition-colors">
            Mission
          </a>
        </nav>
      </div>
    </header>
  );
};
export default Header;
