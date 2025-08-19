import { PRICING, TAX_RATE } from "@/lib/pricing";

export default function PricingPage() {
  const priceItems = [
    {
      code: "BLANKET_FILL",
      label: "Blanket (with fill)",
      price: PRICING.BLANKET_FILL,
      notes: "Per item",
    },
    {
      code: "SHEET_NO_FILL",
      label: "Sheet/Fly Sheet (no fill)",
      price: PRICING.SHEET_NO_FILL,
      notes: "Per item",
    },
    {
      code: "SADDLE_PAD",
      label: "Saddle Pad",
      price: PRICING.SADDLE_PAD,
      notes: "Per item",
    },
    {
      code: "WRAPS",
      label: "Wraps",
      price: PRICING.WRAPS,
      notes: "Per item or pair",
    },
    {
      code: "BOOTS",
      label: "Boots",
      price: PRICING.BOOTS,
      notes: "Per item or pair",
    },
    {
      code: "HOOD_NECK",
      label: "Hood or Neck Cover",
      price: PRICING.HOOD_NECK,
      notes: "Per item",
    },
    {
      code: "FLEECE_GIRTH",
      label: "Fleece Girth",
      price: PRICING.FLEECE_GIRTH,
      notes: "Per item",
    },
    {
      code: "WATERPROOFING",
      label: "Waterproofing",
      price: PRICING.WATERPROOFING,
      notes: "Per blanket",
    },
    {
      code: "EXTRA_WASH",
      label: "Extra Wash Fee",
      price: PRICING.EXTRA_WASH,
      notes: "Per item",
    },
    {
      code: "LEG_STRAPS",
      label: "Leg Strap(s)",
      price: PRICING.LEG_STRAPS,
      notes: "Per set",
    },
    {
      code: "REPAIRS",
      label: "Repairs",
      price: "—",
      notes: "Enter actual cost",
    },
  ];

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{
          marginBottom: "2rem",
          padding: "1.5rem",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            marginBottom: "2rem",
            color: "#1a1a1a",
            textAlign: "center",
          }}
        >
          Serene Spaces Price Sheet
        </h2>

        <div
          style={{
            border: "2px solid #dee2e6",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#f8f9fa",
            marginBottom: "2rem",
          }}
        >
          <h4 style={{ marginBottom: "16px", color: "#333" }}>
            Tax Information
          </h4>
          <p style={{ margin: 0, fontSize: "1.1rem" }}>
            <strong>Sales Tax Rate:</strong> {(TAX_RATE * 100).toFixed(2)}%
            (Illinois)
          </p>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #dee2e6",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th
                  style={{
                    padding: "12px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                    fontWeight: "600",
                  }}
                >
                  Code
                </th>
                <th
                  style={{
                    padding: "12px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                    fontWeight: "600",
                  }}
                >
                  Item / Service
                </th>
                <th
                  style={{
                    padding: "12px",
                    border: "1px solid #dee2e6",
                    textAlign: "right",
                    fontWeight: "600",
                  }}
                >
                  Unit Price (USD)
                </th>
                <th
                  style={{
                    padding: "12px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                    fontWeight: "600",
                  }}
                >
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {priceItems.map((item, index) => (
                <tr
                  key={item.code}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8f9fa",
                  }}
                >
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #dee2e6",
                      fontFamily: "monospace",
                      fontWeight: "500",
                    }}
                  >
                    {item.code}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {item.label}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #dee2e6",
                      textAlign: "right",
                      fontWeight: "500",
                    }}
                  >
                    {typeof item.price === "number"
                      ? `$${item.price.toFixed(2)}`
                      : item.price}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #dee2e6",
                      color: "#6c757d",
                      fontSize: "0.9rem",
                    }}
                  >
                    {item.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            marginTop: "2rem",
            padding: "16px",
            backgroundColor: "#e7f3ff",
            border: "1px solid #b3d9ff",
            borderRadius: "6px",
          }}
        >
          <h4 style={{ marginBottom: "12px", color: "#0056b3" }}>
            Quick Reference
          </h4>
          <ul style={{ margin: 0, paddingLeft: "20px", color: "#0056b3" }}>
            <li>All prices are per item unless otherwise noted</li>
            <li>Repairs are custom priced based on work required</li>
            <li>Tax is automatically calculated at 6.25%</li>
            <li>Use the New Invoice page to create professional invoices</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
