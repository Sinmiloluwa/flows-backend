import { Model, Table } from "sequelize-typescript";
import { Column, DataType } from "sequelize-typescript";

@Table({ tableName: 'categories', timestamps: true })
export class Category extends Model {
     @Column({
        type: DataType.STRING,
        allowNull: false,
      })
      declare name: string;

       @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true
    })
    declare isActive: boolean;
}