import { Trophy } from "lucide-react";
import { ReactNode } from "react";

export const EmptyState = ({ title = "Nothing here yet", description, action }: { title?: string; description?: string; action?: ReactNode }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
    <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center shadow-glow mb-5 animate-float">
      <Trophy className="h-10 w-10 text-white" />
    </div>
    <h3 className="font-display font-semibold text-xl mb-2">{title}</h3>
    {description && <p className="text-muted-foreground max-w-sm mb-5">{description}</p>}
    {action}
  </div>
);
