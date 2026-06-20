import { meili } from '@/lib/meilisearch';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  if (q.trim().length < 2) {
    return NextResponse.json({ hits: [] });
  }

  const index = meili.index('global_search');

  const results = await index.search(q, {
    filter: 'type = institute',
    limit: 6,
    attributesToRetrieve: [
      'id',
      'name',
      'city',
      'citySlug',
      'slug',
      'logo',
      'averageRating',
      'googleRating',
      'categoryNames',
    ],
  });

  return NextResponse.json({ hits: results.hits });
}