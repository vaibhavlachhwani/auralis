import { Badge } from "./ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils"; // For conditional class names

// Define the shape of the props our card will accept
type KpiCardProps = {
  title: string;
  value: string;
  unit: string;
  change: number; // The calculated percentage change
};

export function KpiCard({ title, value, unit, change }: KpiCardProps) {
  const changeType =
    change > 0 ? "increase" : change < 0 ? "decrease" : "no-change";

  const badgeText =
    changeType === "increase"
      ? `↗ +${change.toFixed(1)}%`
      : changeType === "decrease"
      ? `↘ ${change.toFixed(1)}%`
      : `→ 0%`;

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardDescription>{title}</CardDescription>
          <Badge
            variant="secondary"
            className={cn(
              "text-xs",
              changeType === "increase" &&
                "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
              changeType === "decrease" &&
                "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
              changeType === "no-change" &&
                "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
            )}
          >
            {badgeText}
          </Badge>
        </div>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        <div className="text-sm text-muted-foreground">{unit}</div>
      </CardHeader>
    </Card>
  );
}
