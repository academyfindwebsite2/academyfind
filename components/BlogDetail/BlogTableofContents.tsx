export default function BlogTableOfContents() {
  return (
    <aside className="hidden lg:block">
      <div
        className="
          sticky
          top-24
          rounded-3xl
          border
          border-amber-100
          bg-white
          p-6
          shadow-sm
        "
      >
        <h3 className="font-semibold">
          Table Of Contents
        </h3>

        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
          <li>
            <a href="#introduction">
              Introduction
            </a>
          </li>

          <li>
            <a href="#institutes">
              Top Institutes
            </a>
          </li>

          <li>
            <a href="#fees">
              Fees Comparison
            </a>
          </li>

          <li>
            <a href="#results">
              Results Comparison
            </a>
          </li>

          <li>
            <a href="#verdict">
              Final Verdict
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
}