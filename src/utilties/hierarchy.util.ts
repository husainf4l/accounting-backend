import { PrismaClient } from '@prisma/client';

export async function generateCode(
    prisma: PrismaClient,
    parentAccountId: string,
    companyId: string
): Promise<string> {
    let code: string;
    let conflictExists: boolean;

    // Fetch the code of the parent account
    const parentAccount = await prisma.account.findUnique({
        where: { id: parentAccountId },
        select: { code: true },
    });

    if (!parentAccount?.code) {
        throw new Error(`Parent account with ID ${parentAccountId} does not exist or does not have a hierarchy code.`);
    }

    // Fetch the last child hierarchy code under the parent
    const lastChild = await prisma.account.findFirst({
        where: { companyId: companyId, parentAccountId: parentAccountId },
        orderBy: { code: 'desc' },
        select: { code: true },
    });

    if (lastChild?.code) {
        const parts = lastChild.code.split('.');
        let lastNumber = parseInt(parts[parts.length - 1], 10);

        do {
            lastNumber += 1; // Increment the last number
            parts[parts.length - 1] = lastNumber.toString();
            code = parts.join('.');

            // Check if the generated code already exists
            conflictExists = !!(await prisma.account.findFirst({
                where: {
                    companyId: companyId,
                    code: code,
                },
                select: { id: true },
            }));

        } while (conflictExists);
    } else {
        // First child
        code = `${parentAccount.code}.1`;

        // Ensure the first hierarchy code is unique
        conflictExists = !!(await prisma.account.findFirst({
            where: {
                companyId,
                code,
            },
            select: { id: true },
        }));

        if (conflictExists) {
            throw new Error(`Conflict for initial hierarchy code: ${code}`);
        }
    }

    return code;
}
