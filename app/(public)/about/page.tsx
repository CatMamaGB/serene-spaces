import Footer from "../../../components/Footer";
import AboutContent from "../../../components/AboutContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Serene Spaces - Professional Horse Equipment Care",
  description:
    "Learn about Serene Spaces, your trusted partner for professional horse blanket cleaning, repairs, and waterproofing in Crystal Lake, IL. Dedicated to preserving your horse's essential equipment.",
  alternates: {
    canonical: "/about",
  },
  keywords: [
    "about serene spaces",
    "horse blanket cleaning Crystal Lake",
    "McHenry County horse services",
    "horse equipment care",
    "professional blanket cleaning",
    "barn organization",
  ],
  openGraph: {
    title: "About Serene Spaces - Professional Horse Equipment Care",
    description:
      "Learn about Serene Spaces, your trusted partner for professional horse blanket cleaning, repairs, and waterproofing in Crystal Lake, IL.",
    url: "https://loveserenespaces.com/about",
  },
  twitter: {
    title: "About Serene Spaces - Professional Horse Equipment Care",
    description:
      "Learn about Serene Spaces, your trusted partner for professional horse blanket cleaning, repairs, and waterproofing in Crystal Lake, IL.",
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutContent isMobile={false} />
      <Footer />
    </>
  );
}
