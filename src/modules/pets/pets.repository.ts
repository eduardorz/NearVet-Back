import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from './entities/pet.entity';
import { User } from '../users/entities/user.entity';
import { UsersRepository } from '../users/users.repository';
import { CreatePetDto } from './dto/create-pet.dto';

@Injectable()
export class PetsRepository {
  constructor(
    @InjectRepository(Pet) private petsRepository: Repository<Pet>,
    private usersRepository: UsersRepository
  ) {}

  async getPetsRepository() {
    const pets = await this.petsRepository.find();
    if (pets.length === 0)
      throw new NotFoundException(`Por el momento no hay mascotas registradas`);
    return pets;
  }

  async getPetByIdRepository(id: string) {
    const pet = await this.petsRepository.findOneBy({ id });
    if (!pet)
      throw new NotFoundException(`Mascota con el ID ${id} no encontrada`);
    return pet;
  }

  async getPetsByUserRepository(id: string){
    const user = await this.usersRepository.getUserByIdRepository(id);
    if (!user) throw new NotFoundException(`No se encontro el usuario con el id ${id} para obtener sus mascotas`);
    return { 
      id,
      pets: user.pets 
    };
  }

  async createPetRepository(pet: CreatePetDto) {
    const { userId } = pet
    const user = await this.usersRepository.getUserByIdRepository(userId);
    if (!user) throw new Error(`No se encontro el usuario con el id ${userId} para registrar su mascota`);
    const newPet = this.petsRepository.create({
      ...pet,
      user
    });
    const savedPet = await this.petsRepository.save(newPet);
    savedPet.user.password = "oculto";
    return savedPet;
  }

  async updatePetRepository(id: string, petData: Partial<Pet>) {
    const pet = await this.petsRepository.findOneBy({ id });
    if (!pet)
      throw new NotFoundException(
        `Mascota para modificar con el ID ${id} no encontrada`,
      );
    await this.petsRepository.update(id, petData);
    return await this.getPetByIdRepository(id);
  }

  async removePetRepository(id: string) {
    const pet = await this.petsRepository.findOneBy({ id });
    if (!pet)
      throw new NotFoundException(
        `Mascota para eliminar con el ID ${id} no encontrada`,
      );
    const result = await this.petsRepository.delete(id);
    return result;
  }
}
