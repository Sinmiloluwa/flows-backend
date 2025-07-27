import { Sequelize } from 'sequelize-typescript';
import { User } from '../user/entities/user.entity';
import { SEQUELIZE } from '../../constants';
export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
       const sequelize = new Sequelize(process.env.DATABASE_URL!, {
        dialect: 'postgres',
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        },
        logging: false,
      });

      sequelize.addModels([User]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
