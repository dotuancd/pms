import "reflect-metadata"
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Site {
    @PrimaryColumn({type: 'varchar'})
    id: string

    @Column({type: 'varchar'})
    title: string

    @Column({type: 'varchar', nullable: true})
    description: string
}