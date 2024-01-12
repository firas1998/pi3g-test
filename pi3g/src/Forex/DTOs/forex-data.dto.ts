export interface ForexDataDTO {
  success: boolean;
  timestamp: number;
  base: string;
  data: string;
  rates: Record<string, number>;
}
