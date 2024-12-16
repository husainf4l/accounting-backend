import { Body, Injectable, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateHierarchyCode } from 'src/utilties/hierarchy.util';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) { }

  async createEmployee(data: { name: string }, companyId: string): Promise<any> {
    console.log('Starting createEmployee function');
    const employeesLiability = await this.prisma.account.findUnique({
      where: {
        hierarchyCode: '2.1.1',
      },
      select: { id: true },
    });
    console.log('EmployeesLiability:', employeesLiability);

    if (!employeesLiability) {
      console.error('EmployeesLiability account not found');
      throw new Error('EmployeesLiabilityaccount not found');
    }
    const hierarchyCode = await generateHierarchyCode(
      this.prisma,
      employeesLiability.id,
    );
    console.log('Generated hierarchy code:', hierarchyCode);

    try {
      // Create the new account for the client
      console.log('Creating new account for the employee');
      const newAccount = await this.prisma.account.create({
        data: {
          companyId: companyId,
          name: data.name,
          hierarchyCode,
          accountType: 'LIABILITY',
          openingBalance: 0.0,
          currentBalance: 0.0,
          parentAccountId: employeesLiability.id,
        },
      });
      console.log('New Account:', newAccount);

      console.log('Creating employe details');
      const employeeDetails = await this.prisma.employee.create({
        data: {
          // accountId: newAccount.id,
          // displayName: data.name || null,
        },
      });
      console.log('Employee Details:', employeeDetails);

      return {
        account: newAccount,
        details: employeeDetails,
      };
    } catch (error) {
      console.error('Error during employee creation:', error.message);
      throw error;
    }
  }

  async getAccountManagers(companyId: string) {
    return this.prisma.employee.findMany({
      select: { id: true, name: true },
    });
  }
}
