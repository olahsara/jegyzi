import { Pipe, type PipeTransform } from '@angular/core';
import { Education } from '../models/eductaion.model';
import { EducationYearPipe } from './education-year.pipe';

@Pipe({
  name: 'education',
  standalone: true,
})
export class EducationPipe implements PipeTransform {

  transform(value: Education | undefined): string {
    const yearPipe = new EducationYearPipe();
    if(value){
      return value.institution+', '+value.specialization+', '+ yearPipe.transform(value.year.toString(), value.type);
    }
    return 'Nincs megadva!';
  }

}