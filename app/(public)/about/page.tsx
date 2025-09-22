"use client";

import { useState, useEffect } from "react";
import Footer from "../../../components/Footer";

export default function AboutPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-800 via-primary-dark to-primary text-white padding-responsive">
        <div className="container-responsive">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-responsive-xl font-bold mb-4 sm:mb-6 tracking-tight">
              About Serene Spaces
            </h1>
            <p className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 lg:mb-10 opacity-90 leading-relaxed">
              Dedicated to preserving and protecting your horse&apos;s most
              essential equipment
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="padding-responsive bg-white">
        <div className="container-responsive">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
              <div className={isMobile ? "order-2" : ""}>
                <h2 className="text-responsive-lg font-bold mb-6 sm:mb-8 text-gray-900 text-center lg:text-left">
                  Our Story
                </h2>
                <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                    Serene Spaces was born from a deep love for horses and a
                    recognition that quality equestrian equipment deserves
                    professional care. What started as a small operation serving
                    local barns in Crystal Lake has grown into a trusted service
                    provider throughout the greater Chicago area.
                  </p>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                    We understand that your horse&apos;s blankets, sheets, and
                    equipment are investments that protect your equine partner
                    from the elements. That&apos;s why we treat every piece with
                    the same care and attention we&apos;d give our own
                    horses&apos; gear.
                  </p>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                    Our commitment to excellence has earned us the trust of
                    horse owners, trainers, and barn managers who rely on us to
                    maintain their valuable equipment in peak condition.
                  </p>
                </div>
              </div>
              <div className={`card ${isMobile ? "order-1" : ""}`}>
                <h3 className="text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 text-primary font-semibold text-center">
                  🐎 Why We Do What We Do
                </h3>
                <ul className="text-gray-600 leading-relaxed space-y-2 sm:space-y-3 text-sm sm:text-base">
                  <li>• Protect your investment in quality equipment</li>
                  <li>• Ensure your horse&apos;s comfort and safety</li>
                  <li>• Extend the lifespan of valuable gear</li>
                  <li>• Support the equestrian community</li>
                  <li>• Provide reliable, professional service</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="padding-responsive bg-white">
        <div className="container-responsive">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-responsive-lg font-bold mb-6 sm:mb-8 text-gray-900">
              Ready to Experience the Difference?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-8 sm:mb-10 lg:mb-12 leading-relaxed">
              Join the many horse owners who trust Serene Spaces with their
              valuable equipment. Contact us today to schedule your first
              service.
            </p>
            <div className="flex justify-center">
              <a
                href="/contact"
                className="btn-primary w-full sm:w-auto text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5"
              >
                Get Started Today
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
