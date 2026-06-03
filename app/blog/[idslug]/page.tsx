import BlogArticleHero from "@/components/BlogDetail/BlogArticleHero";
import BlogTableOfContents from "@/components/BlogDetail/BlogTableofContents";
import BlogContent from "@/components/BlogDetail/BlogContent";
import RelatedArticles from "@/components/BlogDetail/RelatedArticles";
import BlogCTA from "@/components/BlogDetail/BlogCTA";

type Props = {
  params: Promise<{
    idslug: string;
  }>;
};

export default async function BlogDetailPage({
  params,
}: Props) {
  const { idslug } = await params;

  return (
    <>
      <BlogArticleHero idslug={idslug}/>

      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-12 lg:grid-cols-[260px_1fr]">
          <BlogTableOfContents />

          <div>
            <BlogContent />

            <RelatedArticles />

            <BlogCTA />
          </div>
        </div>
      </main>
    </>
  );
}