interface InvoiceCustomer {
 // id: string;
 // billAddress: string;
 // shipAddress: string;
 // creditLimit: number;
  address?: string;
  company?: string;
  email: string;
  name: string;
  taxId?: string;
 // memo: string;
}

interface InvoiceItem {
  id: string;
  //no: string;
  currency: string;
  description: string;
  unitAmount: number;
}

export type InvoiceStatus =
  | 'open' 
  | 'canceled'
  | 'paid'
  | 'pending';

export type USPinfo =
  | { name: string, 'Universal Steel Products, Inc.' }
  | { address: string, '222 Bridge Plaza South, Ste 530, Fort Lee, NJ 07024' }
  | { phone: string, '201-731-3551' }
  | { fax: string, '973-741-6888' }
  | { website: string, 'www.universal-steel.com' }
  | { billAddress: string, '222 Bridge Plaza South, Ste 530, Fort Lee, NJ 07024' }
  | { bankName: string, 'Hanmi Bank' }
  | { bankAddress: string, '933 S. Vermont Ave. 2nd Fl, Los Angeles, CA 90006' }
  | { accountName: string, 'Universal Steel Products, Inc.' }
  | { accountNo: string, '500493372' }
  | { routingNo: string, '1220-39399' };

export type FreightTerm = 
  | 'Prepaid'
  | 'CPU'
  | 'Collect'
  | 'Transfer';

// SimpleOrder랑 충돌
//export type PaymentTerm =
//  | 'Net'
//  | 'Net 30'
//  | 'CIA'
//  | 'CAD';

export type Unit =
  | 'LB'
  | 'MT'
  | 'FT'
  | 'CWT'
  | 'NT'
  | 'FT'
  | 'Bundle';


  export interface Invoice {
    id: string;
  //  no: string;
  //  invoiceDate: Date;
    status: InvoiceStatus;
  //  instruction: string;

  //  uspInfo: USPinfo;

  // poNo: string;
  //  soNo: string[];
  //  shipmentLotNo: string[];

  //  salesRep: string;

  //  shipDate: Date;
  //  freightTerm: FreightTerm;
  //  paymentTerm: PaymentTerm;
  //  discountPercentage: number;
    dueDate?: number;
  //  memo: string;

    customer: InvoiceCustomer;

    items?: InvoiceItem[];
    currency: string;

  //  invoiceQty: number;
  //  qtyUnit: Unit;
  //  unitPrice: number;
  //  additionalFreightCharge: number;

    issueDate?: number;
    number?: string;

    subtotalAmount?: number;
    taxAmount?: number;
    totalAmount?: number;

  //  paidDate: Date;
}
