import Navigation from "../../components/Navigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main id="main-content" className="min-w-0">
        {children}
      </main>
    </div>
  );
}
