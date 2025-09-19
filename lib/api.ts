// Centralized API utilities for service requests

export interface ServiceRequest {
  id: string;
  customerId: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  services: string[];
  address: string;
  status: string;
  createdAt: string;
  pickupDate?: string;
  estimatedCost?: number;
  scheduledPickupDate?: string;
  repairNotes?: string;
  waterproofingNotes?: string;
  allergies?: string;
  notes?: string;
}

export async function fetchServiceRequests(): Promise<ServiceRequest[]> {
  const response = await fetch("/api/service-requests", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch service requests: ${response.status}`);
  }
  return response.json();
}

export async function markServiceRequestHandled(id: string): Promise<void> {
  const response = await fetch("/api/service-requests", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status: "handled" }),
  });
  if (!response.ok) {
    throw new Error(`Failed to mark request as handled: ${response.status}`);
  }
}

export async function updateServiceRequestNotes(
  id: string,
  notes: string,
): Promise<void> {
  const response = await fetch("/api/service-requests", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, notes }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update notes: ${response.status}`);
  }
}
