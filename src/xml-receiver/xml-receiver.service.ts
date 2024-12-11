import { Injectable } from '@nestjs/common';
import { parseStringPromise } from 'xml2js'; // Import xml2js to parse XML data

@Injectable()
export class XmlReceiverService {

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
}
