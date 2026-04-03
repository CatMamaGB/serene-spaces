import Link from "next/link";
import type { Metadata } from "next";
import Footer from "../../../components/Footer";

export const metadata: Metadata = {
  title: "Thank You | Serene Spaces",
  description:
    "Your message or service request was received. Serene Spaces will be in touch soon.",
  robots: {
    index: false,
    follow: true,
  },
};

type ThankYouProps = {
  searchParams: Promise<{ type?: string }>;
};

export default async function ThankYouPage({ searchParams }: ThankYouProps) {
  const params = await searchParams;
  const rawType = params.type?.toLowerCase();
  const leadType =
    rawType === "contact" || rawType === "intake" ? rawType : null;

  const copy =
    leadType === "contact"
      ? {
          heading: "Message sent!",
          body:
            "Thank you for reaching out. We've received your message and will get back to you within 24 hours.",
        }
      : leadType === "intake"
        ? {
            heading: "Thank you!",
            body:
              "Your service request was submitted successfully. We'll contact you within 24 hours to confirm pickup details and discuss your needs.",
          }
        : {
            heading: "Thanks for visiting",
            body:
              "If you just submitted a contact or service request, you're all set—we've received it and will follow up soon.",
          };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="bg-white p-6 sm:p-8 lg:p-12 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="text-4xl sm:text-5xl mb-4 sm:mb-6" aria-hidden>
            ✓
          </div>
          <h1 className="text-primary text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
            {copy.heading}
          </h1>
          <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
            {copy.body}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="btn-primary w-full sm:w-auto inline-block text-center"
            >
              Return to home
            </Link>
            <Link
              href="/contact"
              className="inline-block w-full sm:w-auto text-center rounded-lg border-2 border-primary text-primary font-semibold px-6 py-3 hover:bg-primary/5 transition-colors"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
