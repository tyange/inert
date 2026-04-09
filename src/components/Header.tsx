import { useRouteContext } from "@tanstack/react-router";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const { theme } = useRouteContext({ from: "__root__" });

  return (
    <header>
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-12">
        <span className="text-base font-bold tracking-tight text-(--sea-ink)">inert</span>
        <ThemeToggle serverTheme={theme} />
      </div>
    </header>
  );
}
