import { Pipe, type PipeTransform } from '@angular/core';
import { ProfileTypes, User } from '../models/user.model';
import { EducationYearPipe } from './education-year.pipe';

@Pipe({
  name: 'type',
  standalone: true,
})
export class TypePipe implements PipeTransform {
  transform(value: User | undefined): string {
    const yearPipe = new EducationYearPipe();
    if (value) {
      switch (value.profileType) {
        case ProfileTypes.student:
          if (value.education) {
            return (
              value.education.institution +
              ', ' +
              value.education.specialization +
              ', ' +
              yearPipe.transform(value.education.year.toString(), value.education.type)
            );
          }
          break;
        case ProfileTypes.teacher:
          if (value.education) {
            return (
              value.education.institution +
              ' (' +
              value.education.type +
              '), ' +
              value.education.specialization +
              ', ' +
              value.education.year +
              ' év'
            );
          }
          break;
        case ProfileTypes.work:
          if (value.work) {
            return value.work.workPlace + ', ' + value.work.position + ', ' + value.work.year + ' év';
          }

          break;
        case ProfileTypes.other:
          if (value.other) {
            return value.other.description;
          }

          break;
      }
    }
    return 'Nincs megadva!';
  }
}
