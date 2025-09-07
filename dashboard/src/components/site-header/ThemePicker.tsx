import { Button } from "../ui/button";

export function ThemePicker() {
  return (
    <div className="ml-auto flex items-center gap-2">
      <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
        <a
          href="https://github.com/vaibhavlachhwani/auralis"
          rel="noopener noreferrer"
          target="_blank"
          className="dark:text-foreground"
        >
          GitHub
        </a>
      </Button>
    </div>
  );
}
