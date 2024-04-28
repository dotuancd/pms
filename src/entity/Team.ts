import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, ManyToOne, JoinTable } from "typeorm"
import { Site } from "./Site"
import { User } from "./User"

@Entity({name: 'teams'})
export class Team {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({nullable: true})
    description: string

    @ManyToOne(() => User)
    owner: User

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(() => Site, site => site.team)
    sites: Site[]

    @ManyToMany(() => User, user => user.teams)
    users: User[]
}
