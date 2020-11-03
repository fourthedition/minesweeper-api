import { Table, Column, Model, DataType, Default, BeforeCreate, AfterCreate } from 'sequelize-typescript';

@Table({
  timestamps: false,
})
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Default(
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
  )
  @Column({
    type: DataType.STRING,
  })
  avatar: string;

  @Column({
    type: DataType.STRING,
  })
  facebookId: string;
  
  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  elorank: number;


}
