import { Injectable } from '@nestjs/common';
import { parseStringPromise } from 'xml2js';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class XmlReceiverService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  async receiveInvoiceXml(xmlData: string): Promise<any> {
    try {
      const result = await parseStringPromise(xmlData); // Parse the XML into JavaScript object
      console.log('Received Invoice Data:', result);

      // Here, you can process the data, save it to the database, etc.
      // For now, we will simply return the parsed data.
      return result;
    } catch (error) {
      throw new Error('Error parsing XML data');
    }
  }

  async sendInvoiceTojofotara(invoice: any): Promise<AxiosResponse> {
    const company = await this.prisma.company.findUnique({
      where: { id: '45e858b6-ddc7-400b-b8ea-4ec63b6ebb9e' },
    });
    if (!company) {
      throw new Error('Company not found');
    }

    try {
      const xmlData = this.convertToUbl(invoice, company); // Convert the invoice data to XML format
      const response = await this.httpService
        .post(`${company.eInvoiceLink}`, xmlData, {
          headers: {
            'Content-Type': 'application/xml',
          },
        })
        .toPromise();

      console.log('Invoice sent to external server:', response.data);
      return response;
    } catch (error) {
      console.error('Error sending invoice to external server:', error);
      throw error;
    }
  }

  convertToUbl(invoice: any, company: any): string {
    function formatDate(isoDate: string): string {
      const date = new Date(isoDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero to month
      const day = String(date.getDate()).padStart(2, '0'); // Add leading zero to day
      return `${year}-${month}-${day}`;
    }

    const invoiceLines = invoice.items
      .map(
        (line: any, index: number) => `
        <cac:InvoiceLine>
            <cbc:ID>${index + 1}</cbc:ID>
            <cbc:InvoicedQuantity unitCode="PCE">${line.quantity}</cbc:InvoicedQuantity>
            <cbc:LineExtensionAmount currencyID="${invoice.documentCurrency}">${line.lineExtensionAmount}</cbc:LineExtensionAmount>
            <cac:TaxTotal>
                <cbc:TaxAmount currencyID="${invoice.documentCurrency}">${line.taxAmount}</cbc:TaxAmount>
                <cac:TaxSubtotal>
                    <cbc:TaxAmount currencyID="${invoice.documentCurrency}">${line.taxAmount}</cbc:TaxAmount>
                    <cac:TaxCategory>
                        <cbc:ID schemeAgencyID="6" schemeID="UN/ECE 5305">${line.taxCategory}</cbc:ID>
                        <cbc:Percent>${line.taxPercent}</cbc:Percent>
                        <cac:TaxScheme>
                            <cbc:ID schemeAgencyID="6" schemeID="UN/ECE 5153">VAT</cbc:ID>
                        </cac:TaxScheme>
                    </cac:TaxCategory>
                </cac:TaxSubtotal>
            </cac:TaxTotal>
            <cac:Item>
                <cbc:Name>${line.name}</cbc:Name>
            </cac:Item>
            <cac:Price>
                <cbc:PriceAmount currencyID="${invoice.documentCurrency}">${line.unitPrice}</cbc:PriceAmount>
                <cac:AllowanceCharge>
                    <cbc:ChargeIndicator>false</cbc:ChargeIndicator>
                    <cbc:AllowanceChargeReason>DISCOUNT</cbc:AllowanceChargeReason>
                    <cbc:Amount currencyID="${invoice.documentCurrency}">${line.discountAmount || 0}</cbc:Amount>
                </cac:AllowanceCharge>
            </cac:Price>
        </cac:InvoiceLine>
    `,
      )
      .join('');

    return `
        <?xml version="1.0" encoding="UTF-8"?>
        <?xml version="1.0" encoding="UTF-8"?>
        <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
                 xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
                 xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
                 xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2">
            <cbc:ProfileID>reporting:1.0</cbc:ProfileID>
            <cbc:ID>${invoice.number}</cbc:ID>
            <cbc:UUID>${invoice.uuid}</cbc:UUID>
            <cbc:IssueDate>${formatDate(invoice.issueDate)}</cbc:IssueDate>
            <cbc:InvoiceTypeCode name="${invoice.InvoiceTypeCodeName}">${invoice.invoiceTypeCode}</cbc:InvoiceTypeCode>
            <cbc:Note>${invoice.note || 'No additional notes'}</cbc:Note>
            <cbc:DocumentCurrencyCode>${invoice.documentCurrency}</cbc:DocumentCurrencyCode>
            <cbc:TaxCurrencyCode>${invoice.taxCurrency}</cbc:TaxCurrencyCode>
            <cac:AdditionalDocumentReference>
                <cbc:ID>ICV</cbc:ID>
                <cbc:UUID>${invoice.number}</cbc:UUID>
            </cac:AdditionalDocumentReference>
            <cac:AccountingSupplierParty>
                <cac:Party>
                    <cac:PostalAddress>
                        <cac:Country>
                            <cbc:IdentificationCode>JO</cbc:IdentificationCode>
                        </cac:Country>
                    </cac:PostalAddress>
                    <cac:PartyTaxScheme>
                        <cbc:CompanyID>${company.taxNumber || 'Unknown'}</cbc:CompanyID>
                        <cac:TaxScheme>
                            <cbc:ID>VAT</cbc:ID>
                        </cac:TaxScheme>
                    </cac:PartyTaxScheme>
                    <cac:PartyLegalEntity>
                        <cbc:RegistrationName>${company.legalName || 'Unknown Supplier'}</cbc:RegistrationName>
                    </cac:PartyLegalEntity>
                </cac:Party>
            </cac:AccountingSupplierParty>
            <cac:AccountingCustomerParty>
                <cac:Party>
                    <cac:PartyIdentification>
                        <cbc:ID schemeID="${invoice.customer.schemeId}">${invoice.customer.identification}</cbc:ID>
                    </cac:PartyIdentification>
                    <cac:PostalAddress>
                        <cbc:PostalZone>${invoice.customer.postalCode || '00000'}</cbc:PostalZone>
                        <cbc:CountrySubentityCode>JO-AZ</cbc:CountrySubentityCode>
                        <cac:Country>
                            <cbc:IdentificationCode>JO</cbc:IdentificationCode>
                        </cac:Country>
                    </cac:PostalAddress>
                    <cac:PartyTaxScheme>
                        <cbc:CompanyID>${invoice.customer.accountId}</cbc:CompanyID>
                        <cac:TaxScheme>
                            <cbc:ID>VAT</cbc:ID>
                        </cac:TaxScheme>
                    </cac:PartyTaxScheme>
                    <cac:PartyLegalEntity>
                        <cbc:RegistrationName>${invoice.customer.name}</cbc:RegistrationName>
                    </cac:PartyLegalEntity>
                </cac:Party>
                <cac:AccountingContact>
                    <cbc:Telephone>${invoice.customer.phone}</cbc:Telephone>
                </cac:AccountingContact>
            </cac:AccountingCustomerParty>

            <cac:SellerSupplierParty>
		        <cac:Party>
			        <cac:PartyIdentification>
				        <cbc:ID>${company.legalId}</cbc:ID>
			        </cac:PartyIdentification>
		        </cac:Party>
	        </cac:SellerSupplierParty>


            <cac:TaxTotal>
                <cbc:TaxAmount currencyID="${invoice.documentCurrency}">${invoice.items.reduce((sum, item) => sum + item.taxAmount, 0)}</cbc:TaxAmount>
            </cac:TaxTotal>

            <cac:LegalMonetaryTotal>
                <cbc:TaxExclusiveAmount currencyID="${invoice.documentCurrency}">${invoice.taxExclusiveAmount}</cbc:TaxExclusiveAmount>
                <cbc:TaxInclusiveAmount currencyID="${invoice.documentCurrency}">${invoice.taxInclusiveAmount}</cbc:TaxInclusiveAmount>
                <cbc:AllowanceTotalAmount currencyID="${invoice.documentCurrency}">${invoice.allowanceTotalAmount || 0}</cbc:AllowanceTotalAmount>
                <cbc:PayableAmount currencyID="${invoice.documentCurrency}">${invoice.payableAmount}</cbc:PayableAmount>
            </cac:LegalMonetaryTotal>
            ${invoiceLines}
        </Invoice>
    `;
  }
}
