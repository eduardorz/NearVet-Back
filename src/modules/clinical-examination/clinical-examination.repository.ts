import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClinicalExamination } from './entities/clinicalExamination.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ClinicalExaminationRepository {
  
    constructor (@InjectRepository(ClinicalExamination) private  examinationRepository: Repository<ClinicalExamination>) {}

    async getExaminations (page:number, limit:number): Promise<ClinicalExamination[]> {
        return await this.examinationRepository.find({
            skip: page*limit, 
            take: limit, 
            relations: {pet:true, veterinarian:true, treatments:true}})
    }

    async getExaminationById (id:string): Promise<ClinicalExamination> {
        return await this.examinationRepository.findOne({
            where: {id},
            relations: {pet:true, veterinarian:true, treatments:true}})
    }

    async getExaminationByPetId (petId:string, page:number, limit:number): Promise<ClinicalExamination[]> {
        return await this.examinationRepository.find({
            where: {petId},
            skip: page*limit, 
            take: limit, 
            relations: {veterinarian:true, treatments:true}})
    }

    async getExaminationByVeterinarianId (veterinarianId:string, page:number, limit:number): Promise<ClinicalExamination[]> {
        return await this.examinationRepository.find({
            where: {veterinarianId},
            skip: page*limit, 
            take: limit, 
            relations: {pet:true, treatments:true}})
    }

    async createExamination (examination:Partial<ClinicalExamination>): Promise<ClinicalExamination> {
        return await this.examinationRepository.save(examination)
    }

    async updateExamination (id: string, examination:Partial<ClinicalExamination>): Promise<UpdateResult> {
        return await this.examinationRepository.update(id, examination)
    }

    async removeExamination (id: string): Promise<DeleteResult> {
        return await this.examinationRepository.delete(id)
    }
    
}