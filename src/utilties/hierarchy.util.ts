import { PrismaClient } from '@prisma/client';

export async function generateHierarchyCode(
    prisma: PrismaClient,
    parentAccountId: string,
): Promise<string> {
    // Fetch the last child hierarchy code
    const lastChild = await prisma.account.findFirst({
        where: { parentAccountId },
        orderBy: { hierarchyCode: 'desc' },
        select: { hierarchyCode: true },
    });

    if (lastChild?.hierarchyCode) {
        const parts = lastChild.hierarchyCode.split('.');
        const lastNumber = parseInt(parts[parts.length - 1], 10);
        parts[parts.length - 1] = (lastNumber + 1).toString(); // Increment the last number
        return parts.join('.');
    } else {
        // First child
        return `${parentAccountId}.1`;
    }
}
