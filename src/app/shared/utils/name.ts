import { User } from '../models/user.model';

export function getName(value: User): string {
  if (value.firstName && value.lastName) {
    return value.lastName + ' ' + value.firstName;
  }
  return 'Nincs megadva!';
}
