const institutes = [
  {
    name: "Allen Career Institute",
    city: "Kota",
  },
  {
    name: "Aakash Institute",
    city: "Delhi",
  },
  {
    name: "Resonance",
    city: "Kota",
  },
];

interface City {
  id: string;
  name: string;
  slug: string;
}

interface Institute{
    name: string;
    city: City;
}

interface Props {
    institutes: Institute[];
}

export default function FeaturedInstitutes({ institutes }: Props) {
  return (
    <section className="py-16 border-t">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold">
          Featured Institutes
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {institutes.map((item) => (
            <div
              key={item.name}
              className="rounded-xl border p-6"
            >
              <h3 className="font-semibold">
                {item.name}
              </h3>

              <p className="text-muted-foreground mt-2">
                {item.city.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}