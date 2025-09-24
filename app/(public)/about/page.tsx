import Footer from "../../../components/Footer";
import AboutContent from "../../../components/AboutContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Serene Spaces - Professional Horse Equipment Care",
  description:
    "Learn about Serene Spaces, your trusted partner for professional horse blanket cleaning, repairs, and waterproofing in Crystal Lake, IL. Dedicated to preserving your horse's essential equipment.",
  keywords: [
    "about serene spaces",
    "horse equipment care company",
    "professional horse services",
    "Crystal Lake horse care",
    "equipment preservation",
    "horse blanket specialists",
    "Crystal Lake horse services",
    "professional horse care",
    "equipment maintenance",
    "horse equipment care",
    "barn organization",
    "barn organization services",
    "barn organization company",
    "barn organization services company",
    "Barrington horse services",
    "Barrington horse care",
    "Barrington horse equipment care",
    "Barrington horse equipment care company",
    "Barrington horse equipment care services",
    "Barrington horse equipment care services company",
    "Barrington horse blanket cleaning",
    "Barrington horse equipment repair",
    "Barrington horse equipment waterproofing",
    "Barrington horse equipment maintenance",
    "Barrington horse equipment care",
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
