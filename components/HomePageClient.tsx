import Link from "next/link";
import Footer from "./Footer";
import { homeFaqItems } from "./home-faq-data";

export default function HomePageClient() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-gray-800 via-primary-dark to-primary text-white padding-responsive">
        <div className="container-responsive">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-responsive-xl font-bold mb-4 sm:mb-6 tracking-tight">
              Serene Spaces
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 lg:mb-10 opacity-90">
              Professional Horse Blanket & Equipment Care
            </p>
            <p className="text-sm sm:text-base lg:text-lg mb-8 sm:mb-10 lg:mb-12 opacity-80 leading-relaxed max-w-3xl mx-auto">
              We&apos;ll clean and repair your horse&apos;s essentials — quickly
              and reliably. From blankets to boots, Serene Spaces makes it easy
              with local pick-up & delivery.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center items-center">
              <Link
                href="/pricing"
                className="btn-primary text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 shadow-lg hover-lift inline-block text-center"
              >
                View Pricing
              </Link>
              <Link
                href="/contact"
                className="btn-secondary text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 inline-block text-center border border-white/40"
              >
                Schedule Pickup
              </Link>
            </div>
            <p className="mt-6 text-sm opacity-85">
              Prefer the online form?{" "}
              <Link href="/intake" className="underline font-medium hover:opacity-100">
                Book pickup online
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="padding-responsive bg-white">
        <div className="container-responsive">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-responsive-lg font-bold text-center mb-12 sm:mb-16 lg:mb-20 text-gray-900">
              Our Services
            </h2>
            <div className="grid-responsive">
              <div className="card text-center hover-lift">
                <h3 className="text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 text-primary font-semibold">
                  🧼 Professional Cleaning
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Deep cleaning for all fabric types with eco-friendly solutions
                </p>
              </div>
              <div className="card text-center hover-lift">
                <h3 className="text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 text-primary font-semibold">
                  🔧 Expert Repairs
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Rip repairs, strap replacement, and other repairs as needed
                </p>
              </div>
              <div className="card text-center hover-lift">
                <h3 className="text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 text-primary font-semibold">
                  🌧️ Waterproofing
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Professional waterproofing treatment
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="padding-responsive bg-gray-50 border-y border-gray-200">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-responsive-lg font-bold text-center mb-4 sm:mb-6 text-gray-900">
              Service Area
            </h2>
            <div className="card text-left text-gray-700 text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                We offer free pickup and delivery within 25 miles of Crystal Lake,
                including Cary, McHenry, Lake in the Hills, Algonquin, Woodstock,
                Huntley, Barrington, and Lake Zurich.
              </p>
              <p>
                We also serve the greater Northwest suburbs of Chicago for a small
                travel fee. Contact us to confirm availability in your area.
              </p>
              <p>
                <Link href="/service-area" className="text-primary font-semibold hover:underline">
                  View full service area details
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="padding-responsive bg-white">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-responsive-lg font-bold text-center mb-8 sm:mb-10 text-gray-900">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {homeFaqItems.map((item) => (
                <details
                  key={item.question}
                  className="group bg-gray-50 rounded-xl border border-gray-200 shadow-sm open:shadow-md transition-shadow"
                >
                  <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-gray-900 flex justify-between items-center gap-4 text-sm sm:text-base">
                    <span>{item.question}</span>
                    <span className="text-primary shrink-0 text-xl leading-none group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="px-5 pb-4 pt-0 text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-100">
                    <p className="pt-4">{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="padding-responsive bg-primary text-white text-center">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-responsive-lg font-bold mb-4 sm:mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 lg:mb-10 text-gray-100 leading-relaxed">
              Contact us today to schedule your pickup and give your horse
              equipment the care it deserves.
            </p>
            <div className="flex-responsive justify-center">
              <Link
                href="/intake"
                className="btn-secondary text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5"
              >
                Schedule Service
              </Link>
              <Link
                href="/contact"
                className="btn-secondary text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
