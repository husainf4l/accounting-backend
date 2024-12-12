import { Injectable } from '@nestjs/common';
import { parseStringPromise } from 'xml2js';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { response } from 'express';

@Injectable()
export class XmlReceiverService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  async receiveInvoiceXml(xmlData: string): Promise<any> {
    try {
      console.log('Raw XML Data:', xmlData);

      const result = await parseStringPromise(xmlData);
      console.log('Parsed XML Data:', result);

      return result;
    } catch (error) {
      console.error('Error parsing XML data:', error.message);
      throw new Error('Error parsing XML data');
    }
  }

  async sendInvoiceTojofotara(invoice: any): Promise<AxiosResponse> {
    const company = await this.prisma.company.findUnique({
      where: { id: '45e858b6-ddc7-400b-b8ea-4ec63b6ebb9e' },
    });

    if (!company) {
      console.error('Company not found.');
      throw new Error('Company not found');
    }

    const xmlData = this.convertToUbl(invoice, company);
    const encodedXml = Buffer.from(xmlData, 'utf-8').toString('base64');
    const payload = {
      invoice: encodedXml,
    };

    try {
      const response = await this.httpService
        .post('https://backend.jofotara.gov.jo/core/invoices/', payload, {
          headers: {
            'Client-Id': '454e11a1-1a10-4212-b4b3-8e28fd9a75c8',
            'Secret-Key':
              'Gj5nS9wyYHRadaVffz5VKB4v4wlVWyPhcJvrTD4NHtN9Z8Pl9XB+9O9xiTjI14ZTg/+1TpPX6hUagPbcqs8CBaDeq8LlqrnOFJCGq4QhZmMWs5xPcOifs6J/tEWwLY6dFp9atVEHylU8huJc766XqxmRUc8YoUHuwANR0owYYMgj/QrdBBcb/1Dr8eOdZKkUNf58lweIokCEmJJuBbrxHU+caKwp/EN9dp7/jolXX/b5FEc4FyOwW5W8sm/YbOMx+hzjg1Dn0cbgbJ6v3LZf5Q==',
            'Content-Type': 'application/json',
            Cookie:
              'stickounet=4fdb7136e666916d0e373058e9e5c44e|7480c8b0e4ce7933ee164081a50488f1',
          },
        })
        .toPromise();
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Error Details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(`Failed to send invoice: ${error.message}`);
    }

    return;
  }

  convertToUbl(invoice: any, company: any): string {
    function formatDate(isoDate: string): string {
      const date = new Date(isoDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2">
	<cbc:ProfileID>reporting:1.0</cbc:ProfileID>
	<cbc:ID>EIN998833</cbc:ID>
    <cbc:UUID>${invoice.uuid || 'UUID_PLACEHOLDER'}</cbc:UUID>
	<cbc:IssueDate>2024-12-12</cbc:IssueDate>
	<cbc:InvoiceTypeCode name="021">388</cbc:InvoiceTypeCode>
	<cbc:Note>ملاحظات 2</cbc:Note>
	<cbc:DocumentCurrencyCode>JOD</cbc:DocumentCurrencyCode>
	<cbc:TaxCurrencyCode>JOD</cbc:TaxCurrencyCode>
	<cac:AdditionalDocumentReference>
		<cbc:ID>ICV</cbc:ID>
		<cbc:UUID>1</cbc:UUID>
	</cac:AdditionalDocumentReference>
	<cac:AccountingSupplierParty>
		<cac:Party>
			<cac:PostalAddress>
				<cac:Country>
					<cbc:IdentificationCode>JO</cbc:IdentificationCode>
				</cac:Country>
			</cac:PostalAddress>
			<cac:PartyTaxScheme>
                <cbc:CompanyID>178103217</cbc:CompanyID>
				<cac:TaxScheme>
					<cbc:ID>VAT</cbc:ID>
				</cac:TaxScheme>
			</cac:PartyTaxScheme>
			<cac:PartyLegalEntity>
                <cbc:RegistrationName>شركة المصفح التجارية</cbc:RegistrationName>
			</cac:PartyLegalEntity>
		</cac:Party>
	</cac:AccountingSupplierParty>
	<cac:AccountingCustomerParty>
		<cac:Party>
			<cac:PartyIdentification>
				<cbc:ID schemeID="NIN">9911058007</cbc:ID>
			</cac:PartyIdentification>
			<cac:PostalAddress>
				<cac:Country>
					<cbc:IdentificationCode>JO</cbc:IdentificationCode>
				</cac:Country>
			</cac:PostalAddress>
			<cac:PartyTaxScheme>
				<cac:TaxScheme>
					<cbc:ID>VAT</cbc:ID>
				</cac:TaxScheme>
			</cac:PartyTaxScheme>
			<cac:PartyLegalEntity>
				<cbc:RegistrationName>الحسين قاسم</cbc:RegistrationName>
			</cac:PartyLegalEntity>
		</cac:Party>
		<cac:AccountingContact>
			<cbc:Telephone>324323434</cbc:Telephone>
		</cac:AccountingContact>
	</cac:AccountingCustomerParty>
	<cac:SellerSupplierParty>
		<cac:Party>
			<cac:PartyIdentification>
				<cbc:ID>14514141</cbc:ID>
			</cac:PartyIdentification>
		</cac:Party>
	</cac:SellerSupplierParty>
	<cac:AllowanceCharge>
		<cbc:ChargeIndicator>false</cbc:ChargeIndicator>
		<cbc:AllowanceChargeReason>discount</cbc:AllowanceChargeReason>
		<cbc:Amount currencyID="JO">2.00</cbc:Amount>
	</cac:AllowanceCharge>
	<cac:LegalMonetaryTotal>
		<cbc:TaxExclusiveAmount currencyID="JO">132.00</cbc:TaxExclusiveAmount>
		<cbc:TaxInclusiveAmount currencyID="JO">130.00</cbc:TaxInclusiveAmount>
		<cbc:AllowanceTotalAmount currencyID="JO">2.00</cbc:AllowanceTotalAmount>
		<cbc:PayableAmount currencyID="JO">130.00</cbc:PayableAmount>
	</cac:LegalMonetaryTotal>
	<cac:InvoiceLine>
		<cbc:ID>1</cbc:ID>
		<cbc:InvoicedQuantity unitCode="PCE">44.00</cbc:InvoicedQuantity>
		<cbc:LineExtensionAmount currencyID="JO">130.00</cbc:LineExtensionAmount>
		<cac:Item>
			<cbc:Name>test item</cbc:Name>
		</cac:Item>
		<cac:Price>
			<cbc:PriceAmount currencyID="JO">3.00</cbc:PriceAmount>
			<cac:AllowanceCharge>
				<cbc:ChargeIndicator>false</cbc:ChargeIndicator>
				<cbc:AllowanceChargeReason>DISCOUNT</cbc:AllowanceChargeReason>
				<cbc:Amount currencyID="JO">2.00</cbc:Amount>
			</cac:AllowanceCharge>
		</cac:Price>
	</cac:InvoiceLine>
</Invoice>`;
  }
}
