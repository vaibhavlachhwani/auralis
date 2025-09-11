import { useTheme } from "next-themes";

import darkLogo from "@/assets/logo/vl-logo-light.svg";
import lightLogo from "@/assets/logo/vl-logo.svg";
import { useEffect, useState } from "react";

type VaibhavLogoProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function VaibhavLogo({ ...props }: VaibhavLogoProps) {
  const { resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const logoUrl = resolvedTheme === "dark" ? darkLogo : lightLogo;

  return <img src={logoUrl} alt="Vaibhav Lachhwani Logo" {...props} />;
}
