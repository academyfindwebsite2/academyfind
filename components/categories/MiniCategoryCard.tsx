interface Props {
  title: string;
  subtitle: string;
  count: string;
  icon: React.ElementType;
}

export default function MiniCategoryCard({
  title,
  subtitle,
  count,
  icon: Icon,
}: Props) {
  return (
    <div className="rounded-2xl border p-4 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <div className="rounded-xl bg-amber-50 p-2 dark:bg-amber-950/20">
            <Icon className="h-4 w-4 text-amber-500" />
          </div>

          <div>
            <h4 className="font-medium">
              {title}
            </h4>

            <p className="text-xs text-muted-foreground">
              {subtitle}
            </p>
          </div>
        </div>

        <span className="text-sm text-muted-foreground">
          {count}
        </span>
      </div>
    </div>
  );
}