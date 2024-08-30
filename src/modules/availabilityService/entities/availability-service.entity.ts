import { Service } from "src/modules/services/entities/service.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'availabilityServices',
})
export class AvailabilityService {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false,
        unique: true,
    })
    day: number;

    @Column({
        type: 'date',
        nullable: false,
    })
    startHour1: Date;

    @Column({
        type: 'date',
        nullable: false,
    })
    endHour1: Date;

    @Column({
        type: 'date',
        nullable: false,
    })
    startHour2: Date;

    @Column({
        type: 'date',
        nullable: false,
    })
    endHour2: Date;

   // RELACION MUCHOS-A-UNO con services
   @ManyToOne(() => Service, (service) => service.availabilityService)
   service: Service; 
    
}
