import { Module } from '@nestjs/common';
import { ClinicalExaminationService } from './clinical-examination.service';
import { ClinicalExaminationController } from './clinical-examination.controller';
import { ClinicalExaminationRepository } from './clinical-examination.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicalExamination } from './entities/clinicalExamination.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClinicalExamination])],
  controllers: [ClinicalExaminationController],
  providers: [ClinicalExaminationService, ClinicalExaminationRepository],
})
export class ClinicalExaminationModule {}
