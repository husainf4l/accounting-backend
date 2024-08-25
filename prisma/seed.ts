// import { PrismaClient } from '@prisma/client';
// import { hash } from 'bcrypt';

// const prisma = new PrismaClient();

// async function main() {
//     // Create a company
//     const company = await prisma.company.create({
//         data: {
//             name: 'Acme Corporation',
//             address: '123 Main St, Anytown, USA',
//             phone: '+1-800-555-1234',
//             email: 'info@acme.com',
//             taxId: 'ACME123456',
//             fiscalYearStart: new Date('2024-01-01T00:00:00.000Z'),
//             fiscalYearEnd: new Date('2024-12-31T23:59:59.000Z'),
//             currency: 'USD',
//         },
//     });

//     // Create a user
//     const user = await prisma.user.create({
//         data: {
//             email: 'john.doe@acme.com',
//             password: await hash('password123', 10),
//             firstName: 'John',
//             lastName: 'Doe',
//             companies: {
//                 create: {
//                     companyId: company.id,
//                     role: 'ADMIN',
//                     accessLevel: 'FULL_ACCESS',
//                     permissions: {},
//                 },
//             },
//         },
//     });

//     // Create accounts
//     const cashAccount = await prisma.account.create({
//         data: {
//             name: 'Cash',
//             type: 'ASSET',
//             subtype: 'CURRENT_ASSET',
//             number: '1001',
//             balance: 10000,
//             currency: 'USD',
//             companyId: company.id,
//         },
//     });

//     const salesAccount = await prisma.account.create({
//         data: {
//             name: 'Sales',
//             type: 'REVENUE',
//             number: '4001',
//             balance: 0,
//             currency: 'USD',
//             companyId: company.id,
//         },
//     });

//     // Create a customer
//     const customer = await prisma.customer.create({
//         data: {
//             name: 'John Smith',
//             email: 'john.smith@example.com',
//             companyId: company.id,
//         },
//     });

//     // Create an item
//     const item = await prisma.item.create({
//         data: {
//             name: 'Widget A',
//             description: 'A high-quality widget',
//             unitPrice: 100,
//             quantityOnHand: 50,
//             sku: 'WIDGETA',
//             companyId: company.id,
//         },
//     });

//     // Create an invoice
//     const invoice = await prisma.invoice.create({
//         data: {
//             invoiceNumber: 'INV-001',
//             amount: 1000,
//             dueDate: new Date('2024-12-31T00:00:00.000Z'),
//             paid: false,
//             currency: 'USD',
//             customerId: customer.id,
//             companyId: company.id,
//             createdBy: user.id,
//             updatedBy: user.id,
//             lineItems: {
//                 create: [
//                     {
//                         description: 'Widget A',
//                         quantity: 10,
//                         unitPrice: 100,
//                         amount: 1000,
//                         itemId: item.id,
//                     },
//                 ],
//             },
//         },
//     });

//     console.log('Seed data created:', { company, user, cashAccount, salesAccount, customer, item, invoice });
// }

// main()
//     .catch((e) => {
//         console.error(e);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });
