import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, InternalServerErrorException, Query, Put, ParseUUIDPipe } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale } from './entities/sale.entity';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags("Sales")
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get(":id")
  async getSaleById (@Param("id", ParseUUIDPipe) id:string): Promise<Sale> {
    return await this.salesService.getSaleById (id)
  }

  @Get("dates")
  async getSalesByDates (@Query("page") page:number = 1,
                         @Query("limit") limit:number = 5, 
                         @Query("start") start:Date, 
                         @Query("end") end:Date): Promise<Sale[]> {
    return await this.salesService.getSalesByDates (+page, +limit, start, end);
  }

  @Get("user")
  async getSalesByUserId (@Query("page") page:number = 1,
                          @Query("limit") limit:number = 5, 
                          @Query("userId") userId:string,
                          @Query("start") start:Date, 
                          @Query("end") end:Date): Promise<Sale[]> {
    return await this.salesService.getSalesByUserId (page, limit, userId, start, end);
  }

  @Get("SalesByClinical")
  async getSalesSendClinical (): Promise<Sale[]> {
    return await this.salesService.getSalesSendClinical ();
  }

  @Post()
  @ApiBody({description:"Ingrese todos los datos requeridos", type: CreateSaleDto})
  async createSale (@Body() sale:CreateSaleDto): Promise<Sale> {
    return await this.salesService.createSale(sale); 
  }

  @Put(":id")
  async updateSale (@Param("id", ParseUUIDPipe) id:string, @Body() sale:UpdateSaleDto): Promise<string> {
    return await this.salesService.updateSale(id, sale);
  }

  @Put("finishedSale/:id")
  async finishedSale (@Param("id", ParseUUIDPipe) id:string): Promise<string> {
    return await this.salesService.finishedSale(id);
  }

  @Put("sendClinicalSale/:id")
  async sendClinicalSale (@Param("id", ParseUUIDPipe) id:string): Promise<string> {
    return await this.salesService.sendClinicalSale(id)
  }

  @Delete(":id")
  async deleteSale (@Param("id", ParseUUIDPipe) id:string): Promise<string> {
    return await this.salesService.deleteSale(id);
  }
}