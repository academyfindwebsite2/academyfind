import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({
  items,
}: BreadcrumbProps) {
  return (
    <nav className="mb-6 text-sm text-gray-500">
      <ol className="flex flex-wrap items-center gap-2">

        <li>
          <Link href="/">Home</Link>
        </li>

        {items.map((item) => (
          <li
            key={item.href}
            className="flex items-center gap-2"
          >
            <span>/</span>

            <Link href={item.href}>
              {item.label}
            </Link>
          </li>
        ))}

      </ol>
    </nav>
  );
}