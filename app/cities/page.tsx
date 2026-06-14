import { prisma } from "@/lib/prisma";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import Link from "next/link";

export const revalidateCache = 86400

export const metadata = {
  title: "Explore Coaching Institutes by City | AcademyFind",
  description: "Find and compare the best coaching institutes, tuition centers, and learning hubs across top cities in India.",
};

export default async function CititesPage(){
    const cities = await prisma.city.findMany({
        include:{
            _count:{
                select:{
                    institutes:{
                        where:{
                            isActive: true
                        }
                    }
                }
            }
        },
        orderBy:{state: "asc"}
    })

    const activeCities = cities.filter((city: any) => city._count.institutes > 0)

    const groupByState: Record<string, typeof activeCities> = {};

    activeCities.forEach((city: any) => {
        const stateName = city.state || "Other Regions"
        if(!groupByState[stateName]){
            groupByState[stateName] = [];
        }
        groupByState[stateName].push(city)
    })

    const sortedStates = Object.keys(groupByState).sort();

    return(
        <div className="min-h-screen bg-slate-50/40 font-sans pb-16">
      {/* Hero Header Section */}
      <header className="bg-gradient-to-b from-amber-50 via-background to-transparent py-16 text-center px-4 border-b border-slate-100">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-1.5 text-xs font-bold text-amber-600 shadow-xs uppercase tracking-wider backdrop-blur-xs">
          <MapPin className="h-3.5 w-3.5 animate-bounce" /> Pan-India Coverage
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-6 tracking-tight">
          Explore Institutes by <span className="text-amber-400">City</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-slate-500 text-sm md:text-base leading-relaxed">
          Select your city to discover top-rated coaching centers, school tuitions, exam prep hubs, and skill development classes near you.
        </p>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 mt-12 max-w-6xl">
        {activeCities.length === 0 ? (
          <div className="text-center bg-white border border-slate-200 rounded-3xl p-12 shadow-xs">
            <p className="text-muted-foreground font-medium">No active cities found with institutes yet.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {sortedStates.map((state: any) => (
              <div key={state} className="space-y-4">
                {/* State Heading Badge */}
                <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2">
                  <h2 className="text-lg font-bold text-slate-800 tracking-tight uppercase text-xs tracking-widest bg-slate-200/60 text-slate-600 px-3 py-1 rounded-md">
                    {state}
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">
                    ({groupByState[state].length} {groupByState[state].length === 1 ? 'City' : 'Cities'})
                  </span>
                </div>

                {/* Cities Grid (Masonry flex flow with items-start behavior) */}
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-start bg-linear-to-b from-amber-50 via-background">
                  {groupByState[state]
                    .sort((a:any, b:any) => (a.name || a.slug || "").localeCompare(b.name || b.slug || ""))
                    .map((city: any) => (
                      <Link
                        key={city.id}
                        href={`/categories?city=${(city.slug)}`} // Ya fir aapka dynamic city route jo bhi ho
                        className="group border border-amber-100 rounded-2xl p-4 flex items-center justify-between shadow-xs transition-all duration-200 hover:border-amber-200 hover:shadow-md hover:-translate-y-0.5 bg-white"
                      >
                        <div className="space-y-1 ">
                          <p className="font-semibold text-slate-700 group-hover:text-amber-500 transition-colors text-sm sm:text-base">
                            {city.name || city.slug || "wtf"}
                          </p>
                          <div className="flex items-center gap-1 text-slate-400 text-xs">
                            <Building2 className="w-3.5 h-3.5 shrink-0" />
                            <span>{city._count.institutes} Listed</span>
                          </div>
                        </div>
                        
                        <div className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-amber-50 group-hover:text-amber-500 transition-colors shrink-0">
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
    )
}