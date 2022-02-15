import { BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TheaterItemModel } from "../TheaterItem";
import { UserModel } from "../User";
import { UserChannelModel } from "../UserChannel";

@Entity()
export class Follower extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => UserModel, user => user.following)
  follower!: UserModel;

  @ManyToOne(() => UserChannelModel, channel => channel.followers, {eager: true})
  followedTo!: UserChannelModel;

  @CreateDateColumn()
  date!: Date;
}


@Entity()
export class TheaterItemFollower extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => UserModel, user => user.following)
  follower!: UserModel;

  @ManyToOne(() => TheaterItemModel, item => item.followers, {eager: true})
  followedTo!: TheaterItemModel;

  @CreateDateColumn()
  date!: Date;
}
