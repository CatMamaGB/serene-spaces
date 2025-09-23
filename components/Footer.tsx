"use client";

import Link from "next/link";
import { FaInstagram, FaFacebook, FaEnvelope, FaHeart } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white relative border-t border-white/10">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/8 via-transparent to-transparent pointer-events-none" />

      <div className="container-responsive relative z-10 py-8 sm:py-12 md:py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-16 mb-10 sm:mb-14 md:mb-16 lg:mb-20 text-center sm:text-left">
          {/* Company Info - Full width on mobile, then grid positioning */}
          <div className="sm:col-span-2 lg:col-span-1 min-w-0">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Serene Spaces
            </div>
            <p className="text-white/85 mb-6 sm:mb-8 md:mb-10 leading-relaxed text-sm sm:text-base lg:text-lg max-w-md mx-auto sm:mx-0 px-4 sm:px-0">
              Professional horse blanket cleaning, repairs, and waterproofing
              services. Serving the equestrian community with expertise and care
              over 10 years.
            </p>

            {/* Social Media Section */}
            <div>
              <h4 className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 font-semibold text-white/90 uppercase tracking-wider px-4 sm:px-0">
                Follow Us
              </h4>
              <div className="flex gap-3 sm:gap-4 justify-center sm:justify-start flex-wrap px-4 sm:px-0">
                <a
                  href="https://instagram.com/loveserenespaces"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white/8 border border-white/15 flex items-center justify-center text-xl transition-all duration-300 hover:text-pink-500 hover:bg-pink-500/15 hover:border-pink-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/30 active:scale-95"
                  aria-label="Follow us on Instagram @loveserenespaces"
                >
                  <FaInstagram
                    className="w-6 h-6 sm:w-7 sm:h-7"
                    aria-hidden="true"
                  />
                </a>

                <a
                  href="https://www.facebook.com/profile.php?id=61573653646816"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white/8 border border-white/15 flex items-center justify-center text-xl transition-all duration-300 hover:text-blue-500 hover:bg-blue-500/15 hover:border-blue-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
                  aria-label="Follow us on Facebook"
                >
                  <FaFacebook
                    className="w-6 h-6 sm:w-7 sm:h-7"
                    aria-hidden="true"
                  />
                </a>

                <a
                  href="mailto:loveserenespaces@gmail.com"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white/8 border border-white/15 flex items-center justify-center text-xl transition-all duration-300 hover:text-red-500 hover:bg-red-500/15 hover:border-red-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/30 active:scale-95"
                  aria-label="Email us at loveserenespaces@gmail.com"
                >
                  <FaEnvelope
                    className="w-6 h-6 sm:w-7 sm:h-7"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="sm:col-span-1 lg:col-span-1 min-w-0">
            <h4 className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 md:mb-8 font-semibold text-white/95 uppercase tracking-wider px-4 sm:px-0">
              Quick Links
            </h4>
            <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 px-4 sm:px-0">
              {[
                { href: "/", label: "Home" },
                { href: "/pricing", label: "Pricing" },
                { href: "/intake", label: "Schedule Service" },
                { href: "/contact", label: "Contact" },
                { href: "/about", label: "About Us" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/70 hover:text-white/95 transition-all duration-300 text-sm sm:text-base font-medium py-2 sm:py-2.5 hover:translate-x-1.5 hover:pl-2"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="sm:col-span-1 lg:col-span-1 min-w-0">
            <h4 className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 md:mb-8 font-semibold text-white/95 uppercase tracking-wider">
              Contact
            </h4>
            <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
              <div className="flex justify-center sm:justify-start">
                <a
                  href="mailto:loveserenespaces@gmail.com"
                  className="text-white/70 hover:text-white/95 transition-colors duration-300 text-sm sm:text-base font-medium leading-tight break-words"
                >
                  loveserenespaces@gmail.com
                </a>
              </div>
              <div className="flex justify-center sm:justify-start">
                <a
                  href="tel:+18156213509"
                  className="text-white/70 hover:text-white/95 transition-colors duration-300 text-sm sm:text-base font-medium leading-tight"
                >
                  (815) 621-3509
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-6 sm:pt-8 md:pt-10 text-center">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col gap-2 sm:gap-3 items-center">
              <p className="text-xs sm:text-sm md:text-base text-white/85 font-medium">
                © {new Date().getFullYear()} Serene Spaces. All rights
                reserved.
              </p>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                Professional horse equipment care services
              </p>
            </div>

            <p className="text-center text-xs sm:text-sm text-white/60">
              Made with{" "}
              <FaHeart
                className="inline w-4 h-4 align-[-0.15em] text-rose-400"
                aria-hidden="true"
              />{" "}
              by{" "}
              <a
                href="https://codeandcosmos.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white/90 font-semibold"
              >
                Code & Cosmos
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
