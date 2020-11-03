import { User } from '../entity/user.entity';

export const userProviders = [
  {
    provide: 'User_REPOSITORY',
    useValue: User,
  },
];