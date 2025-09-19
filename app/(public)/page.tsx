"use client";

import Footer from "../../components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
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
            <a
              href="/intake"
              className="btn-primary text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 shadow-lg hover-lift"
            >
              🐎 Schedule Pickup & Service
            </a>
          </div>
        </div>
      </section>

      {/* Services Overview */}
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

      {/* CTA Section */}
      <section className="padding-responsive bg-primary text-white text-center">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-responsive-lg font-bold mb-4 sm:mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 lg:mb-10 opacity-90 leading-relaxed">
              Contact us today to schedule your pickup and give your horse
              equipment the care it deserves.
            </p>
            <div className="flex-responsive justify-center">
              <a
                href="/intake"
                className="btn-secondary text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5"
              >
                Schedule Service
              </a>
              <a
                href="/contact"
                className="btn-secondary text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
