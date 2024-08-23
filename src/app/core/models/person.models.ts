export type Person = {
  name: string;
  position: string;
  email: string;
  mobile: string;
  accountId: number;
  personType: string;
  salesAgentId: number;
  customAttributes: CustomAttribute[];
}

export type CustomAttribute = {
  attributeId: number;
  value: string;
}

export type Contact = {
  id: number;
  name: string;
  position: string;
  email: string;
  mobile: string;
  accountId: number;
  accountName: string;
  salesAgentName: string;
  createdAt: Date;
  linkedin: string;
  facebook: string;
  instagram: string;
  mainContact: boolean;
  decisionMakingType: string;
  area: string;
  management: string;
}

export type Lead = {
  id: number;
  name: string;
  position: string;
  email: string;
  mobile: string;
  accountId: number;
  accountName: string;
  salesAgentName: string;
  createdAt: Date;
  leadStatus: string;
  leadSource: string;
  leadRating: string;
}