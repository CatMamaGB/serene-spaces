import Footer from "../../../../components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Horse Blanket Cleaning Algonquin IL | Serene Spaces",
  description:
    "Professional horse blanket cleaning, waterproofing, and repairs in Algonquin, IL with free pickup and delivery from Serene Spaces.",
  alternates: {
    canonical: "/locations/algonquin",
  },
  openGraph: {
    title: "Horse Blanket Cleaning Algonquin IL | Serene Spaces",
    description:
      "Professional horse blanket cleaning, waterproofing, and repairs in Algonquin, IL with free pickup and delivery from Serene Spaces.",
    url: "/locations/algonquin",
  },
};

export default function AlgonquinLocationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-gray-800 via-primary-dark to-primary text-white padding-responsive">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-responsive-xl font-bold mb-4 sm:mb-6 tracking-tight">
              Horse Blanket Cleaning in Algonquin
            </h1>
            <p className="text-sm sm:text-base lg:text-lg opacity-90 leading-relaxed">
              Serving Algonquin riders and barns with professional blanket cleaning,
              waterproofing, and repairs—plus free pickup and delivery across our
              McHenry County service area.
            </p>
          </div>
        </div>
      </section>

      <section className="padding-responsive bg-white">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto space-y-8 text-gray-700 text-sm sm:text-base leading-relaxed">
            <p>
              Algonquin sits at the crossroads of busy barn communities and
              neighborhood horse properties. Serene Spaces makes it simple to keep
              turnout blankets, stable sheets, and pads clean without hauling heavy
              laundry yourself. We specialize in the kind of deep cleaning and
              careful repairs that extend the life of your investment—and keep your
              horse comfortable in changing Illinois weather.
            </p>
            <p>
              Whether you ride for pleasure, train young horses, or manage a small
              herd at home, you can schedule pickup and we&apos;ll return your gear
              refreshed, waterproofed when needed, and mended where straps or fabric
              have worn. Our process is built around reliability: clear
              communication, honest timelines, and the same attention we&apos;d give
              our own tack room.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-2">
              Why Algonquin equestrians choose Serene Spaces
            </h2>
            <p>
              Local pickup means less time in the car and more time at the barn. We
              understand how quickly mud, hair, and sweat can build up on winter
              turnouts and spring sheets—and how a failed waterproof layer can ruin
              a good blanket. From routine seasonal washing to strap replacements and
              re-waterproofing before the cold sets in, we handle the full cycle of
              care so you can focus on riding and horse health.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Free Pickup and Delivery in Algonquin
            </h2>
            <p className="mb-4">
              Free pickup applies within 25 miles of Crystal Lake, including Algonquin
              and surrounding towns. Services include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-8">
              <li>Blanket cleaning</li>
              <li>Waterproofing</li>
              <li>Repairs</li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
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
