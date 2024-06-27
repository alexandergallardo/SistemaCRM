export type Opportunity = {
  id: number;
  accountName: string;
  personName: string;
  probability: string;
  currency: string;
  baseAmount: number;
  serviceName: string;
  salesAgentName: string;
  salesStageName: string;
  salesStageId: number;
  createdAt: Date;
  updatedAt: Date;
}