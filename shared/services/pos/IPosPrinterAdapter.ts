import type { Order } from '../../types/order';

export type PosDeviceType = 'EZO_THERMAL_ESC_POS' | 'BROWSER_FALLBACK';

export type PosConnectionState = 
  | 'NOT_CONFIGURED' 
  | 'READY_FOR_CREDENTIALS' 
  | 'CONNECTED' 
  | 'DISCONNECTED'
  | 'BLOCKED';

export interface PosPrinterStatus {
  isConfigured: boolean;
  deviceType: PosDeviceType;
  connectionState: PosConnectionState;
  deviceName?: string;
  lastPrintTimestamp?: string;
  error?: string;
}

export interface PrintReceiptResult {
  success: boolean;
  receiptReference: string;
  error?: string;
  escPosPayloadHex?: string;
}

export interface IPosPrinterAdapter {
  getStatus(): Promise<PosPrinterStatus>;
  printOrderReceipt(order: Order): Promise<PrintReceiptResult>;
  formatThermalReceipt(order: Order): string;
}
