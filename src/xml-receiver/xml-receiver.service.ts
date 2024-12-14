import { HttpService } from '@nestjs/axios';
import { create } from 'xmlbuilder2';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { response } from 'express';

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
			console.log(xmlData);

			const encodedXml = Buffer.from(xmlData, 'utf-8').toString('base64');

			const payload = { invoice: encodedXml };

			const response = await this.httpService
				.post('https://backend.jofotara.gov.jo/core/invoices/', payload, {
					headers: {
						'Client-Id': '454e11a1-1a10-4212-b4b3-8e28fd9a75c8',
						'Secret-Key':
							'Gj5nS9wyYHRadaVffz5VKB4v4wlVWyPhcJvrTD4NHtN9Z8Pl9XB+9O9xiTjI14ZTg/+1TpPX6hUagPbcqs8CBaDeq8LlqrnOFJCGq4QhZmMWs5xPcOifs6J/tEWwLY6dFp9atVEHylU8huJc766XqxmRUc8YoUHuwANR0owYYMgj/QrdBBcb/1Dr8eOdZKkUNf58lweIokCEmJJuBbrxHU+caKwp/EN9dp7/jolXX/b5FEc4FyOwW5W8sm/YbOMx+hzjg1Dn0cbgbJ6v3LZf5Q==',
						'Content-Type': 'application/json',
					},
				})
				.toPromise();

			console.log('API Response:', response.data);
			return response.data;
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

	}


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
		const discount = 0.1;

		const unitPriceRounded = roundToNine(unitPrice);
		const lineExtensionAmount = roundToNine(quantity * (unitPrice - discount));
		const taxAmountLine = roundToNine(
			(parseFloat(lineExtensionAmount) * taxPercent) / 100,
		);
		const TaxExclusiveAmount = roundToNine(unitPrice * quantity);
		const TaxInclusiveAmount = roundToNine(
			parseFloat(TaxExclusiveAmount) + parseFloat(taxAmountLine),
		);

		const allowanceRounded = roundToNine(allowance);
		const PayableAmount = roundToNine(
			parseFloat(TaxInclusiveAmount) - parseFloat(allowanceRounded),
		);

		const RoundingAmount = PayableAmount;

		console.log({
			UUID: `Unique Identifier: ${uuid}`,
			CombinedUUID: `Combined UUID with Invoice Number: ${combinedUUID}`,
			IssueDate: `Invoice Issue Date (formatted): ${issueDate}`,
			UnitPrice: `Price per unit: ${unitPrice}`,
			TaxPercent: `Tax percentage applied: ${taxPercent}%`,
			Quantity: `Quantity of items: ${quantity}`,
			Allowance: `Allowance applied: ${allowance}`,
			Discount: `Discount applied: ${discount}`,
			LineExtensionAmount: `Line extension amount (base after discount): ${lineExtensionAmount}`,
			TaxAmountLine: `Tax amount for the line: ${taxAmountLine}`,
			TaxExclusiveAmount: `Total amount without tax: ${TaxExclusiveAmount}`,
			TaxInclusiveAmount: `Total amount including tax: ${TaxInclusiveAmount}`,
			RoundingAmount: `Rounded amount (line + tax): ${RoundingAmount}`,
			AllowanceRounded: `Allowance rounded to 9 decimals: ${allowanceRounded}`,
			PayableAmount: `Final payable amount: ${PayableAmount}`,
		});

		try {
			const xml = create({ version: '1.0', encoding: 'UTF-8' })
				.ele('Invoice', {
					xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
				})
				.att(
					'xmlns:cac',
					'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
				)
				.att(
					'xmlns:cbc',
					'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
				)
				.att(
					'xmlns:ext',
					'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2',
				)
				.ele('cbc:ProfileID')
				.txt('reporting:1.0')
				.up()
				.ele('cbc:ID')
				.txt(invoice.number || 'EIN00090')
				.up()
				.ele('cbc:UUID')
				.txt(combinedUUID)
				.up()
				.ele('cbc:IssueDate')
				.txt(issueDate)
				.up()
				.ele('cbc:InvoiceTypeCode', {
					name: invoice.InvoiceTypeCodeName || '012',
				})
				.txt(invoice.invoiceTypeCode)
				.up()
				.ele('cbc:Note')
				.txt(invoice.note || 'Default Note')
				.up()
				.ele('cbc:DocumentCurrencyCode')
				.txt(invoice.documentCurrency || 'JOD')
				.up()
				.ele('cbc:TaxCurrencyCode')
				.txt(invoice.taxCurrency || 'JOD')
				.up()

				.ele('cac:AccountingSupplierParty')
				.ele('cac:Party')
				.ele('cac:PostalAddress')
				.ele('cac:Country')
				.ele('cbc:IdentificationCode')
				.txt('JO')
				.up()
				.up()
				.up()
				.ele('cac:PartyTaxScheme')
				.ele('cbc:CompanyID')
				.txt(company.taxNumber)
				.up()
				.ele('cac:TaxScheme')
				.ele('cbc:ID')
				.txt('VAT')
				.up()
				.up()
				.up()
				.ele('cac:PartyLegalEntity')
				.ele('cbc:RegistrationName')
				.txt(company.legalName)
				.up()
				.up()
				.up()
				.up()

				.ele('cac:AccountingCustomerParty')
				.ele('cac:Party')
				.ele('cac:PartyIdentification')
				.ele('cbc:ID', { schemeID: 'TN' })
				.txt('129341371')
				.up()
				.up()
				.ele('cac:PostalAddress')
				.ele('cbc:PostalZone')
				.txt('11941')
				.up()
				.ele('cbc:CountrySubentityCode')
				.txt('JO-AM')
				.up()
				.ele('cac:Country')
				.ele('cbc:IdentificationCode')
				.txt('JO')
				.up()
				.up()
				.up()
				.ele('cac:PartyTaxScheme')
				.ele('cbc:CompanyID')
				.txt('129341371')
				.up()
				.ele('cac:TaxScheme')
				.ele('cbc:ID')
				.txt('VAT')
				.up()
				.up()
				.up()
				.ele('cac:PartyLegalEntity')
				.ele('cbc:RegistrationName')
				.txt('شركو بابايا التجارية')
				.up()
				.up()
				.up()
				.ele('cac:AccountingContact')
				.ele('cbc:Telephone')
				.txt('324323434')
				.up()
				.up()
				.up()

				.ele('cac:SellerSupplierParty')
				.ele('cac:Party')
				.ele('cac:PartyIdentification')
				.ele('cbc:ID')
				.txt('14514141')
				.up()
				.up()
				.up()
				.up()

				.ele('cac:AllowanceCharge')
				.ele('cbc:ChargeIndicator')
				.txt('false')
				.up()
				.ele('cbc:AllowanceChargeReason')
				.txt('discount')
				.up()
				.ele('cbc:Amount', { currencyID: 'JO' })
				.txt(allowanceRounded)
				.up()
				.up()

				.ele('cac:TaxTotal')
				.ele('cbc:TaxAmount', { currencyID: 'JO' })
				.txt(taxAmountLine)
				.up()
				.up()

				.ele('cac:LegalMonetaryTotal')
				.ele('cbc:TaxExclusiveAmount', { currencyID: 'JO' })
				.txt(TaxExclusiveAmount)
				.up()
				.ele('cbc:TaxInclusiveAmount', { currencyID: 'JO' })
				.txt(TaxInclusiveAmount)
				.up()

				.ele('cbc:AllowanceTotalAmount', { currencyID: 'JO' })
				.txt(allowanceRounded)
				.up()

				.ele('cbc:PayableAmount', { currencyID: 'JO' })
				.txt(PayableAmount.toString())
				.up()
				.up();

			invoice.items.forEach((item: any, index: number) => {
				xml
					.ele('cac:InvoiceLine')
					.ele('cbc:ID')
					.txt((index + 1).toString())
					.up()
					.ele('cbc:InvoicedQuantity', { unitCode: 'PCE' })
					.txt(quantity.toString())
					.up()
					.ele('cbc:LineExtensionAmount', { currencyID: 'JO' })
					.txt(lineExtensionAmount.toString())
					.up()

					.ele('cac:TaxTotal')
					.ele('cbc:TaxAmount', { currencyID: 'JO' })
					.txt(taxAmountLine)
					.up()

					.ele('cbc:RoundingAmount', { currencyID: 'JO' })
					.txt(RoundingAmount)
					.up()

					.ele('cac:TaxSubtotal')
					.ele('cbc:TaxAmount', { currencyID: 'JO' })
					.txt(taxAmountLine)
					.up()
					.ele('cac:TaxCategory')
					.ele('cbc:ID', { schemeAgencyID: '6', schemeID: 'UN/ECE 5305' })
					.txt('S')
					.up()
					.ele('cbc:Percent')
					.txt(taxPercent.toString())
					.up()
					.ele('cac:TaxScheme')
					.ele('cbc:ID', { schemeAgencyID: '6', schemeID: 'UN/ECE 5153' })
					.txt('VAT')
					.up()
					.up()
					.up()
					.up()
					.up()
					.ele('cac:Item')
					.ele('cbc:Name')
					.txt(item.name || 'Default Item')
					.up()
					.up()
					.ele('cac:Price')
					.ele('cbc:PriceAmount', { currencyID: 'JO' })
					.txt(unitPriceRounded)
					.up()
					.ele('cac:AllowanceCharge')
					.ele('cbc:ChargeIndicator')
					.txt('false')
					.up()
					.ele('cbc:AllowanceChargeReason')
					.txt('DISCOUNT')
					.up()
					.ele('cbc:Amount', { currencyID: 'JO' })
					.txt(allowanceRounded)
					.up()
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
}
