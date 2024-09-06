import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import preloadVeterinarian from '../../seeds/veterinarian.json';
import preloadServices from '../../seeds/services.json';
import preloadCatSer from '../../seeds/categoryService.json';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/entities/userRole.entity';
import { Pet } from '../pets/entities/pet.entity';
import * as bcrypt from 'bcrypt';
import { Sex } from '../pets/entities/sex.entity';
import { Race } from '../races/entitites/race.entity';
import { StatesAppointment } from '../appointment/entities/statesAppointment.entity';
import { Specie } from '../species/entities/specie.entity';
import { Veterinarian } from '../veterinarian/entities/veterinarian.entity';
import { Service } from '../services/entities/service.entity';
import { CategoryService } from '../categoryServices/entities/categoryService.entity';
import { AvailabilityService } from '../availabilityService/entities/availability-service.entity';
@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly rolesRepository: Repository<UserRole>,
    @InjectRepository(Pet)
    private readonly petsRepository: Repository<Pet>,
    @InjectRepository(Sex)
    private readonly sexRepository: Repository<Sex>,
    @InjectRepository(Race)
    private readonly raceRepository: Repository<Race>,
    @InjectRepository(Specie)
    private readonly specieRepository: Repository<Specie>,
    @InjectRepository(StatesAppointment)
    private readonly statesAppointmentsRepository: Repository<StatesAppointment>,
    @InjectRepository(Veterinarian)
    private readonly veterinarianRepository: Repository<Veterinarian>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(CategoryService)
    private readonly categoryServiceRepository: Repository<CategoryService>,
    /* @InjectRepository(AvailabilityService)
    private readonly availabilityServiceRepository: Repository<AvailabilityService>, */
  ) {}

  petsPath = path.join(__dirname, '..', '..', '..', 'src', 'seeds', 'pets.json');
  petsdata = JSON.parse(fs.readFileSync(this.petsPath, 'utf8'));

  sexPath = path.join(__dirname, '..', '..', '..', 'src', 'seeds', 'sex.json');
  sexdata = JSON.parse(fs.readFileSync(this.sexPath, 'utf8'));

  rolesPath = path.join(__dirname, '..', '..', '..', 'src', 'seeds', 'roles.json');
  rolesdata = JSON.parse(fs.readFileSync(this.rolesPath, 'utf8'));

  usersPath = path.join(__dirname, '..', '..', '..', 'src', 'seeds', 'users.json');
  usersdata = JSON.parse(fs.readFileSync(this.usersPath, 'utf8'));

  veterinariesPath = path.join(__dirname, '..', '..', '..', 'src', 'seeds', 'veterinaries.seed.json');
  veterinariesdata = JSON.parse(fs.readFileSync(this.veterinariesPath, 'utf8'));

  statesAppointmentsPath = path.join(__dirname, '..', '..', '..', 'src', 'seeds', 'statesAppointments.json');
  statesAppointmentsdata = JSON.parse(fs.readFileSync(this.statesAppointmentsPath, 'utf8'));

  availabilityServicePath = path.join(__dirname, '..', '..', '..', 'src', 'seeds', 'availabilityService.json');
  availabilityServicedata = JSON.parse(fs.readFileSync(this.availabilityServicePath, 'utf8'));

  async resetData() {
    await this.userRepository.delete({});
    /* await this.rolesRepository.delete({});
    await this.veterinariesRepository.delete({}); */
    //await this.petsRepository.delete({});
    return { message: 'Datos reiniciados exitosamente' };
  }

  /* async loadVeterinariesData() {
    for (const item of this.veterinariesdata) {
      let veterinarie = await this.veterinariesRepository.findOne({
        where: { CUIT: item.CUIT },
      });
      if (!veterinarie) {
        veterinarie = this.veterinariesRepository.create(item);
        await this.veterinariesRepository.save(veterinarie);
      }
    }
    return { message: 'Seeder veterinarios agregados' };
  } */
  async loadUsersData() {
    for (const item of this.usersdata) {
      let user = await this.userRepository.findOne({
        where: { email: item.email },
      });
      if (!user) {
        const role = await this.rolesRepository.findOne({
          where: { role: item.role },
        });

        if (!role) {
          throw new Error(`Role with name ${item.role} not found`);
        }
        const passwordHash = await bcrypt.hash(item.password, 10);
        user = this.userRepository.create({
          name: item.name,
          lastName: item.lastName,
          email: item.email,
          imgProfile: item.imgProfile,
          dni: item.dni,
          password: passwordHash,
          birthDate: item.birthDate,
          startDate: item.startDate,
          phone: item.phone,
          address: item.address,
          city: item.city,
          role: role,
        });
        await this.userRepository.save(user);
      }
    }
    return { message: 'Seeder usuarios agregados' };
  }

  async loadRolesData() {
    for (const item of this.rolesdata) {
      let role = await this.rolesRepository.findOne({
        where: { role: item.role },
      });
      if (!role) {
        role = this.rolesRepository.create({ role: item.role });
        await this.rolesRepository.save(role);
      }
    }
    return { message: 'Seeder roles agregados' };
  }

  async loadPetsData() {
    for (const item of this.petsdata) {
      const pet = await this.petsRepository.findOne({
        where: { name: item.name }, // CAMBIAR POR ALGO UNICO DE LA MASCOTA
      });
      if (!pet) {
        const user = await this.userRepository.findOne({ where: { email: item.emailOwner } });

        if (!user) {
          throw new Error(`Dueño de la mascota con email: ${item.emailOwner} no encontrado`);
        }

        const { birthdate, color, name, sex, race, specie } = item;
        const sexDB = await this.sexRepository.findOneBy({ sex });

        let specieDB: Specie = await this.specieRepository.findOneBy({ specie });
        if (!specieDB) {
          specieDB = await this.specieRepository.save({ specie });
        }

        let raceDB: Race = await this.raceRepository.findOneBy({ race });
        if (!raceDB) {
          raceDB = await this.raceRepository.save({ race, specie: specieDB });
        }

        const date = new Date().toISOString();
        await this.petsRepository.save({
          name,
          birthdate,
          startDate: date,
          color,
          user,
          specie: specieDB,
          race: raceDB,
          sex: sexDB,
        });
      }
    }
    return { message: 'Seeder mascotas agregados' };
  }

  async loadSexData() {
    for (const item of this.sexdata) {
      let sex = await this.sexRepository.findOne({
        where: { sex: item.sex },
      });
      if (!sex) {
        sex = this.sexRepository.create({ sex: item.sex });
        await this.sexRepository.save(sex);
      }
    }
    return { message: 'Seeder sexos agregados' };
  }

  async loadStatesAppointments() {
    for (const item of this.statesAppointmentsdata) {
      let stateAppointment = await this.statesAppointmentsRepository.findOne({
        where: { state: item.state },
      });
      if (!stateAppointment) {
        stateAppointment = this.statesAppointmentsRepository.create({ state: item.state });
        await this.statesAppointmentsRepository.save(stateAppointment);
      }
    }
  }

  async loadVeterinarian(): Promise<void> {
    for (const vet of preloadVeterinarian) {
      const vetExist: Veterinarian = await this.veterinarianRepository.findOneBy({ licence: vet.licence });

      if (!vetExist) {
        const user: User = await this.userRepository.findOneBy({ dni: vet.dni });
        console.log('user ', user);
        if (user) {
          const { dni, ...veterinarian } = vet;
          const vetUser = await this.veterinarianRepository.save({ ...veterinarian, user });
          console.log('vetUser ', vetUser);
        }
      }
    }
    console.log('Veterinarios Cargados Con Exito');
  }

  async loadCategoryService(): Promise<void> {
    for (const category of preloadCatSer) {
      const { categoryService } = category;
      const categoryExist: CategoryService = await this.categoryServiceRepository.findOneBy({ categoryService });
      if (!categoryExist) {
        await this.categoryServiceRepository.save(category);
      }
    }
    console.log('Servicios Cargados Con Exito');
  }

  async loadServices() {
    for (const service of preloadServices) {
      const serviceExist: Service = await this.serviceRepository.findOneBy({ service: service.service });
      //console.log('serviceExist ', serviceExist);
      if (!serviceExist) {
        const veterinarian: Veterinarian = await this.veterinarianRepository.findOneBy({ licence: service.licenceVet });
        const categoryService: CategoryService = await this.categoryServiceRepository.findOneBy({ categoryService: service.category });
        //console.log('veterinarian ', veterinarian);
        //console.log('categoryService ', categoryService);
        if (veterinarian && categoryService) {
          const { licenceVet, category, ...createService } = service;
          await this.serviceRepository.save({ ...createService, veterinarian, categoryService });
        }
      }
    }
    console.log('Servicios Cargados Con Exito');
  }

  async preloadInitial() {
    await this.loadRolesData();
    await this.loadSexData();
    await this.loadUsersData();
    await this.loadPetsData();
    await this.loadStatesAppointments();
    await this.loadVeterinarian();
    await this.loadCategoryService();
    await this.loadServices();
    //await this.loadAvailabilityService();
  }

  async onModuleInit() {
    await this.preloadInitial();
  }
}
