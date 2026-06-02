import { Building2, MapPin, Star, Users } from "lucide-react";

interface Props {
  category: {
    name: string;
    description?: string;
  };
}

export default function CategoryHero({
  category: data,
}: Props) {
  return (
    <section className="border-b">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl md:text-6xl font-bold">
          Find the Best {data.name}
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          {data.description}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          <StatCard
            icon={<Building2 size={20} />}
            value="1200+"
            label="Institutes"
          />

          <StatCard
            icon={<MapPin size={20} />}
            value="100+"
            label="Cities"
          />

          <StatCard
            icon={<Users size={20} />}
            value="50K+"
            label="Reviews"
          />

          <StatCard
            icon={<Star size={20} />}
            value="4.8"
            label="Avg Rating"
          />
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border p-5">
      {icon}
      <h3 className="mt-3 text-2xl font-bold">
        {value}
      </h3>
      <p className="text-sm text-muted-foreground">
        {label}
      </p>
    </div>
  );
}