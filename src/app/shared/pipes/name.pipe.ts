import { Pipe, type PipeTransform } from '@angular/core';
import { User } from '../models/user.model';

@Pipe({
  name: 'name',
  standalone: true,
})
export class NamePipe implements PipeTransform {

  transform(value: User): string {
    if(value.name){
        return value.name.lastName+' '+value.name.firstName;
    }
    return 'Nincs megadva!';
  }

}