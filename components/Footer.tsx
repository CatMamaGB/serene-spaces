"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white relative border-t border-white/10">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/8 via-transparent to-transparent pointer-events-none" />

      <div className="container-responsive relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 mb-12 sm:mb-16 text-center md:text-left">
          {/* Company Info */}
          <div className="min-w-0">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Serene Spaces
            </div>
            <p className="text-white/85 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base lg:text-lg max-w-md mx-auto md:mx-0">
              Professional horse blanket cleaning, repairs, and waterproofing
              services. Serving the equestrian community with expertise and care
              over 10 years.
            </p>

            {/* Social Media Section */}
            <div>
              <h4 className="text-sm sm:text-base lg:text-lg mb-4 font-semibold text-white/90 uppercase tracking-wider">
                Follow Us
              </h4>
              <div className="flex gap-4 justify-center md:justify-start flex-wrap">
                <a
                  href="https://instagram.com/loveserenespaces"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-white/8 border border-white/15 flex items-center justify-center text-xl transition-all duration-300 hover:text-pink-500 hover:bg-pink-500/15 hover:border-pink-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/30"
                  title="Follow us on Instagram @loveserenespaces"
                >
                  📷
                </a>
                <a
                  href="https://facebook.com/loveserenespaces"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-white/8 border border-white/15 flex items-center justify-center text-xl transition-all duration-300 hover:text-blue-500 hover:bg-blue-500/15 hover:border-blue-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30"
                  title="Follow us on Facebook"
                >
                  📘
                </a>
                <a
                  href="mailto:loveserenespaces@gmail.com"
                  className="w-12 h-12 rounded-xl bg-white/8 border border-white/15 flex items-center justify-center text-xl transition-all duration-300 hover:text-red-500 hover:bg-red-500/15 hover:border-red-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/30"
                  title="Email us at loveserenespaces@gmail.com"
                >
                  ✉️
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="min-w-0">
            <h4 className="text-base sm:text-lg lg:text-xl mb-6 font-semibold text-white/95 uppercase tracking-wider">
              Quick Links
            </h4>
            <div className="flex flex-col gap-4">
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
                  className="text-white/70 hover:text-white/95 transition-all duration-300 text-sm sm:text-base font-medium py-1.5 hover:translate-x-1.5"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="min-w-0">
            <h4 className="text-base sm:text-lg lg:text-xl mb-6 font-semibold text-white/95 uppercase tracking-wider">
              Contact
            </h4>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3.5 justify-center md:justify-start">
                <div className="w-10 h-10 rounded-lg bg-white/8 flex items-center justify-center text-lg flex-shrink-0">
                  📧
                </div>
                <a
                  href="mailto:loveserenespaces@gmail.com"
                  className="text-white/70 hover:text-white/95 transition-colors duration-300 text-sm sm:text-base font-medium break-all"
                >
                  loveserenespaces@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3.5 justify-center md:justify-start">
                <div className="w-10 h-10 rounded-lg bg-white/8 flex items-center justify-center text-lg flex-shrink-0">
                  📞
                </div>
                <a
                  href="tel:+18156213509"
                  className="text-white/70 hover:text-white/95 transition-colors duration-300 text-sm sm:text-base font-medium"
                >
                  (815) 621-3509
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8 sm:pt-10 text-center">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-5">
            <div className="flex flex-col gap-2 items-center sm:items-start">
              <p className="text-sm sm:text-base text-white/85 font-medium">
                © 2025 Serene Spaces. All rights reserved.
              </p>
              <p className="text-xs sm:text-sm text-white/60">
                Professional horse equipment care services
              </p>
            </div>

            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/60 flex-wrap justify-center">
              <span>Made with ❤️ by</span>
              <a
                href="https://codeandcosmos.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white/90 transition-colors duration-300 font-semibold"
              >
                Code & Cosmos
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
