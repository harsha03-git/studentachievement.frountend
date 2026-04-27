import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  gradient: string; // tailwind classes e.g. "gradient-primary"
  delay?: number;
}

export const StatCard = ({ label, value, icon: Icon, gradient, delay = 0 }: StatCardProps) => (
  <div
    className="relative overflow-hidden rounded-2xl bg-card p-6 shadow-card hover-lift border border-border/60 animate-fade-in-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={cn("absolute -top-8 -right-8 h-32 w-32 rounded-full opacity-20 blur-2xl", gradient)} />
    <div className="relative flex items-start justify-between">
      <div>
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
        <div className="mt-2 text-3xl font-display font-bold text-foreground">{value}</div>
      </div>
      <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shadow-md", gradient)}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);
