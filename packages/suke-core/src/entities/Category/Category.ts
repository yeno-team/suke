import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

export interface Category {
    id: number;
    viewerCount: number;
    label: string;
    value: string;
    thumbnail_url: string;
}

@Entity()
export class CategoryModel extends BaseEntity implements Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    viewerCount!: number;

    @Index({fulltext: true })
    @Column("text")
    label!: string;

    @Column()
    value!: string;

    @Column()
    thumbnail_url!: string;
}