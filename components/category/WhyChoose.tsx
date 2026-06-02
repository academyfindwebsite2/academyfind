import {
  GraduationCap,
  Trophy,
  Users,
} from "lucide-react";

export default function WhyChoose({
  title,
}: {
  title: string;
}) {
  const items = [
    {
      icon: GraduationCap,
      text: "Expert Faculty",
    },
    {
      icon: Trophy,
      text: "Proven Results",
    },
    {
      icon: Users,
      text: "Competitive Environment",
    },
  ];

  return (
    <section className="py-16 border-t">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold">
          Why Choose {title}
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {items.map((item) => (
            <div
              key={item.text}
              className="rounded-xl border p-6"
            >
              <item.icon className="mb-4" />

              {item.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}