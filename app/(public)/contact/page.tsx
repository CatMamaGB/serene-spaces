import ContactForm from "../../../components/ContactForm";
import Footer from "../../../components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Serene Spaces | Questions and Special Requests",
  description:
    "Contact Serene Spaces with questions about service areas, custom requests, or anything else before booking your pickup.",
  alternates: {
    canonical: "/contact",
  },
  keywords: [
    "contact serene spaces",
    "horse equipment service contact",
    "Crystal Lake horse services",
    "horse blanket questions",
    "horse blanket cleaning contact",
    "special service requests",
  ],
  openGraph: {
    title: "Contact Serene Spaces | Questions and Special Requests",
    description:
      "Contact Serene Spaces with questions about service areas, custom requests, or anything else before booking your pickup.",
    url: "/contact",
  },
  twitter: {
    title: "Contact Serene Spaces | Questions and Special Requests",
    description:
      "Contact Serene Spaces with questions about service areas, custom requests, or anything else before booking your pickup.",
  },
};

export default function ContactPage() {
  return (
    <>
      <ContactForm />
      <Footer />
    </>
  );
}
