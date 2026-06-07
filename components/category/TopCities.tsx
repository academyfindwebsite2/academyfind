import Link from "next/link";
import CityCard from "./CityCard";

interface City {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  category: string;
  cities: City[];
}

export default function TopCities({
  category,
  cities,
}: Props) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold">
          Popular Cities
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {cities.map((city) => (
            <CityCard cityName={city.name} citySlug={city.slug} categorySlug={category} key={city.id}/>
            
          ))}
        </div>
      </div>
    </section>
  );
}