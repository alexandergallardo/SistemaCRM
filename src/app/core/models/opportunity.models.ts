export type Opportunity = {
  id: number;
  accountId: number;
  accountName: string;
  personId: number;
  personName: string;
  probability: string;
  currency: string;
  baseAmount: number;
  serviceId: number;
  serviceName: string;
  salesAgentName: string;
  salesStageName: string;
  salesStageId: number;
  createdAt: Date;
  updatedAt: Date;
}