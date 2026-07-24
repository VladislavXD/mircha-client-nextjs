import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  ListChecks,
  Timer,
  MessageSquare,
  Calendar,
  Target,
  Milestone,
  Users,
} from "lucide-react";

const features = [
  { icon: LayoutDashboard, label: "Проекты" },
  { icon: ListChecks, label: "Задачи" },
  { icon: Timer, label: "Таймеры" },
  { icon: MessageSquare, label: "Чаты" },
  { icon: Calendar, label: "Дедлайны" },
  { icon: Target, label: "Планы" },
  { icon: Milestone, label: "Этапы" },
  { icon: Users, label: "Команда" },
];


export default function ProjectsComingSoon() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-xl text-center">

        {/* Status badge */}
        <div className="mb-8 flex justify-center">
          <Badge
            variant="secondary"
            className="gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide uppercase"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            В разработке
          </Badge>
        </div>

        {/* Quote */}
        <blockquote className="mb-4">
          <p className="text-3xl font-light leading-snug tracking-tight text-foreground sm:text-4xl">
            Великие проекты не рождаются из идей —  
          </p>
          <p className="text-3xl font-light leading-snug tracking-tight text-foreground sm:text-4xl">
            они рождаются из решения{" "}
            <em className="font-normal not-italic text-muted-foreground">
              довести их до конца
            </em>
          </p>
        </blockquote>

        <Separator className="mx-auto my-8 w-12" />

        {/* Subtitle */}
        <p className="mb-10 text-sm text-muted-foreground">
          coming soon
        </p>

        {/* Feature grid */}
        {/* <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {features.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card px-2 py-4 transition-colors hover:bg-accent/50"
            >
              <Icon className="h-5 w-5 text-violet-500" strokeWidth={1.5} />
              <span className="text-[11px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div> */}

      </div>
    </div>
  );
}