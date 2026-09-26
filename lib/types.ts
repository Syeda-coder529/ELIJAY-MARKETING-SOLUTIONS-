export type OfferStatus = "active" | "paused";

/** A labelled link attached to an offer — ZIP code lists, scripts, samples. */
export interface OfferResource {
  label: string;
  url: string;
}

export interface Offer {
  id: string;
  title: string;
  vertical: string;
  payout: string;
  geo: string;
  cap: string;
  schedule: string;
  description: string;
  allowedTraffic: string;
  breakHours: string;
  paymentTerms: string;
  resources: OfferResource[];
  status: OfferStatus;
  createdAt: string;
}

export interface Vertical {
  id: string;
  name: string;
  createdAt: string;
}

export type ContactPref = "Telegram" | "WhatsApp" | "Teams";

export const CONTACT_PREFS: ContactPref[] = ["Telegram", "WhatsApp", "Teams"];

export interface OfferApplicationLead {
  offerId: string;
  offerTitle: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  dailyVolume: string;
  rpc: string;
  dataSampleLink: string;
  callRecordingLink: string;
  sourceUrlLink: string;
  scriptLink: string;
  contactPref: ContactPref;
  contactId: string;
  linkedinUrl: string;
}

export interface PublisherLead {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  linkedinUrl: string;
  contactPref: ContactPref;
  contactId: string;
  verticalsInterested: string[];
  trafficDescription: string;
}

export interface BuyerLead {
  companyName: string;
  contactPerson: string;
  companyEmail: string;
  companyPhone: string;
  contactId: string;
  offerName: string;
  offerDetails: string;
  vertical: string;
  geoStates: string;
  zipCodes: string;
  payoutRpc: string;
  capVolume: string;
  offerLinkIvr: string;
  notes: string;
}

export interface ContactLead {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  reason: string;
}
