import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import preloadCatSer from  "../../seeds/categoryService.json"
import { CategoryServiceRepository } from './categoryServices.repository';
import { CategoryService } from './entities/categoryService.entity';

@Injectable()
export class CategoryServicesService {

  constructor (private readonly categoryServiceRepository: CategoryServiceRepository) {}
 
  
  async getCategoryServices(): Promise<CategoryService[]> {
    const catServs: CategoryService[] = await this.categoryServiceRepository.getCategoryServices();
    if (catServs.length==0) throw new NotFoundException("No hay ninguna categoria de servicio cargada");
    return catServs;
  }

  async getCategoryServiceById(id: string): Promise<CategoryService> {
    const catServ: CategoryService = await this.categoryServiceRepository.getCategoryServiceById(id);
    if (!catServ) {throw new NotFoundException("La categoria de servicio buscada no existe")}
    return catServ;
  }

  async getCategoryServiceByCategory(category: string): Promise<CategoryService> {
    const catServ: CategoryService = await this.categoryServiceRepository.getCategoryServiceByCategory(category);
    if (!catServ) {throw new NotFoundException(`La categoria de servicio buscada no existe`)}
    return catServ;
  }
  
  async createCategoryService(createcatServ: Partial<CategoryService>): Promise<CategoryService> {
    const catServCreated: CategoryService = await this.categoryServiceRepository.createCategoryService(createcatServ);
    if (!catServCreated) {throw new InternalServerErrorException(`La creacion de la categoria de servicio no pudo concretarse`)}
    return catServCreated
  } 

  async updateCategoryService(id: string, catServ: Partial<CategoryService>): Promise<string> {
    const catServUpdate = await this.categoryServiceRepository.updateCategoryService(id, catServ);
    if (catServUpdate.affected !== 1) throw new NotFoundException(`La categoria de servicio que intenta actualizar no existe`)
    return id;
  }

  async removeCategoryService(id: string): Promise<string> {
    const catServRemove = await this.categoryServiceRepository.removeCategoryService(id)
    if (catServRemove.affected !== 1) throw new NotFoundException(`La categoria de servicio que intenta eliminar no existe`)
    return id;
  }

  async preloadCategoryService(): Promise<void> {
    for (const category of preloadCatSer) {
      const {categoryService, description, image} = category;
      const categoryExist: CategoryService = await this.categoryServiceRepository.getCategoryServiceByCategory(categoryService);
      if (!categoryExist) {await this.categoryServiceRepository.createCategoryService(category); }
    }
    console.log("Categorias de Servicios Cargadas Con Exito")
  }
}