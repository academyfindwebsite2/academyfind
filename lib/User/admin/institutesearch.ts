// app/actions/search.ts
"use server"

// Aapki private server file jahan meili instance bana hua hai
import { meili } from "@/lib/meilisearch"; 

export async function searchInstitutesAction(query: string) {
    if (!query || query.length < 2) return [];

    try {
        const result = await meili.index("global_search").search(query, {
            limit: 10,
            filter: ['type = "institute"'],
        });

        return result.hits.map((hit: any) => ({
            id: hit.id,
            name: hit.name,
            city: hit.citySlug || hit.city || "", 
        }));
    } catch (error) {
        console.error("Server Search Error:", error);
        return [];
    }
}