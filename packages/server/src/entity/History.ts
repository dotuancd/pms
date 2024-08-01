import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Site } from "./Site";

@Entity()
export class History extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("simple-json")
  request: {
    method: string;
    url: string;
    body: object;
  };

  @Column()
  responseStatusCode: number;

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => Site, site => site.history)
  @JoinColumn()
  site: Site;
}