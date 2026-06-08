import { meili } from "@/lib/meilisearch";

async function main() {
  const index = meili.index("global_search");

  console.log("Configuring global_search index...");

  const searchableTask = await index.updateSearchableAttributes([
    "name",
    "address",
    "city",
    "description",
    "categoryNames",
    "state",
  ]);

  const filterableTask = await index.updateFilterableAttributes([
    "type",
    "citySlug",
    "categorySlugs",
    "_geo",
    "googleRating"
  ]);

  const sortableTask = await index.updateSortableAttributes([
    "name",
    "_geo",
    "googleRating",
    "googleReviewCount"
  ]);

  const typoTask = await index.updateTypoTolerance({
    enabled: true,
  });

  const rankingTask = await index.updateRankingRules([
    "words",
    "typo",
    "proximity",
    "attribute",
    "sort",
    "exactness",
  ]);

  await Promise.all([
    meili.tasks.waitForTask(searchableTask.taskUid),
    meili.tasks.waitForTask(filterableTask.taskUid),
    meili.tasks.waitForTask(sortableTask.taskUid),
    meili.tasks.waitForTask(typoTask.taskUid),
    meili.tasks.waitForTask(rankingTask.taskUid),
  ]);

  console.log("✅ global_search configured successfully");
}

main().catch(console.error);