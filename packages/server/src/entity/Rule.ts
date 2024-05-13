
import { Entity, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Site } from './Site'

@Entity({name: 'rules'})
export class Rule {
    @PrimaryGeneratedColumn()
    id: number

    @Column("simple-array")
    methods: string[]

    @Column("simple-array")
    routes: string[]

    @Column("simple-array", {nullable: true})
    headers: string[]

    @Column("simple-json")
    strategy: {
        type: string
        options: any
    }

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => Site, site => site.rules, {cascade: true, onDelete: "CASCADE"})
    site: Site
}