/** The vendor as the list returns it when the projection resolves the `vendorId` reference. */
export type Vendor = { contactName: string; companyName: string };

/** The Vendor column's text: contact and company, or "—" for an article without a vendor. */
export function vendorLabel(vendor: Vendor | undefined): string {
  return vendor ? `${vendor.contactName} (${vendor.companyName})` : "—";
}
