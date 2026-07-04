export default function AFManageLayout({
  children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="min-h-dvh bg-gradient-to-br from-amber-50 via-white to-orange-50 ">
            {children}
        </main>
    );
}