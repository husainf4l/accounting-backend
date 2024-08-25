import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Check if the company already exists
    const existingCompany = await prisma.company.findUnique({
        where: {
            email: 'info@acme.com',
        },
    });

    let company;

    if (!existingCompany) {
        // Create a Company
        company = await prisma.company.create({
            data: {
                name: 'Acme Corporation',
                address: '123 Main St, Anytown, USA',
                phone: '+1-800-555-1234',
                email: 'info@acme.com',
                taxId: 'ACME123456',
                fiscalYearStart: new Date('2024-01-01T00:00:00.000Z'),
                fiscalYearEnd: new Date('2024-12-31T23:59:59.000Z'),
                currency: 'USD',
            },
        });
    } else {
        company = existingCompany;
    }

    // Create a User (who will be the creator of transactions)
    const user = await prisma.user.create({
        data: {
            email: 'john.doe@acme.com',
            password: 'hashed-password', // Replace this with a properly hashed password
            firstName: 'John',
            lastName: 'Doe',
        },
    });

    // Create Accounts
    const cash = await prisma.account.create({
        data: {
            name: 'Cash',
            type: 'ASSET',
            subtype: 'CURRENT_ASSET',
            number: '1001',
            balance: 10000,
            openingBalance: 0,
            currency: 'USD',
            company: { connect: { id: company.id } },
        },
    });

    const salesRevenue = await prisma.account.create({
        data: {
            name: 'Sales Revenue',
            type: 'REVENUE',
            number: '4001',
            balance: 0,
            openingBalance: 0,
            currency: 'USD',
            company: { connect: { id: company.id } },
        },
    });

    const inventory = await prisma.account.create({
        data: {
            name: 'Inventory',
            type: 'ASSET',
            subtype: 'CURRENT_ASSET',
            number: '1200',
            balance: 5000,
            openingBalance: 5000,
            currency: 'USD',
            company: { connect: { id: company.id } },
        },
    });

    const accountsReceivable = await prisma.account.create({
        data: {
            name: 'Accounts Receivable',
            type: 'ASSET',
            subtype: 'CURRENT_ASSET',
            number: '1100',
            balance: 0,
            openingBalance: 0,
            currency: 'USD',
            company: { connect: { id: company.id } },
        },
    });

    // Create a Customer
    const customer = await prisma.customer.create({
        data: {
            name: 'John Smith',
            email: 'john.smith@example.com',
            company: { connect: { id: company.id } },
        },
    });

    // Create an Item
    const item = await prisma.item.create({
        data: {
            name: 'Widget A',
            description: 'A high-quality widget',
            unitPrice: 100,
            quantityOnHand: 50,
            sku: 'WIDGETA',
            company: { connect: { id: company.id } },
        },
    });

    // Create an Invoice
    const invoice = await prisma.invoice.create({
        data: {
            invoiceNumber: 'INV-001',
            amount: 1000,
            dueDate: new Date('2024-12-31T00:00:00.000Z'),
            paid: false,
            currency: 'USD',
            customer: { connect: { id: customer.id } },
            company: { connect: { id: company.id } },
            createdBy: user.id,  // Creator
            updatedBy: user.id,  // Updater
            lineItems: {
                create: [
                    {
                        description: 'Widget A',
                        quantity: 10,
                        unitPrice: 100,
                        amount: 1000,
                        item: { connect: { id: item.id } },
                    },
                ],
            },
        },
    });

    // Create a Transaction
    const transaction = await prisma.transaction.create({
        data: {
            date: new Date('2024-01-15T00:00:00.000Z'),
            description: 'Sale of goods',
            totalAmount: 10000,  // $10,000 sale
            currency: 'USD',
            account: { connect: { id: cash.id } },
            company: { connect: { id: company.id } },
            createdBy: user.id,  // Creator
            updatedBy: user.id,  // Updater
            lineItems: {
                create: [
                    {
                        description: 'Cash from sales',
                        amount: 10000,
                        debit: true,
                        account: { connect: { id: cash.id } },
                    },
                    {
                        description: 'Sales revenue',
                        amount: 10000,
                        debit: false,
                        account: { connect: { id: salesRevenue.id } },
                    },
                ],
            },
        },
    });

    console.log('Seed data created:');
    console.log({ company, user, cash, salesRevenue, inventory, accountsReceivable, customer, item, invoice, transaction });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
