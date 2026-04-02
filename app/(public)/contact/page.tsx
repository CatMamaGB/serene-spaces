import ContactForm from "../../../components/ContactForm";
import Footer from "../../../components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Serene Spaces | Schedule Pickup",
  description:
    "Schedule horse blanket cleaning, repairs, and pickup in Crystal Lake, Cary, McHenry, and nearby areas.",
  alternates: {
    canonical: "/contact",
  },
  keywords: [
    "contact serene spaces",
    "horse equipment service contact",
    "Crystal Lake horse services",
    "schedule pickup",
    "horse blanket cleaning contact",
    "equipment repair service",
  ],
  openGraph: {
    title: "Contact Serene Spaces | Schedule Pickup",
    description:
      "Schedule horse blanket cleaning, repairs, and pickup in Crystal Lake, Cary, McHenry, and nearby areas.",
    url: "/contact",
  },
  twitter: {
    title: "Contact Serene Spaces | Schedule Pickup",
    description:
      "Schedule horse blanket cleaning, repairs, and pickup in Crystal Lake, Cary, McHenry, and nearby areas.",
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
