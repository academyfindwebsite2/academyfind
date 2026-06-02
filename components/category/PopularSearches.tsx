interface Props {
  categoryName: string;
}

export default function PopularSearches({
  categoryName,
}: Props) {
  const searches = [
    `Best ${categoryName}`,
    `${categoryName} in Kota`,
    `${categoryName} in Delhi`,
    `Affordable ${categoryName}`,
  ];
  return (
    <section className="py-16 border-t">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold">
          Popular Searches
        </h2>

        <div className="flex flex-wrap gap-3 mt-8">
          {searches.map((search) => (
            <div
              key={search}
              className="rounded-full border px-4 py-2"
            >
              {search}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}