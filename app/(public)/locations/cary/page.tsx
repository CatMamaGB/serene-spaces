import Footer from "../../../../components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Horse Blanket Cleaning Cary IL | Serene Spaces",
  description:
    "Professional horse blanket cleaning, waterproofing, and repairs in Cary, IL with free pickup and delivery from Serene Spaces.",
  alternates: {
    canonical: "/locations/cary",
  },
  openGraph: {
    title: "Horse Blanket Cleaning Cary IL | Serene Spaces",
    description:
      "Professional horse blanket cleaning, waterproofing, and repairs in Cary, IL with free pickup and delivery from Serene Spaces.",
    url: "https://loveserenespaces.com/locations/cary",
  },
};

export default function CaryLocationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-gray-800 via-primary-dark to-primary text-white padding-responsive">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-responsive-xl font-bold mb-4 sm:mb-6 tracking-tight">
              Horse Blanket Cleaning in Cary
            </h1>
            <p className="text-sm sm:text-base lg:text-lg opacity-90 leading-relaxed">
              Professional cleaning, waterproofing, and repairs for riders and barns
              in Cary—with convenient pickup and delivery across our McHenry County
              service area.
            </p>
          </div>
        </div>
      </section>

      <section className="padding-responsive bg-white">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto space-y-8 text-gray-700 text-sm sm:text-base leading-relaxed">
            <p>
              Cary horse owners balance work, family, and barn time like everyone
              else—and blanket laundry is often the chore that slips. Serene Spaces
              offers a straightforward alternative: schedule pickup, and we&apos;ll
              return clean, repaired, and re-waterproofed gear on a timeline you can
              plan around. No wrestling damp blankets into a car or guessing whether
              a home washer can handle the load.
            </p>
            <p>
              We work with riders who keep one horse at home and with clients who
              rotate through multiple blankets across the seasons. Every piece gets
              inspected for damage, strap wear, and coating breakdown so small issues
              don&apos;t turn into mid-winter leaks or torn hardware.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Seasonal care for Illinois weather
            </h2>
            <p>
              From muddy spring paddocks to freezing winter turnout, Cary riders see
              the full range of Midwest conditions. Our cleaning and waterproofing
              services are designed to help you swap weights at the right time—heavy
              fill for cold snaps, sheets for mud season, and repairs when zippers,
              surcingles, or shoulder gussets fail.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Free Pickup and Delivery in Cary
            </h2>
            <p className="mb-4">
              Included services with pickup in your area:
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
