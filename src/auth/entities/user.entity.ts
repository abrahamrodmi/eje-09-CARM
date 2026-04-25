import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class User {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id!: number;
    @ApiProperty()
    @Column()
    name!: string;
    @ApiProperty()
    @Column({ unique: true })
    email!: string;
    @Column()
    password!: string;
}
