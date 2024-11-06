import { Pipe, type PipeTransform } from '@angular/core';
import { ProfileTypes, User } from '../models/user.model';
import { getEducation } from './education-year.pipe';

@Pipe({
  name: 'type',
  standalone: true,
})
export class TypePipe implements PipeTransform {
  transform(value: User | undefined): string {
    if (value?.profileType) {
      switch (value.profileType) {
        case ProfileTypes.student:
          if (value.education?.institution && value.education.specialization) {
            return (
              value.education.institution +
              ', ' +
              value.education.specialization +
              ', ' +
              getEducation(value.education.year, value.education.type)
            );
          }
          break;
        case ProfileTypes.teacher:
          if (value.education?.institution && value.education.specialization && value.education.type && value.education.year) {
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
          if (value.work?.workPlace && value.work.position && value.work.year) {
            return value.work.workPlace + ', ' + value.work.position + ', ' + value.work.year + ' év';
          }

          break;
        case ProfileTypes.other:
          if (value.other?.description) {
            return value.other.description;
          }

          break;
      }
    }
    return 'Nincs megadva!';
  }
}
