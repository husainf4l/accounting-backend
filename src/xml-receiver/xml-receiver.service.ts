import { parseStringPromise } from 'xml2js';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { response } from 'express';
import { readFileSync } from 'fs';
import path from 'path';
import { writeFile } from 'fs';
import { join } from 'path';
import { create } from 'xmlbuilder2';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class XmlReceiverService {
	constructor(
		private readonly httpService: HttpService,
		private readonly prisma: PrismaService,
	) { }


	async sendInvoiceTojofotara(invoice: any): Promise<any> {


		try {
			const company = await this.prisma.company.findUnique({
				where: { id: '45e858b6-ddc7-400b-b8ea-4ec63b6ebb9e' },
			});

			if (!company) {
				console.error('Company not found.');
				throw new Error('Company not found');
			}

			const { v4: uuidv4 } = require('uuid');
			const generatedUUID = uuidv4();
			console.log(generatedUUID);

			const xmlData = this.convertToUbl(invoice, company);
			console.log(xmlData)

			const encodedXml = Buffer.from(xmlData, 'utf-8').toString('base64');

			const payload = { invoice: encodedXml };

			const response = await this.httpService
				.post('https://backend.jofotara.gov.jo/core/invoices/', payload, {
					headers: {
						'Client-Id': '454e11a1-1a10-4212-b4b3-8e28fd9a75c8',
						'Secret-Key': 'Gj5nS9wyYHRadaVffz5VKB4v4wlVWyPhcJvrTD4NHtN9Z8Pl9XB+9O9xiTjI14ZTg/+1TpPX6hUagPbcqs8CBaDeq8LlqrnOFJCGq4QhZmMWs5xPcOifs6J/tEWwLY6dFp9atVEHylU8huJc766XqxmRUc8YoUHuwANR0owYYMgj/QrdBBcb/1Dr8eOdZKkUNf58lweIokCEmJJuBbrxHU+caKwp/EN9dp7/jolXX/b5FEc4FyOwW5W8sm/YbOMx+hzjg1Dn0cbgbJ6v3LZf5Q==',
						'Content-Type': 'application/json',
					},
				})
				.toPromise();

			console.log('API Response:', response.data);
			return 'response.data';
		} catch (error) {
			// Log general error detailssssss
			console.error('Error Details:', {
				message: error.message,
				status: error.response?.status,
				data: error.response?.data,
				headers: error.response?.headers,
			});

			// Extract and log the specific error array if available
			const errors = error.response?.data?.EINV_RESULTS?.ERRORS;
			if (errors && Array.isArray(errors)) {
				console.error('Error Array:', errors);
			} else {
				console.error('No error array provided.');
			}

			// Rethrow a custom error for further handling
			throw new Error(`Failed to send invoice: ${error.message}`);
		}

		return ''

	}



	// convertToUbl2(invoice: any, company: any): string {
	// 	const uuid = uuidv4();
	// 	const issueDate = new Date(invoice.issueDate).toISOString().split('T')[0]; // Use provided issueDate

	// 	// Helper function to round numbers to 9 decimal places
	// 	const roundToNine = (num: number | string) => parseFloat(parseFloat(num as string).toFixed(9));
	// 	const unitPrice = 1;
	// 	const taxPercint = 16;
	// 	const quantity = 1;
	// 	let allawance = 0.1;
	// 	allawance = roundToNine(allawance);
	// 	const lineExtensionAmount = roundToNine(quantity * (unitPrice - allawance))
	// 	const taxAmountLine = roundToNine((quantity * (unitPrice - allawance)) * taxPercint / 100)
	// 	const RoundingAmount = roundToNine((quantity * (unitPrice - allawance)) + taxAmountLine)



	// 	try {
	// 		const xml = create({ version: '1.0', encoding: 'UTF-8' })
	// 			.ele('Invoice', { xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2' })
	// 			.att('xmlns:cac', 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2')
	// 			.att('xmlns:cbc', 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2')
	// 			.att('xmlns:ext', 'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2')
	// 			.ele('cbc:ProfileID').txt('reporting:1.0').up()
	// 			.ele('cbc:ID').txt(invoice.number || 'EIN00090').up()
	// 			.ele('cbc:UUID').txt(uuid).up()
	// 			.ele('cbc:IssueDate').txt(issueDate).up()
	// 			.ele('cbc:InvoiceTypeCode', { name: invoice.InvoiceTypeCodeName || '012' }).txt(invoice.invoiceTypeCode).up()
	// 			.ele('cbc:Note').txt(invoice.note || 'Default Note').up()
	// 			.ele('cbc:DocumentCurrencyCode').txt(invoice.documentCurrency || 'JOD').up()
	// 			.ele('cbc:TaxCurrencyCode').txt(invoice.taxCurrency || 'JOD').up()

	// 			.ele('cac:AccountingSupplierParty')
	// 			.ele('cac:Party')
	// 			.ele('cac:PostalAddress')
	// 			.ele('cac:Country')
	// 			.ele('cbc:IdentificationCode').txt('JO').up()
	// 			.up()
	// 			.up()
	// 			.ele('cac:PartyTaxScheme')
	// 			.ele('cbc:CompanyID').txt(company.taxNumber).up()
	// 			.ele('cac:TaxScheme')
	// 			.ele('cbc:ID').txt('VAT').up()
	// 			.up()
	// 			.up()
	// 			.ele('cac:PartyLegalEntity')
	// 			.ele('cbc:RegistrationName').txt(company.legalName).up()
	// 			.up()
	// 			.up()
	// 			.up()

	// 			.ele('cac:AccountingCustomerParty')
	// 			.ele('cac:Party')
	// 			.ele('cac:PartyIdentification')
	// 			.ele('cbc:ID', { schemeID: 'TN' }).txt('33445544').up()
	// 			.up()
	// 			.ele('cac:PostalAddress')
	// 			.ele('cbc:PostalZone').txt('33554').up()
	// 			.ele('cbc:CountrySubentityCode').txt('JO-AZ').up()
	// 			.ele('cac:Country')
	// 			.ele('cbc:IdentificationCode').txt('JO').up()
	// 			.up()
	// 			.up()
	// 			.ele('cac:PartyTaxScheme')
	// 			.ele('cbc:CompanyID').txt('33445544').up()
	// 			.ele('cac:TaxScheme')
	// 			.ele('cbc:ID').txt('VAT').up()
	// 			.up()
	// 			.up()
	// 			.ele('cac:PartyLegalEntity')
	// 			.ele('cbc:RegistrationName').txt('امجد سليمان').up()
	// 			.up()
	// 			.up()
	// 			.ele('cac:AccountingContact')
	// 			.ele('cbc:Telephone').txt('324323434').up()
	// 			.up()
	// 			.up()



	// 			.ele('cac:AllowanceCharge')
	// 			.ele('cbc:ChargeIndicator').txt('false').up()
	// 			.ele('cbc:AllowanceChargeReason').txt('discount').up()
	// 			.ele('cbc:Amount', { currencyID: 'JO' }).txt(roundToNine(allawance).toString()).up()
	// 			.up()

	// 			.ele('cac:TaxTotal')
	// 			.ele('cbc:TaxAmount', { currencyID: 'JO' }).txt(roundToNine(taxAmountLine).toString()).up()
	// 			.up()
	// 			.ele('cac:LegalMonetaryTotal')
	// 			.ele('cbc:TaxExclusiveAmount', { currencyID: 'JO' }).txt(roundToNine(quantity * unitPrice).toString()).up()
	// 			.ele('cbc:TaxInclusiveAmount', { currencyID: 'JO' }).txt(roundToNine(RoundingAmount).toString()).up()
	// 			.ele('cbc:AllowanceTotalAmount', { currencyID: 'JO' }).txt(roundToNine(allawance).toString()).up()
	// 			.ele('cbc:PayableAmount', { currencyID: 'JO' }).txt(roundToNine(RoundingAmount - allawance).toString()).up()
	// 			.up();

	// 		invoice.items.forEach((item: any, index: number) => {
	// 			xml.ele('cac:InvoiceLine')
	// 				.ele('cbc:ID').txt((index + 1).toString()).up()
	// 				.ele('cbc:InvoicedQuantity', { unitCode: 'PCE' }).txt(quantity.toString()).up()
	// 				.ele('cbc:LineExtensionAmount', { currencyID: 'JO' }).txt(lineExtensionAmount.toString()).up()
	// 				.ele('cac:TaxTotal')
	// 				.ele('cbc:TaxAmount', { currencyID: 'JO' }).txt(taxAmountLine.toString()).up()
	// 				.ele('cac:TaxSubtotal')
	// 				.ele('cbc:TaxAmount', { currencyID: 'JO' }).txt(taxAmountLine.toString()).up()
	// 				.ele('cac:TaxCategory')
	// 				.ele('cbc:ID', { schemeAgencyID: '6', schemeID: 'UN/ECE 5305' }).txt('S').up()
	// 				.ele('cbc:Percent').txt(roundToNine('16.00').toString()).up()
	// 				.ele('cac:TaxScheme')
	// 				.ele('cbc:ID', { schemeAgencyID: '6', schemeID: 'UN/ECE 5153' }).txt('VAT').up()
	// 				.up()
	// 				.up()
	// 				.up()
	// 				.up()
	// 				.ele('cac:Item')
	// 				.ele('cbc:Name').txt(item.name || 'Default Item').up()
	// 				.up()
	// 				.ele('cac:Price')
	// 				.ele('cbc:PriceAmount', { currencyID: 'JO' }).txt(unitPrice.toString()).up()
	// 				.ele('cac:AllowanceCharge')
	// 				.ele('cbc:ChargeIndicator').txt('false').up()
	// 				.ele('cbc:AllowanceChargeReason').txt('DISCOUNT').up()
	// 				.ele('cbc:Amount', { currencyID: 'JO' }).txt(allawance.toString()).up()
	// 				.up()

	// 				.up()
	// 				.up();
	// 		});

	// 		return xml.end({ prettyPrint: true });
	// 	} catch (error) {
	// 		console.error('Error generating XML:', error);
	// 		return '';
	// 	}
	// }



	// convertToUbl1(invoice: any, company: any): string {
	// 	const uuid = uuidv4();
	// 	const issueDate = new Date(invoice.issueDate).toISOString().split('T')[0]; // Use provided issueDate

	// 	try {
	// 		const xml = create({ version: '1.0', encoding: 'UTF-8' })
	// 			.ele('Invoice', { xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2' })
	// 			.att('xmlns:cac', 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2')
	// 			.att('xmlns:cbc', 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2')
	// 			.att('xmlns:ext', 'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2')
	// 			.ele('cbc:ProfileID').txt('reporting:1.0').up()
	// 			.ele('cbc:ID').txt(invoice.number || 'EIN00090').up()
	// 			.ele('cbc:UUID').txt(uuid).up()
	// 			.ele('cbc:IssueDate').txt(issueDate).up()
	// 			.ele('cbc:InvoiceTypeCode', { name: invoice.InvoiceTypeCodeName || '012' }).txt(invoice.invoiceTypeCode).up()
	// 			.ele('cbc:Note').txt(invoice.note || 'Default Note').up()
	// 			.ele('cbc:DocumentCurrencyCode').txt(invoice.documentCurrency || 'JOD').up()
	// 			.ele('cbc:TaxCurrencyCode').txt(invoice.taxCurrency || 'JOD').up()
	// 			.ele('cac:AccountingSupplierParty')
	// 			.ele('cac:Party')
	// 			.ele('cac:PostalAddress')
	// 			.ele('cac:Country')
	// 			.ele('cbc:IdentificationCode').txt('JO').up()
	// 			.up()
	// 			.up()
	// 			.ele('cac:PartyTaxScheme')
	// 			.ele('cbc:CompanyID').txt(company?.legalId || '8004854').up()
	// 			.ele('cac:TaxScheme')
	// 			.ele('cbc:ID').txt('VAT').up()
	// 			.up()
	// 			.up()
	// 			.ele('cac:PartyLegalEntity')
	// 			.ele('cbc:RegistrationName').txt(company?.legalName || 'Default Supplier').up()
	// 			.up()
	// 			.up()
	// 			.up()
	// 			.ele('cac:AccountingCustomerParty')
	// 			.ele('cac:Party')
	// 			.ele('cac:PartyIdentification')
	// 			.ele('cbc:ID', { schemeID: invoice.customer.schemeId || 'TN' }).txt('129341371').up()
	// 			.up()
	// 			.ele('cac:PostalAddress')
	// 			.ele('cbc:PostalZone').txt(invoice.customer.postalCode || '11941').up()
	// 			.ele('cbc:CountrySubentityCode').txt(invoice.customer.countryCode || 'JO-AM').up()
	// 			.ele('cac:Country')
	// 			.ele('cbc:IdentificationCode').txt(invoice.customer.countryCode || 'JO').up()
	// 			.up()
	// 			.up()
	// 			.ele('cac:PartyTaxScheme')
	// 			.ele('cbc:CompanyID').txt('129341371').up()
	// 			.ele('cac:TaxScheme')
	// 			.ele('cbc:ID').txt('VAT').up()
	// 			.up()
	// 			.up()
	// 			.ele('cac:PartyLegalEntity')
	// 			.ele('cbc:RegistrationName').txt('papaya trading').up()
	// 			.up()
	// 			.up()
	// 			.up()

	// 			.ele('cac:TaxTotal')
	// 			.ele('cbc:TaxAmount', { currencyID: 'JO' }).txt('0.08').up()
	// 			.up()
	// 			.ele('cac:LegalMonetaryTotal')
	// 			.ele('cbc:TaxExclusiveAmount', { currencyID: 'JO' }).txt('0.50').up()
	// 			.ele('cbc:TaxInclusiveAmount', { currencyID: 'JO' }).txt('0.58').up()
	// 			.ele('cbc:AllowanceTotalAmount', { currencyID: 'JO' }).txt('0.00').up()
	// 			.ele('cbc:PayableAmount', { currencyID: 'JO' }).txt('0.58').up()
	// 			.up();

	// 		invoice.items.forEach((item: any, index: number) => {
	// 			xml.ele('cac:InvoiceLine')
	// 				.ele('cbc:ID').txt((index + 1).toString()).up()
	// 				.ele('cbc:InvoicedQuantity', { unitCode: 'PCE' }).txt('1.00').up()
	// 				.ele('cbc:LineExtensionAmount', { currencyID: 'JO' }).txt('0.50').up()
	// 				.ele('cac:TaxTotal')
	// 				.ele('cbc:TaxAmount', { currencyID: 'JO' }).txt('0.08').up()
	// 				.ele('cac:TaxSubtotal')
	// 				.ele('cbc:TaxAmount', { currencyID: 'JO' }).txt('0.08').up()
	// 				.ele('cac:TaxCategory')
	// 				.ele('cbc:ID', { schemeAgencyID: '6', schemeID: 'UN/ECE 5305' }).txt('S').up()
	// 				.ele('cbc:Percent').txt('16.00').up()
	// 				.ele('cac:TaxScheme')
	// 				.ele('cbc:ID', { schemeAgencyID: '6', schemeID: 'UN/ECE 5153' }).txt('VAT').up()
	// 				.up()
	// 				.up()
	// 				.up()
	// 				.up()
	// 				.ele('cac:Item')
	// 				.ele('cbc:Name').txt(item.name || 'Default Item').up()
	// 				.up()
	// 				.ele('cac:Price')
	// 				.ele('cbc:PriceAmount', { currencyID: 'JO' }).txt('0.50').up()
	// 				.up()
	// 				.up();
	// 		});

	// 		return xml.end({ prettyPrint: true });
	// 	} catch (error) {
	// 		console.error('Error generating XML:', error);
	// 		return '';
	// 	}
	// }

	// This one is close
	// convertToUbl(invoice: any, company: any): string {
	// 	const uuid = uuidv4();
	// 	const issueDate = new Date(invoice.issueDate).toISOString().split('T')[0];

	// 	// Helper function to round numbers to 9 decimal places
	// 	const roundToNine = (num: number | string) => parseFloat(parseFloat(num as string).toFixed(9));

	// 	const unitPrice = 1;
	// 	const taxPercent = 16;
	// 	const quantity = 1;
	// 	const allowance = 0.1;

	// 	const lineExtensionAmount = roundToNine(quantity * (unitPrice - allowance));
	// 	const taxAmountLine = roundToNine(lineExtensionAmount * taxPercent / 100);
	// 	const roundingAmount = roundToNine(lineExtensionAmount + taxAmountLine);

	// 	try {
	// 		const xml = create({ version: '1.0', encoding: 'UTF-8' })
	// 			.ele('Invoice', { xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2' })
	// 			.att('xmlns:cac', 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2')
	// 			.att('xmlns:cbc', 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2')
	// 			.att('xmlns:ext', 'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2')
	// 			.ele('cbc:ProfileID').txt('reporting:1.0').up()
	// 			.ele('cbc:ID').txt(invoice.number || 'EIN00090').up()
	// 			.ele('cbc:UUID').txt(uuid).up()
	// 			.ele('cbc:IssueDate').txt(issueDate).up()
	// 			.ele('cbc:InvoiceTypeCode', { name: invoice.InvoiceTypeCodeName || '012' }).txt(invoice.invoiceTypeCode).up()
	// 			.ele('cbc:Note').txt(invoice.note || 'Default Note').up()
	// 			.ele('cbc:DocumentCurrencyCode').txt(invoice.documentCurrency || 'JOD').up()
	// 			.ele('cbc:TaxCurrencyCode').txt(invoice.taxCurrency || 'JOD').up()
	// 			.ele('cac:AccountingSupplierParty')
	// 			.ele('cac:Party')
	// 			.ele('cac:PostalAddress')
	// 			.ele('cac:Country')
	// 			.ele('cbc:IdentificationCode').txt('JO').up()
	// 			.up()
	// 			.up()
	// 			.ele('cac:PartyTaxScheme')
	// 			.ele('cbc:CompanyID').txt(company.taxNumber).up()
	// 			.ele('cac:TaxScheme')
	// 			.ele('cbc:ID').txt('VAT').up()
	// 			.up()
	// 			.up()
	// 			.ele('cac:PartyLegalEntity')
	// 			.ele('cbc:RegistrationName').txt(company.legalName).up()
	// 			.up()
	// 			.up()
	// 			.up()




	// 			.ele('cac:AccountingCustomerParty')
	// 			.ele('cac:Party')
	// 			.ele('cac:PartyIdentification')
	// 			.ele('cbc:ID', { schemeID: 'TN' }).txt('129341371').up()
	// 			.up()
	// 			.ele('cac:PostalAddress')
	// 			.ele('cbc:PostalZone').txt('11941').up()
	// 			.ele('cbc:CountrySubentityCode').txt('JO-AM').up()
	// 			.ele('cac:Country')
	// 			.ele('cbc:IdentificationCode').txt('JO').up()
	// 			.up()
	// 			.up()
	// 			.ele('cac:PartyTaxScheme')
	// 			.ele('cbc:CompanyID').txt('129341371').up()
	// 			.ele('cac:TaxScheme')
	// 			.ele('cbc:ID').txt('VAT').up()
	// 			.up()
	// 			.up()
	// 			.ele('cac:PartyLegalEntity')
	// 			.ele('cbc:RegistrationName').txt('شركو بابايا التجارية').up()
	// 			.up()
	// 			.up()
	// 			.ele('cac:AccountingContact')
	// 			.ele('cbc:Telephone').txt('324323434').up()
	// 			.up()
	// 			.up()


	// 			.ele('cac:SellerSupplierParty')
	// 			.ele('cac:Party')
	// 			.ele('cac:PartyIdentification')
	// 			.ele('cbc:ID').txt('14514141').up()
	// 			.up()
	// 			.up()
	// 			.up()


	// 			.ele('cac:AllowanceCharge')
	// 			.ele('cbc:ChargeIndicator').txt('false').up()
	// 			.ele('cbc:AllowanceChargeReason').txt('discount').up()
	// 			.ele('cbc:Amount', { currencyID: 'JO' }).txt(roundToNine(allowance).toString()).up()
	// 			.up()

	// 			.ele('cac:TaxTotal')
	// 			.ele('cbc:TaxAmount', { currencyID: 'JO' }).txt(taxAmountLine.toString()).up()
	// 			.up()

	// 			.ele('cac:LegalMonetaryTotal')
	// 			.ele('cbc:TaxExclusiveAmount', { currencyID: 'JO' }).txt(roundToNine(quantity * unitPrice).toString()).up()
	// 			.ele('cbc:TaxInclusiveAmount', { currencyID: 'JO' }).txt(roundingAmount.toString()).up()
	// 			.ele('cbc:AllowanceTotalAmount', { currencyID: 'JO' }).txt(roundToNine(allowance).toString()).up()
	// 			.ele('cbc:PayableAmount', { currencyID: 'JO' }).txt((roundingAmount - allowance).toString()).up()
	// 			.up();

	// 		invoice.items.forEach((item: any, index: number) => {
	// 			xml.ele('cac:InvoiceLine')
	// 				.ele('cbc:ID').txt((index + 1).toString()).up()
	// 				.ele('cbc:InvoicedQuantity', { unitCode: 'PCE' }).txt(quantity.toString()).up()
	// 				.ele('cbc:LineExtensionAmount', { currencyID: 'JO' }).txt(lineExtensionAmount.toString()).up()
	// 				.ele('cac:TaxTotal')
	// 				.ele('cbc:TaxAmount', { currencyID: 'JO' }).txt(taxAmountLine.toString()).up()
	// 				.ele('cac:TaxSubtotal')
	// 				.ele('cbc:TaxAmount', { currencyID: 'JO' }).txt(taxAmountLine.toString()).up()
	// 				.ele('cac:TaxCategory')
	// 				.ele('cbc:ID', { schemeAgencyID: '6', schemeID: 'UN/ECE 5305' }).txt('S').up()
	// 				.ele('cbc:Percent').txt(taxPercent.toString()).up()
	// 				.ele('cac:TaxScheme')
	// 				.ele('cbc:ID', { schemeAgencyID: '6', schemeID: 'UN/ECE 5153' }).txt('VAT').up()
	// 				.up()
	// 				.up()
	// 				.up()
	// 				.up()
	// 				.ele('cac:Item')
	// 				.ele('cbc:Name').txt(item.name || 'Default Item').up()
	// 				.up()
	// 				.ele('cac:Price')
	// 				.ele('cbc:PriceAmount', { currencyID: 'JO' }).txt(unitPrice.toString()).up()
	// 				.ele('cac:AllowanceCharge')
	// 				.ele('cbc:ChargeIndicator').txt('false').up()
	// 				.ele('cbc:AllowanceChargeReason').txt('DISCOUNT').up()
	// 				.ele('cbc:Amount', { currencyID: 'JO' }).txt(allowance.toString()).up()
	// 				.up()
	// 				.up()
	// 				.up();
	// 		});

	// 		return xml.end({ prettyPrint: true });
	// 	} catch (error) {
	// 		console.error('Error generating XML:', error);
	// 		return '';
	// 	}
	// }


	// convertToUbl(invoice: any, company: any): string {
	// 	const uuid = uuidv4();
	// 	const combinedUUID = `${uuid}${invoice.number}`;
	// 	const issueDate = new Date(invoice.issueDate).toISOString().split('T')[0];

	// 	const roundToNine = (num: number | string): string => {
	// 		return parseFloat(parseFloat(num as string).toFixed(9)).toFixed(9);
	// 	};

	// 	const unitPrice = 1;
	// 	const taxPercent = 16;
	// 	const quantity = 1;
	// 	const allowance = 0.1;

	// 	// Round allowance
	// 	const allowanceRounded = roundToNine(allowance);

	// 	// Calculate line extension amount
	// 	const lineExtensionAmount = roundToNine(quantity * (unitPrice - parseFloat(allowanceRounded)));

	// 	// Calculate tax amount for the line
	// 	const taxAmountLine = roundToNine(parseFloat(lineExtensionAmount) * taxPercent / 100);

	// 	// Calculate the total amount with rounding
	// 	const roundingAmount = roundToNine(parseFloat(lineExtensionAmount) + parseFloat(taxAmountLine));

	// 	const PayableAmount = roundingAmount

	// 	console.log(
	// 		allowanceRounded, lineExtensionAmount, taxAmountLine, roundingAmount
	// 	)

	// 	try {
	// 		const xml = create({ version: '1.0', encoding: 'UTF-8' })
	// 			.ele('Invoice', { xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2' })
	// 			.att('xmlns:cac', 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2')
	// 			.att('xmlns:cbc', 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2')
	// 			.att('xmlns:ext', 'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2')
	// 			.ele('cbc:ProfileID').txt('reporting:1.0').up()
	// 			.ele('cbc:ID').txt(invoice.number || 'EIN00090').up()
	// 			.ele('cbc:UUID').txt(combinedUUID).up()
	// 			.ele('cbc:IssueDate').txt(issueDate).up()
	// 			.ele('cbc:InvoiceTypeCode', { name: invoice.InvoiceTypeCodeName || '012' }).txt(invoice.invoiceTypeCode).up()
	// 			.ele('cbc:Note').txt(invoice.note || 'Default Note').up()
	// 			.ele('cbc:DocumentCurrencyCode').txt(invoice.documentCurrency || 'JOD').up()
	// 			.ele('cbc:TaxCurrencyCode').txt(invoice.taxCurrency || 'JOD').up()
	// 			.ele('cac:AccountingSupplierParty')
	// 			.ele('cac:Party')
	// 			.ele('cac:PostalAddress')
	// 			.ele('cac:Country')
	// 			.ele('cbc:IdentificationCode').txt('JO').up()
	// 			.up()
	// 			.up()
	// 			.ele('cac:PartyTaxScheme')
	// 			.ele('cbc:CompanyID').txt(company.taxNumber).up()
	// 			.ele('cac:TaxScheme')
	// 			.ele('cbc:ID').txt('VAT').up()
	// 			.up()
	// 			.up()
	// 			.ele('cac:PartyLegalEntity')
	// 			.ele('cbc:RegistrationName').txt(company.legalName).up()
	// 			.up()
	// 			.up()
	// 			.up()




	// 			.ele('cac:AccountingCustomerParty')
	// 			.ele('cac:Party')
	// 			.ele('cac:PartyIdentification')
	// 			.ele('cbc:ID', { schemeID: 'TN' }).txt('129341371').up()
	// 			.up()
	// 			.ele('cac:PostalAddress')
	// 			.ele('cbc:PostalZone').txt('11941').up()
	// 			.ele('cbc:CountrySubentityCode').txt('JO-AM').up()
	// 			.ele('cac:Country')
	// 			.ele('cbc:IdentificationCode').txt('JO').up()
	// 			.up()
	// 			.up()
	// 			.ele('cac:PartyTaxScheme')
	// 			.ele('cbc:CompanyID').txt('129341371').up()
	// 			.ele('cac:TaxScheme')
	// 			.ele('cbc:ID').txt('VAT').up()
	// 			.up()
	// 			.up()
	// 			.ele('cac:PartyLegalEntity')
	// 			.ele('cbc:RegistrationName').txt('شركو بابايا التجارية').up()
	// 			.up()
	// 			.up()
	// 			.ele('cac:AccountingContact')
	// 			.ele('cbc:Telephone').txt('324323434').up()
	// 			.up()
	// 			.up()


	// 			.ele('cac:SellerSupplierParty')
	// 			.ele('cac:Party')
	// 			.ele('cac:PartyIdentification')
	// 			.ele('cbc:ID').txt('14514141').up()
	// 			.up()
	// 			.up()
	// 			.up()


	// 			.ele('cac:AllowanceCharge')
	// 			.ele('cbc:ChargeIndicator').txt('false').up()
	// 			.ele('cbc:AllowanceChargeReason').txt('discount').up()
	// 			.ele('cbc:Amount', { currencyID: 'JO' }).txt(roundToNine(allowance).toString()).up()
	// 			.up()

	// 			.ele('cac:TaxTotal')
	// 			.ele('cbc:TaxAmount', { currencyID: 'JO' }).txt(taxAmountLine.toString()).up()
	// 			.up()

	// 			.ele('cac:LegalMonetaryTotal')
	// 			.ele('cbc:TaxExclusiveAmount', { currencyID: 'JO' }).txt(roundToNine(quantity * unitPrice).toString()).up()
	// 			.ele('cbc:TaxInclusiveAmount', { currencyID: 'JO' }).txt(roundingAmount.toString()).up()
	// 			.ele('cbc:AllowanceTotalAmount', { currencyID: 'JO' }).txt(allowanceRounded.toString()).up()
	// 			.ele('cbc:PayableAmount', { currencyID: 'JO' }).txt((PayableAmount).toString()).up()
	// 			.up();

	// 		invoice.items.forEach((item: any, index: number) => {
	// 			xml.ele('cac:InvoiceLine')
	// 				.ele('cbc:ID').txt((index + 1).toString()).up()
	// 				.ele('cbc:InvoicedQuantity', { unitCode: 'PCE' }).txt(quantity.toString()).up()
	// 				.ele('cbc:LineExtensionAmount', { currencyID: 'JO' }).txt(lineExtensionAmount.toString()).up()
	// 				.ele('cac:TaxTotal')
	// 				.ele('cbc:TaxAmount', { currencyID: 'JO' }).txt(taxAmountLine.toString()).up()
	// 				.ele('cac:TaxSubtotal')
	// 				.ele('cbc:TaxAmount', { currencyID: 'JO' }).txt(taxAmountLine.toString()).up()
	// 				.ele('cac:TaxCategory')
	// 				.ele('cbc:ID', { schemeAgencyID: '6', schemeID: 'UN/ECE 5305' }).txt('S').up()
	// 				.ele('cbc:Percent').txt(taxPercent.toString()).up()
	// 				.ele('cac:TaxScheme')
	// 				.ele('cbc:ID', { schemeAgencyID: '6', schemeID: 'UN/ECE 5153' }).txt('VAT').up()
	// 				.up()
	// 				.up()
	// 				.up()
	// 				.up()
	// 				.ele('cac:Item')
	// 				.ele('cbc:Name').txt(item.name || 'Default Item').up()
	// 				.up()
	// 				.ele('cac:Price')
	// 				.ele('cbc:PriceAmount', { currencyID: 'JO' }).txt(unitPrice.toString()).up()
	// 				.ele('cac:AllowanceCharge')
	// 				.ele('cbc:ChargeIndicator').txt('false').up()
	// 				.ele('cbc:AllowanceChargeReason').txt('DISCOUNT').up()
	// 				.ele('cbc:Amount', { currencyID: 'JO' }).txt(allowance.toString()).up()
	// 				.up()
	// 				.up()
	// 				.up();
	// 		});

	// 		return xml.end({ prettyPrint: true });
	// 	} catch (error) {
	// 		console.error('Error generating XML:', error);
	// 		return '';
	// 	}
	// }


	// better than before
	convertToUbl(invoice: any, company: any): string {
		const uuid = uuidv4();
		const combinedUUID = `${uuid}${invoice.number}`;
		const issueDate = new Date(invoice.issueDate).toISOString().split('T')[0];

		const roundToNine = (num: number | string): string => {
			return parseFloat(parseFloat(num as string).toFixed(9)).toFixed(9);
		};

		const unitPrice = 1;
		const taxPercent = 16;
		const quantity = 1;
		const allowance = 0.1;

		// Round allowance
		const allowanceRounded = roundToNine(allowance);

		// Calculate line extension amount
		const lineExtensionAmount = roundToNine(quantity * (unitPrice - parseFloat(allowanceRounded)));

		// Calculate tax amount for the line
		const taxAmountLine = roundToNine(parseFloat(lineExtensionAmount) * taxPercent / 100);

		// Calculate the total amount with rounding
		const roundingAmount = roundToNine(parseFloat(lineExtensionAmount) + parseFloat(taxAmountLine));

		const PayableAmount = roundingAmount

		console.log(
			allowanceRounded, lineExtensionAmount, taxAmountLine, roundingAmount
		)

		try {
			const xml = create({ version: '1.0', encoding: 'UTF-8' })
				.ele('Invoice', { xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2' })
				.att('xmlns:cac', 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2')
				.att('xmlns:cbc', 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2')
				.att('xmlns:ext', 'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2')
				.ele('cbc:ProfileID').txt('reporting:1.0').up()
				.ele('cbc:ID').txt(invoice.number || 'EIN00090').up()
				.ele('cbc:UUID').txt(combinedUUID).up()
				.ele('cbc:IssueDate').txt(issueDate).up()
				.ele('cbc:InvoiceTypeCode', { name: invoice.InvoiceTypeCodeName || '012' }).txt(invoice.invoiceTypeCode).up()
				.ele('cbc:Note').txt(invoice.note || 'Default Note').up()
				.ele('cbc:DocumentCurrencyCode').txt(invoice.documentCurrency || 'JOD').up()
				.ele('cbc:TaxCurrencyCode').txt(invoice.taxCurrency || 'JOD').up()


				.ele('cac:AccountingSupplierParty')
				.ele('cac:Party')
				.ele('cac:PostalAddress')
				.ele('cac:Country')
				.ele('cbc:IdentificationCode').txt('JO').up()
				.up()
				.up()
				.ele('cac:PartyTaxScheme')
				.ele('cbc:CompanyID').txt(company.taxNumber).up()
				.ele('cac:TaxScheme')
				.ele('cbc:ID').txt('VAT').up()
				.up()
				.up()
				.ele('cac:PartyLegalEntity')
				.ele('cbc:RegistrationName').txt(company.legalName).up()
				.up()
				.up()
				.up()




				.ele('cac:AccountingCustomerParty')
				.ele('cac:Party')
				.ele('cac:PartyIdentification')
				.ele('cbc:ID', { schemeID: 'TN' }).txt('129341371').up()
				.up()
				.ele('cac:PostalAddress')
				.ele('cbc:PostalZone').txt('11941').up()
				.ele('cbc:CountrySubentityCode').txt('JO-AM').up()
				.ele('cac:Country')
				.ele('cbc:IdentificationCode').txt('JO').up()
				.up()
				.up()
				.ele('cac:PartyTaxScheme')
				.ele('cbc:CompanyID').txt('129341371').up()
				.ele('cac:TaxScheme')
				.ele('cbc:ID').txt('VAT').up()
				.up()
				.up()
				.ele('cac:PartyLegalEntity')
				.ele('cbc:RegistrationName').txt('شركو بابايا التجارية').up()
				.up()
				.up()
				.ele('cac:AccountingContact')
				.ele('cbc:Telephone').txt('324323434').up()
				.up()
				.up()


				.ele('cac:SellerSupplierParty')
				.ele('cac:Party')
				.ele('cac:PartyIdentification')
				.ele('cbc:ID').txt('14514141').up()
				.up()
				.up()
				.up()


				.ele('cac:AllowanceCharge')
				.ele('cbc:ChargeIndicator').txt('false').up()
				.ele('cbc:AllowanceChargeReason').txt('discount').up()
				.ele('cbc:Amount', { currencyID: 'JO' }).txt(roundToNine(allowance).toString()).up()
				.up()

				.ele('cac:TaxTotal')
				.ele('cbc:TaxAmount', { currencyID: 'JO' }).txt(taxAmountLine.toString()).up()
				.up()

				.ele('cac:LegalMonetaryTotal')
				.ele('cbc:TaxExclusiveAmount', { currencyID: 'JO' }).txt(roundToNine(quantity * unitPrice).toString()).up()
				.ele('cbc:TaxInclusiveAmount', { currencyID: 'JO' }).txt(roundingAmount.toString()).up()
				.ele('cbc:AllowanceTotalAmount', { currencyID: 'JO' }).txt(allowanceRounded.toString()).up()
				.ele('cbc:PayableAmount', { currencyID: 'JO' }).txt((PayableAmount).toString()).up()
				.up();

			invoice.items.forEach((item: any, index: number) => {
				xml.ele('cac:InvoiceLine')
					.ele('cbc:ID').txt((index + 1).toString()).up()
					.ele('cbc:InvoicedQuantity', { unitCode: 'PCE' }).txt(quantity.toString()).up()
					.ele('cbc:LineExtensionAmount', { currencyID: 'JO' }).txt(lineExtensionAmount.toString()).up()
					.ele('cac:TaxTotal')
					.ele('cbc:TaxAmount', { currencyID: 'JO' }).txt(taxAmountLine.toString()).up()
					.ele('cac:TaxSubtotal')
					.ele('cbc:TaxAmount', { currencyID: 'JO' }).txt(taxAmountLine.toString()).up()
					.ele('cac:TaxCategory')
					.ele('cbc:ID', { schemeAgencyID: '6', schemeID: 'UN/ECE 5305' }).txt('S').up()
					.ele('cbc:Percent').txt(taxPercent.toString()).up()
					.ele('cac:TaxScheme')
					.ele('cbc:ID', { schemeAgencyID: '6', schemeID: 'UN/ECE 5153' }).txt('VAT').up()
					.up()
					.up()
					.up()
					.up()
					.ele('cac:Item')
					.ele('cbc:Name').txt(item.name || 'Default Item').up()
					.up()
					.ele('cac:Price')
					.ele('cbc:PriceAmount', { currencyID: 'JO' }).txt(unitPrice.toString()).up()
					.ele('cac:AllowanceCharge')
					.ele('cbc:ChargeIndicator').txt('false').up()
					.ele('cbc:AllowanceChargeReason').txt('DISCOUNT').up()
					.ele('cbc:Amount', { currencyID: 'JO' }).txt(allowance.toString()).up()
					.up()
					.up()
					.up();
			});

			return xml.end({ prettyPrint: true });
		} catch (error) {
			console.error('Error generating XML:', error);
			return '';
		}
	}


	// convertToUbl(invoice: any, company: any): string {
	// 	const uuid = uuidv4();
	// 	const combinedUUID = `${uuid}${invoice.number}`;
	// 	const issueDate = new Date(invoice.issueDate).toISOString().split('T')[0];

	// 	// Utility function to round numbers to 9 decimal places
	// 	const roundToNine = (num: number): string => {
	// 		return parseFloat(num.toFixed(9)).toFixed(9);
	// 	};

	// 	// Ensure lineItems is defined and not empty
	// 	const lineItems = invoice.items || [];
	// 	if (lineItems.length === 0) {
	// 		throw new Error("Invoice must contain at least one line item.");
	// 	}

	// 	// Default tax percentage
	// 	const taxPercent = 16;

	// 	let totalTax = 0;
	// 	let totalAmount = 0;
	// 	let totalAllowanceChargeAmount = 0;

	// 	// Process each line item with validation checks
	// 	const lines = lineItems.map((item, index) => {
	// 		const unitPrice = item.unitPrice || 0;
	// 		const quantity = item.quantity || 1;
	// 		const allowance = item.discount || 0; // Allowance can be discount
	// 		const allowanceRounded = roundToNine(allowance);

	// 		// Ensure the operands are numbers before performing arithmetic
	// 		const unitPriceNum = parseFloat(unitPrice.toString());
	// 		const allowanceNum = parseFloat(allowanceRounded);
	// 		const quantityNum = parseFloat(quantity.toString());

	// 		// Validate that the properties are valid numbers
	// 		if (isNaN(unitPriceNum) || isNaN(quantityNum) || isNaN(allowanceNum)) {
	// 			throw new Error(`Invalid values in line item ${index + 1}: unitPrice, quantity, and allowance must be numbers.`);
	// 		}

	// 		// Calculate line extension amount
	// 		const lineExtensionAmount = roundToNine(quantityNum * (unitPriceNum - allowanceNum));

	// 		// Calculate tax amount for the line
	// 		const taxAmountLine = roundToNine(parseFloat(lineExtensionAmount) * taxPercent / 100);

	// 		// Calculate the total amount with rounding
	// 		const roundingAmount = roundToNine(parseFloat(lineExtensionAmount) + parseFloat(taxAmountLine));

	// 		totalTax += parseFloat(taxAmountLine);
	// 		totalAmount += parseFloat(roundingAmount);
	// 		totalAllowanceChargeAmount += allowanceNum;

	// 		return {
	// 			unitPrice: roundToNine(unitPriceNum),
	// 			quantity: quantityNum,
	// 			discount: allowance,
	// 			lineExtensionAmount,
	// 			taxAmount: taxAmountLine,
	// 			roundingAmount,
	// 			allowanceChargeAmount: allowanceRounded
	// 		};
	// 	});

	// 	const invoiceTotals = {
	// 		allowanceChargeAmount: roundToNine(totalAllowanceChargeAmount),
	// 		taxAmount: roundToNine(totalTax),
	// 		taxExclusiveAmount: roundToNine(totalAmount - totalTax),  // Subtract numbers, not strings
	// 		taxInclusiveAmount: roundToNine(totalAmount),
	// 		payableAmount: roundToNine(totalAmount)
	// 	};

	// 	// Construct the XML document
	// 	try {
	// 		const xml = create({ version: '1.0', encoding: 'UTF-8' })
	// 			.ele('Invoice', { xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2' })
	// 			.att('xmlns:cac', 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2')
	// 			.att('xmlns:cbc', 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2')
	// 			.att('xmlns:ext', 'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2')
	// 			.ele('cbc:ProfileID').txt('reporting:1.0').up()
	// 			.ele('cbc:ID').txt(invoice.number || 'EIN00090').up()
	// 			.ele('cbc:UUID').txt(combinedUUID).up()
	// 			.ele('cbc:IssueDate').txt(issueDate).up()
	// 			.ele('cbc:InvoiceTypeCode', { name: invoice.InvoiceTypeCodeName || '012' }).txt(invoice.invoiceTypeCode).up()
	// 			.ele('cbc:Note').txt(invoice.note || 'Default Note').up()
	// 			.ele('cbc:DocumentCurrencyCode').txt(invoice.documentCurrency || 'JOD').up()
	// 			.ele('cbc:TaxCurrencyCode').txt(invoice.taxCurrency || 'JOD').up()


	// 			.ele('cac:AccountingSupplierParty')
	// 			.ele('cac:Party')
	// 			.ele('cac:PostalAddress')
	// 			.ele('cac:Country')
	// 			.ele('cbc:IdentificationCode').txt('JO').up()
	// 			.up()
	// 			.up()
	// 			.ele('cac:PartyTaxScheme')
	// 			.ele('cbc:CompanyID').txt(company.taxNumber).up()
	// 			.ele('cac:TaxScheme')
	// 			.ele('cbc:ID').txt('VAT').up()
	// 			.up()
	// 			.up()
	// 			.ele('cac:PartyLegalEntity')
	// 			.ele('cbc:RegistrationName').txt(company.legalName).up()
	// 			.up()
	// 			.up()
	// 			.up()




	// 			.ele('cac:AccountingCustomerParty')
	// 			.ele('cac:Party')
	// 			.ele('cac:PartyIdentification')
	// 			.ele('cbc:ID', { schemeID: 'TN' }).txt('129341371').up()
	// 			.up()
	// 			.ele('cac:PostalAddress')
	// 			.ele('cbc:PostalZone').txt('11941').up()
	// 			.ele('cbc:CountrySubentityCode').txt('JO-AM').up()
	// 			.ele('cac:Country')
	// 			.ele('cbc:IdentificationCode').txt('JO').up()
	// 			.up()
	// 			.up()
	// 			.ele('cac:PartyTaxScheme')
	// 			.ele('cbc:CompanyID').txt('129341371').up()
	// 			.ele('cac:TaxScheme')
	// 			.ele('cbc:ID').txt('VAT').up()
	// 			.up()
	// 			.up()
	// 			.ele('cac:PartyLegalEntity')
	// 			.ele('cbc:RegistrationName').txt('شركو بابايا التجارية').up()
	// 			.up()
	// 			.up()
	// 			.ele('cac:AccountingContact')
	// 			.ele('cbc:Telephone').txt('324323434').up()
	// 			.up()
	// 			.up()


	// 			.ele('cac:SellerSupplierParty')
	// 			.ele('cac:Party')
	// 			.ele('cac:PartyIdentification')
	// 			.ele('cbc:ID').txt('14514141').up()
	// 			.up()
	// 			.up()
	// 			.up()



	// 			// Add line items (InvoiceLine)
	// 			.ele('cac:InvoiceLine')
	// 			.ele('cbc:ID').txt('1').up() // Line ID
	// 			.ele('cbc:InvoicedQuantity').txt(lines[0].quantity).up()  // Example line item quantity
	// 			.ele('cbc:LineExtensionAmount').txt(lines[0].lineExtensionAmount).up()
	// 			.ele('cac:Item')
	// 			.ele('cbc:Description').txt('Product Description').up() // Description
	// 			.ele('cbc:Name').txt('Product Name').up() // Product name
	// 			.up()
	// 			.ele('cac:Price')
	// 			.ele('cbc:PriceAmount').txt(lines[0].unitPrice).up() // Unit price
	// 			.up()
	// 			.up()

	// 			// Totals section
	// 			.ele('cac:TaxTotal')
	// 			.ele('cbc:TaxAmount').txt(invoiceTotals.taxAmount).up()
	// 			.up()
	// 			.ele('cac:LegalMonetaryTotal')
	// 			.ele('cbc:LineExtensionAmount').txt(invoiceTotals.taxExclusiveAmount).up()
	// 			.ele('cbc:TaxInclusiveAmount').txt(invoiceTotals.taxInclusiveAmount).up()
	// 			.ele('cbc:PayableAmount').txt(invoiceTotals.payableAmount).up()
	// 			.up()
	// 			.up()

	// 			.end({ prettyPrint: true }); // Pretty print the XML

	// 		return xml;
	// 	} catch (error) {
	// 		throw new Error(`Failed to generate UBL XML: ${error.message}`);
	// 	}
	// }




}



