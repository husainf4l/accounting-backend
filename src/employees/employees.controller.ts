import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) { }

  @Post('create-new')
  async createEmployee(@Req() req: any,
    @Body() data: { name: string }) {
    try {
      const companyId = req.user.companyId;

      const newEmployee = await this.employeesService.createEmployee(data, companyId);
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

  @UseGuards(AuthGuard('jwt'))
  @Get('employees-list')
  async getEmployeesList(@Req() req: any) {
    const companyId = req.user.companyId;
    return this.employeesService.getAccountManagers(companyId);
  }
}
