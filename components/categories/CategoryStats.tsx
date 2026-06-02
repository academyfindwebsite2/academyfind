import {
  Building2,
  MapPin,
  Star,
  Layers3,
} from "lucide-react";

const stats = [
  {
    title: "Categories",
    value: "24",
    icon: Layers3,
  },
  {
    title: "Institutes",
    value: "2400+",
    icon: Building2,
  },
  {
    title: "Cities",
    value: "120",
    icon: MapPin,
  },
  {
    title: "Avg Rating",
    value: "4.6",
    icon: Star,
  },
];

export default function CategoryStats() {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-3xl border bg-card p-6 transition-all hover:shadow-lg"
            >
              <Icon className="h-5 w-5 text-amber-500" />

              <p className="mt-4 text-muted-foreground text-sm">
                {item.title}
              </p>

              <h3 className="mt-2 text-4xl font-bold">
                {item.value}
              </h3>
            </div>
          );
        })}
      </div>
    </section>
  );
}