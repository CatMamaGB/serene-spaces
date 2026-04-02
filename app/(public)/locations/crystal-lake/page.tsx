import Footer from "../../../../components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Horse Blanket Cleaning Crystal Lake IL | Serene Spaces",
  description:
    "Professional horse blanket cleaning, waterproofing, and repair services in Crystal Lake with free pickup and delivery.",
  alternates: {
    canonical: "/locations/crystal-lake",
  },
  openGraph: {
    title: "Horse Blanket Cleaning Crystal Lake IL | Serene Spaces",
    description:
      "Professional horse blanket cleaning, waterproofing, and repair services in Crystal Lake with free pickup and delivery.",
    url: "/locations/crystal-lake",
  },
};

export default function CrystalLakeLocationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-gray-800 via-primary-dark to-primary text-white padding-responsive">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-responsive-xl font-bold mb-4 sm:mb-6 tracking-tight">
              Horse Blanket Cleaning in Crystal Lake
            </h1>
            <p className="text-sm sm:text-base lg:text-lg opacity-90 leading-relaxed">
              Professional cleaning, waterproofing, and repairs for riders and barns
              in Crystal Lake and the surrounding McHenry County area—with convenient
              pickup and delivery.
            </p>
          </div>
        </div>
      </section>

      <section className="padding-responsive bg-white">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto space-y-8 text-gray-700 text-sm sm:text-base leading-relaxed">
            <p>
              Crystal Lake is home to a tight-knit equestrian community, from private
              barns to busy boarding facilities. Serene Spaces exists to take blanket
              and equipment care off your plate: we pick up dirty turnout, sheets,
              and pads, clean them thoroughly, repair what&apos;s torn or worn, and
              refresh waterproofing so your horse stays dry when the weather turns.
            </p>
            <p>
              As a McHenry County–based service, we&apos;re built around the same
              roads and seasons you ride in. That means realistic scheduling, clear
              expectations around turnaround, and a focus on workmanship you can
              trust when you clip your horse in for the night.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Local pickup built for busy barns
            </h2>
            <p>
              Hauling heavy wet blankets to a generic cleaner isn&apos;t practical—and
              household machines often aren&apos;t sized or programmed for heavy
              turnout. We use processes suited to horse gear: proper detergents,
              careful drying, and inspection for weak seams or hardware before items
              go back on your rack. If you need repairs or re-waterproofing, we note
              it up front so there are no surprises.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Free Pickup and Delivery in Crystal Lake
            </h2>
            <p className="mb-4">
              Services available with free pickup within our service radius include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-8">
              <li>Blanket cleaning</li>
              <li>Waterproofing</li>
              <li>Repairs</li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                href="/contact"
                className="btn-primary text-center px-8 py-3 text-sm sm:text-base"
              >
                Contact us
              </Link>
              <Link
                href="/pricing"
                className="btn-secondary text-center px-8 py-3 text-sm sm:text-base border border-primary text-primary"
              >
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
