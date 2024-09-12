import { Controller, Get, Post, Put, Delete, Param, Body, ParseUUIDPipe, HttpCode } from '@nestjs/common';
import { PendingService } from './pending.service';
import { ApiInternalServerErrorResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePendingDto } from './dto/create-pending.dto';
import { UpdatePendingDto } from './dto/update-pending.dto';

@ApiTags('Pendings')
@Controller('pendings')
export class PendingController {
  constructor(private readonly pendingService: PendingService) {}

  @Get()
  @ApiOperation({summary: "Obtiene todas las pendientes"})
  getAllPendings() {
    return this.pendingService.getAllPendings();
  }

  @Get(':id')
  @ApiOperation({summary: "Obtiene una pendiente por ID"})
  getPendingById(@Param('id', ParseUUIDPipe) id: string) {
    return this.pendingService.getPendingById(id);
  }

  @Get('/user/:userId')
  @ApiOperation({summary: "Obtiene todas las pendientes de un usuario"})
  getAllUsersPending(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.pendingService.getAllUsersPending(userId);
  }

  @Get('/pet/:petId')
  @ApiOperation({summary: "Obtiene pendientes por mascota"})
  getPendingByPet(@Param('petId', ParseUUIDPipe) petId: string) {
    return this.pendingService.getPendingByPet(petId);
  }

  @Get('/service/:serviceId')
  @ApiOperation({summary: "Obtiene pendientes por servicio"})
  getPendingByService(@Param('serviceId', ParseUUIDPipe) serviceId: string) {
    return this.pendingService.getPendingByService(serviceId);
  }

  @Get('/active')
  @ApiOperation({summary: "Obtiene pendientes activas"})
  getActivePending() {
    return this.pendingService.getActivePending();
  }

  @Get('/veterinarian/:veterinarianId')
  @ApiOperation({summary: "Obtiene pendientes por veterinario"})
  getPendingByVeterinarian(@Param('veterinarianId', ParseUUIDPipe) veterinarianId: string) {
    return this.pendingService.getPendingByVeterinarian(veterinarianId);
  }

  @Post()
  @ApiOperation({summary: "Crea una nueva pendiente"})
  createPending(@Body() createPendingDto: CreatePendingDto) {
    return this.pendingService.createPending(createPendingDto);
  }

  @Put(':id')
  @ApiOperation({summary: "Actualiza una pendiente por ID"})
  updatePending(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePendingDto: UpdatePendingDto,
  ) {
    return this.pendingService.updatePending(id, updatePendingDto);
  }

  @Delete(':id')
  @ApiOperation({summary: "Elimina una pendiente por ID"})
  deletePending(@Param('id', ParseUUIDPipe) id: string) {
    return this.pendingService.deletePending(id);
  }
}
