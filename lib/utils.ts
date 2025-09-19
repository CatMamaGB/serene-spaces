import { Customer } from "./hooks";

// Safe JSON parsing utility
export const safeJson = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

// Address formatting utility
export const formatAddress = (customer: Customer): string => {
  const parts = [
    customer.addressLine1,
    customer.addressLine2,
    customer.city,
    customer.state,
    customer.postalCode,
  ].filter((part) => part && String(part).trim().length > 0);

  return parts.length > 0 ? parts.join(", ") : "No address provided";
};

// Convert empty strings to null for API payload
export const toNull = (value: string): string | null => {
  return value.trim() === "" ? null : value.trim();
};

// Email validation
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ZIP code validation
export const isValidZipCode = (zipCode: string): boolean => {
  return /^\d{5}(-\d{4})?$/.test(zipCode);
};

// Clean form data by trimming all fields
export const cleanFormData = <T extends Record<string, string>>(data: T): T => {
  const cleaned = {} as T;
  for (const [key, value] of Object.entries(data)) {
    cleaned[key as keyof T] = value.trim() as T[keyof T];
  }
  return cleaned;
};
