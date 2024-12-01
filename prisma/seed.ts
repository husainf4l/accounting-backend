import { PrismaClient, AccountType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Chart of Accounts...');

    // Asset Accounts
    await prisma.account.createMany({
        data: [
            { accountNumber: '100000', groupCode: 'ASSET', name: 'Cash', accountType: 'ASSET', currentBalance: 0 },
            { accountNumber: '101000', groupCode: 'ASSET', name: 'Bank', accountType: 'ASSET', currentBalance: 0 },
            { accountNumber: '102000', groupCode: 'ASSET', name: 'Accounts Receivable', accountType: 'ASSET', currentBalance: 0 },
            { accountNumber: '103000', groupCode: 'ASSET', name: 'Inventory', accountType: 'ASSET', currentBalance: 0 },
            { accountNumber: '104000', groupCode: 'ASSET', name: 'Prepaid Expenses', accountType: 'ASSET', currentBalance: 0 },
            { accountNumber: '105000', groupCode: 'ASSET', name: 'Fixed Assets', accountType: 'ASSET', currentBalance: 0 },
            { accountNumber: '106000', groupCode: 'ASSET', name: 'Accumulated Depreciation', accountType: 'ASSET', currentBalance: 0 },
        ],
    });

    // Liability Accounts
    await prisma.account.createMany({
        data: [
            { accountNumber: '200000', groupCode: 'LIABILITY', name: 'Accounts Payable', accountType: 'LIABILITY', currentBalance: 0 },
            { accountNumber: '201000', groupCode: 'LIABILITY', name: 'Accrued Liabilities', accountType: 'LIABILITY', currentBalance: 0 },
            { accountNumber: '202000', groupCode: 'LIABILITY', name: 'Short-Term Loans', accountType: 'LIABILITY', currentBalance: 0 },
            { accountNumber: '203000', groupCode: 'LIABILITY', name: 'Long-Term Loans', accountType: 'LIABILITY', currentBalance: 0 },
            { accountNumber: '204000', groupCode: 'LIABILITY', name: 'Deferred Revenue', accountType: 'LIABILITY', currentBalance: 0 },
        ],
    });

    // Equity Accounts
    await prisma.account.createMany({
        data: [
            { accountNumber: '300000', groupCode: 'EQUITY', name: 'Capital Stock', accountType: 'EQUITY', currentBalance: 0 },
            { accountNumber: '301000', groupCode: 'EQUITY', name: 'Retained Earnings', accountType: 'EQUITY', currentBalance: 0 },
            { accountNumber: '302000', groupCode: 'EQUITY', name: 'Dividends', accountType: 'EQUITY', currentBalance: 0 },
        ],
    });

    // Revenue Accounts
    await prisma.account.createMany({
        data: [
            { accountNumber: '400000', groupCode: 'REVENUE', name: 'Sales Revenue', accountType: 'REVENUE', currentBalance: 0 },
            { accountNumber: '401000', groupCode: 'REVENUE', name: 'Service Revenue', accountType: 'REVENUE', currentBalance: 0 },
            { accountNumber: '402000', groupCode: 'REVENUE', name: 'Other Revenue', accountType: 'REVENUE', currentBalance: 0 },
        ],
    });

    // Expense Accounts
    await prisma.account.createMany({
        data: [
            { accountNumber: '500000', groupCode: 'EXPENSE', name: 'Cost of Goods Sold', accountType: 'EXPENSE', currentBalance: 0 },
            { accountNumber: '501000', groupCode: 'EXPENSE', name: 'Salaries and Wages', accountType: 'EXPENSE', currentBalance: 0 },
            { accountNumber: '502000', groupCode: 'EXPENSE', name: 'Rent Expense', accountType: 'EXPENSE', currentBalance: 0 },
            { accountNumber: '503000', groupCode: 'EXPENSE', name: 'Utilities Expense', accountType: 'EXPENSE', currentBalance: 0 },
            { accountNumber: '504000', groupCode: 'EXPENSE', name: 'Office Supplies', accountType: 'EXPENSE', currentBalance: 0 },
            { accountNumber: '505000', groupCode: 'EXPENSE', name: 'Depreciation Expense', accountType: 'EXPENSE', currentBalance: 0 },
            { accountNumber: '506000', groupCode: 'EXPENSE', name: 'Insurance Expense', accountType: 'EXPENSE', currentBalance: 0 },
            { accountNumber: '507000', groupCode: 'EXPENSE', name: 'Advertising Expense', accountType: 'EXPENSE', currentBalance: 0 },
            { accountNumber: '508000', groupCode: 'EXPENSE', name: 'Interest Expense', accountType: 'EXPENSE', currentBalance: 0 },
        ],
    });

    console.log('Seeding Complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
