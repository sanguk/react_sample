export interface Customer {
    id: number;
    name: string;

    billToAddress1:string;
    billToAddress2:string;
    billToCity:string;
    billToState:string;
    billToZip:string;
    shipToAddress1:string;
    shipToAddress2:string;
    shipToCity:string;
    shipToState:string;
    shipToZip:string;
    salesRep:string;
    PaymentTerms:string;
    freightTerms:string;
    termsAndConditions:string;
    internalNote:string;

  }