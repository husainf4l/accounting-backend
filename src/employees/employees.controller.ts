import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmployeesService } from './employees.service';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}


  @Post('create-new')
  async createEmployee(
      @Body() data: { name: string;  },
  ) {
      try {
          const newEmployee = await this.employeesService.createEmployee(data);
          return {
              message: 'Employee created successfully',
              employee: newEmployee,
          };
      } catch (error) {
          throw {
              statusCode: 400,
              message: 'Failed to create employee',
              error: error.message,
          };
      }
  }
  
  
}
