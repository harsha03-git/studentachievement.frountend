import { Achievement, categoryColors, typeColors, statusColors } from "@/data/mockData";
import { Calendar, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import torus from "@/assets/3d-torus.png";
import cone from "@/assets/3d-cone.png";
import plane from "@/assets/3d-plane.png";
import sphere from "@/assets/3d-sphere.png";

const visuals = [torus, cone, plane, sphere];

const hashIndex = (s: string, len: number) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % len;
};

const visualBg = ["bg-accent/15", "bg-secondary/15", "bg-primary/10", "bg-status-finish/15"];

export const AchievementCard = ({
  achievement,
  delay = 0,
  onClick,
}: {
  achievement: Achievement;
  delay?: number;
  onClick?: () => void;
}) => {
  const idx = hashIndex(achievement.id, visuals.length);
  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl bg-card border border-border/60 shadow-card hover-lift animate-fade-in-up cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground font-medium">
            {new Date(achievement.date).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
          <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full text-white bg-gradient-to-r", typeColors[achievement.type])}>
            {achievement.type}
          </span>
        </div>

        <h3 className="font-display font-bold text-base leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
          {achievement.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
          {achievement.description}
        </p>

        <div className={cn("rounded-xl p-3 flex items-center justify-center mb-4 h-32", visualBg[idx])}>
          <img
            src={visuals[idx]}
            alt=""
            loading="lazy"
            className="h-full w-auto object-contain group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-white bg-gradient-to-r", categoryColors[achievement.category])}>
              {achievement.category}
            </span>
            <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-white", statusColors[achievement.status])}>
              {achievement.status}
            </span>
          </div>
          {achievement.feedback && (
            <div className="bg-muted/50 p-2.5 rounded-lg text-xs text-muted-foreground border border-border/40">
              <div className="flex items-center gap-1.5 font-medium text-foreground mb-1">
                <MessageSquare className="h-3 w-3" /> Teacher Remarks
              </div>
              <p className="line-clamp-2">{achievement.feedback}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
