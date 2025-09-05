import lightLogo from "@/assets/logo/vl-logo-light.svg";
import darkLogo from "@/assets/logo/vl-logo.svg";

type VaibhavLogoProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  isDark?: boolean;
};

export function VaibhavLogo({ isDark = true, ...props }: VaibhavLogoProps) {
  const logoUrl = isDark ? darkLogo : lightLogo;

  return <img src={logoUrl} alt="Vaibhav Lachhwani Logo" {...props} />;
}
