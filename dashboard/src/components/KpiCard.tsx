import { Badge } from "./ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function KpiCard() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardDescription>Total Revenue</CardDescription>
          <Badge
            variant="secondary"
            className="text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
          >
            ↗ +12.5%
          </Badge>
        </div>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          $1,250.00
        </CardTitle>
        <div className="text-sm text-muted-foreground">USD</div>
      </CardHeader>
    </Card>
  );
}
