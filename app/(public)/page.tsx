import type { Metadata } from "next";
import FAQStructuredData from "../../components/FAQStructuredData";
import HomePageClient from "../../components/HomePageClient";
import { homeFaqItems } from "../../components/home-faq-data";

export const metadata: Metadata = {
  title: {
    absolute:
      "Horse Blanket Cleaning & Repair | Crystal Lake IL | Serene Spaces",
  },
  description:
    "Horse blanket cleaning, waterproofing, and repairs with free pickup in Crystal Lake, Cary, McHenry, and nearby areas.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <FAQStructuredData items={homeFaqItems} />
      <HomePageClient />
    </>
  );
}
