
import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm'
import { Rule } from './Rule'
import { Team } from './Team'

@Entity({name: 'sites'})
export class Site {
    @PrimaryColumn()
    id: string

    @Column()
    title: string

    @Column({nullable: true})
    url: string

    @Column({nullable: true})
    description: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(() => Rule, rule => rule.site)
    @JoinColumn()
    rules: Rule[]

    @ManyToOne(() => Team, team => team.sites)
    @JoinColumn()
    team: Team
}