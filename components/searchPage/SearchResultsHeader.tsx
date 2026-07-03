interface Props {
  query?: string;
  type?: string;
  city?: string;
  category?: string;
  rating?: string;
}

export default function SearchResultsHeader({ query, type, city, category, rating }: Props) {
  // 🔥 Helper function to format slugs (e.g., "jee-coaching" -> "JEE Coaching")
  const formatLabel = (str?: string) => {
    if (!str || str === "ALL") return null;
    return str
      .split("-")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formattedCity = formatLabel(city);
  const formattedCategory = formatLabel(category);

  // 🔥 Determine Base Type
  let typeLabel = "All Results";
  if (type === "institute") typeLabel = "Institutes";
  else if (type === "job") typeLabel = "Careers & Jobs";
  else if (type === "blog") typeLabel = "Guides & Resources";

  return (
    <div className="flex flex-col gap-3 border-b border-slate-200/60 pb-6">
      <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
        {typeLabel}
      </h2>

      {/* 🚀 Dynamic Natural Language Sentence */}
      <div className="flex flex-wrap items-center gap-1.5 text-sm md:text-base text-slate-500 font-medium leading-relaxed">
        <span>Showing {typeLabel.toLowerCase()}</span>

        {query && (
          <>
            <span>matching</span>
            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-bold">
              "{query}"
            </span>
          </>
        )}

        {formattedCategory && (
          <>
            <span>for</span>
            <span className="text-slate-800 font-bold underline decoration-amber-300 decoration-2 underline-offset-4">
              {formattedCategory}
            </span>
          </>
        )}

        {formattedCity && (
          <>
            <span>in</span>
            <span className="text-slate-800 font-bold underline decoration-amber-300 decoration-2 underline-offset-4">
              {formattedCity}
            </span>
          </>
        )}

        {rating && rating !== "ALL" && (
          <>
            <span>with</span>
            <span className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold border border-slate-200">
              <span className="text-amber-500">★</span> {rating}+ Stars
            </span>
          </>
        )}
      </div>
    </div>
  );
}