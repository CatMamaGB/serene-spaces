import ContactForm from "../../../components/ContactForm";
import Footer from "../../../components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Serene Spaces - Professional Horse Equipment Care",
  description:
    "Contact Serene Spaces for professional horse blanket cleaning, repairs, and waterproofing services in Crystal Lake, IL. Get in touch for pickup and delivery scheduling.",
  keywords: [
    "contact serene spaces",
    "horse equipment service contact",
    "Crystal Lake horse services",
    "schedule pickup",
    "horse blanket cleaning contact",
    "equipment repair service",
  ],
  openGraph: {
    title: "Contact Serene Spaces - Professional Horse Equipment Care",
    description:
      "Contact Serene Spaces for professional horse blanket cleaning, repairs, and waterproofing services in Crystal Lake, IL.",
    url: "https://loveserenespaces.com/contact",
  },
  twitter: {
    title: "Contact Serene Spaces - Professional Horse Equipment Care",
    description:
      "Contact Serene Spaces for professional horse blanket cleaning, repairs, and waterproofing services in Crystal Lake, IL.",
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
