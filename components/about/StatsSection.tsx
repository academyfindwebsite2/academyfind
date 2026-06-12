const stats = [
  {
    value: "50k+",
    label: "Institutes",
  },
  {
    value: "50+",
    label: "Cities",
  },
  {
    value: "100K+",
    label: "Students Helped",
  },
];

export default function StatsSection() {
  return (
    <section
      className="
        rounded-3xl
        border
        border-amber-100
        bg-gradient-to-r
        from-amber-50
        to-orange-50
        p-10
      "
    >
      <div className="grid gap-8 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="text-center"
          >
            <h3 className="text-5xl font-bold text-amber-500">
              {stat.value}
            </h3>

            <p className="mt-3 text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}