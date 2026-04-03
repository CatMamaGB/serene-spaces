"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { logger } from "@/lib/logger";

export default function ContactForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    website: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          message: formData.message.trim(),
          website: formData.website,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 429) {
        toast.error(
          "Slow down",
          typeof data?.error === "string"
            ? data.error
            : "Too many messages. Please try again in a few minutes.",
        );
        return;
      }

      if (!res.ok) {
        toast.error(
          "Could not send",
          typeof data?.error === "string"
            ? data.error
            : "Something went wrong. Please try again.",
        );
        return;
      }

      router.push("/thank-you?type=contact");
    } catch (error) {
      logger.errorFrom("Contact form submit", error);
      toast.error(
        "Submission Failed",
        "Failed to send message. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 sm:py-12 lg:py-16">
        <div className="container-responsive">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12 relative">
              {/* Header */}
              <div className="text-center mb-8 sm:mb-12">
                <h1 className="text-primary text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 tracking-tight">
                  Contact Us
                </h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg mx-auto">
                  Have a question or need our services? Send us a message and
                  we&apos;ll get back to you as soon as possible.
                </p>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div className="absolute left-[-9999px] top-0 h-px w-px overflow-hidden opacity-0">
                  <label htmlFor="contact-website-honeypot">
                    Leave this field empty (spam check)
                  </label>
                  <input
                    type="text"
                    id="contact-website-honeypot"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="form-label">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="form-label">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="form-label">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    autoComplete="off"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="input-field resize-y"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn-primary w-full sm:w-auto ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>

              {/* Contact Info */}
              <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-200 text-center">
                <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8 font-medium">
                  Prefer to email us directly?
                </p>
                <div className="flex justify-center">
                  <div>
                    <p className="text-primary font-bold mb-2 text-sm sm:text-base">
                      Email
                    </p>
                    <p className="text-gray-600 text-sm sm:text-base">
                      loveserenespaces@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
