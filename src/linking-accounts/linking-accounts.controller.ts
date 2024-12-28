import { Controller, Get, Post, Body, Param, Delete, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { LinkingAccountsService } from './linking-accounts.service';
import { CreateLinkingAccountDto } from './dto/create-linking-account.dto';
import { UpdateLinkingAccountDto } from './dto/update-linking-account.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('linking-accounts')
export class LinkingAccountsController {
  constructor(private readonly linkingAccountsService: LinkingAccountsService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Req() req: any,
    @Body() createLinkingAccountDto: CreateLinkingAccountDto,

  ) {
    const companyId = req.user.companyId;

    return this.linkingAccountsService.create(companyId, createLinkingAccountDto);
  }



  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any,
  ) {
    const companyId = req.user.companyId;

    return this.linkingAccountsService.findOne(id, companyId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: any,

    @Body() updateLinkingAccountDto: UpdateLinkingAccountDto,
  ) {
    const companyId = req.user.companyId;

    return this.linkingAccountsService.update(id, companyId, updateLinkingAccountDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any,
  ) {
    const companyId = req.user.companyId;

    return this.linkingAccountsService.remove(id, companyId);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req: any) {
    const companyId = req.user.companyId;
    const links = await this.linkingAccountsService.findAll(companyId);

    if (!links.length) {
      return {
        message: 'No linked accounts found',
        links: [],
      };
    }

    return links;
  }

}
