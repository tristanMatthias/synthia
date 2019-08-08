import { UUIDV4 } from 'sequelize';
import { Column, DeletedAt, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';


@Table
export class BaseModel<T extends Model<T>> extends Model<T> {
  // Setup the primary key
  @PrimaryKey
  @IsUUID(4)
  @Column({ defaultValue: UUIDV4 })
  id: string;

  @DeletedAt
  deletedAt: Date;
}
