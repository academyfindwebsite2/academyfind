import Link from "next/link";
import {
  Bell,
  CircleHelp,
  LockKeyhole,
  Shield,
  UserRound,
  ArrowLeft,
} from "lucide-react";

const links = [
  { href: "/settings/profile", label: "Profile", icon: UserRound },
  { href: "/settings/account", label: "Account & social", icon: UserRound },
  { href: "/settings/privacy", label: "Privacy & visibility", icon: Shield },
  { href: "/settings/notifications", label: "Notifications", icon: Bell },
  { href: "/settings/security", label: "Security", icon: LockKeyhole },
  { href: "/contact", label: "Help", icon: CircleHelp },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="md:sticky md:top-24 md:self-start">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
        <h1 className="mb-4 text-2xl font-bold text-slate-950">Settings</h1>
        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          {links.map(({ href: href, label: label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex whitespace-nowrap items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-amber-50 hover:text-amber-800"
            >
              <Icon className="size-4" /> {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </main>
  );
}
