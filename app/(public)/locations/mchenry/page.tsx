import Footer from "../../../../components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Horse Blanket Cleaning McHenry IL | Serene Spaces",
  description:
    "Professional horse blanket cleaning, waterproofing, and repairs in McHenry, IL with free pickup and delivery.",
  alternates: {
    canonical: "/locations/mchenry",
  },
  openGraph: {
    title: "Horse Blanket Cleaning McHenry IL | Serene Spaces",
    description:
      "Professional horse blanket cleaning, waterproofing, and repairs in McHenry, IL with free pickup and delivery.",
    url: "https://loveserenespaces.com/locations/mchenry",
  },
};

export default function McHenryLocationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-gray-800 via-primary-dark to-primary text-white padding-responsive">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-responsive-xl font-bold mb-4 sm:mb-6 tracking-tight">
              Horse Blanket Cleaning in McHenry
            </h1>
            <p className="text-sm sm:text-base lg:text-lg opacity-90 leading-relaxed">
              Professional cleaning, waterproofing, and repairs for riders and barns
              in McHenry—with convenient pickup and delivery from Serene Spaces.
            </p>
          </div>
        </div>
      </section>

      <section className="padding-responsive bg-white">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto space-y-8 text-gray-700 text-sm sm:text-base leading-relaxed">
            <p>
              McHenry County has a long tradition of horse ownership—from trail riders
              and lesson barns to competitive athletes and backyard companions.
              Serene Spaces supports that community with blanket cleaning and repair
              services that respect your time and your tack budget. We pick up
              directly from your barn or home when you&apos;re in our free service
              radius, so you don&apos;t lose a day to errands.
            </p>
            <p>
              Whether you&apos;re managing a single horse or a full string of
              turnouts, we scale with your needs. Tell us about allergies, special
              detergents, or repair priorities on the intake form, and we&apos;ll
              align our process with what your horse needs to stay comfortable and
              healthy.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Repairs and waterproofing that hold up
            </h2>
            <p>
              A good blanket is only as reliable as its seams and coating. We address
              rips, broken buckles, and strap replacements where possible, and we
              offer waterproofing treatments to restore water repellency after
              repeated washing and UV exposure. That combination helps you get more
              seasons out of the gear you already own—instead of buying new every
              year.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Free Pickup and Delivery in McHenry
            </h2>
            <p className="mb-4">
              Core services:
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
