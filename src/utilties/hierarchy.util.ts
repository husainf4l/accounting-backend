import { PrismaClient } from '@prisma/client';

export async function generateHierarchyCode(
    prisma: PrismaClient,
    parentAccountId: string,
): Promise<string> {
    let hierarchyCode: string;
    let conflictExists: boolean;

    // Fetch the last child hierarchy code
    const lastChild = await prisma.account.findFirst({
        where: { parentAccountId },
        orderBy: { hierarchyCode: 'desc' },
        select: { hierarchyCode: true },
    });

    if (lastChild?.hierarchyCode) {
        const parts = lastChild.hierarchyCode.split('.');
        let lastNumber = parseInt(parts[parts.length - 1], 10);

        do {
            lastNumber += 1; // Increment the last number
            parts[parts.length - 1] = lastNumber.toString();
            hierarchyCode = parts.join('.');

            // Check if the generated code already exists
            conflictExists = !!(await prisma.account.findUnique({
                where: { hierarchyCode },
                select: { id: true },
            }));

        } while (conflictExists);
    } else {
        // First child
        hierarchyCode = `${parentAccountId}.1`;

        // Ensure the first hierarchy code is unique
        conflictExists = !!(await prisma.account.findUnique({
            where: { hierarchyCode },
            select: { id: true },
        }));

        if (conflictExists) {
            throw new Error(`Conflict for initial hierarchy code: ${hierarchyCode}`);
        }
    }

    return hierarchyCode;
}
