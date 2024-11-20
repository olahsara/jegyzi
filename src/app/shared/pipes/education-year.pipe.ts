import { Pipe, type PipeTransform } from '@angular/core';
import { EducationType } from '../models/eductaion.model';

export function getEducation(value: number, type: string) {
  const EDUCTAION_TYPE = EducationType;

  switch (type) {
    case EDUCTAION_TYPE.primary:
      return value + '. osztályos';
    case EDUCTAION_TYPE.secondary:
      if (value === 0) {
        return 'Előkészítő';
      } else {
        return value + '. osztályos';
      }
    case EDUCTAION_TYPE.upper:
    case EDUCTAION_TYPE.university:
      return value + '. éves';
    default:
      return 'Nincs megadva';
  }
}

@Pipe({
  name: 'educationYear',
  standalone: true,
})

/** Profil oktatási adatainak átalakítása */
export class EducationYearPipe implements PipeTransform {
  transform(value: number | undefined, type: string | undefined): string {
    if (type && value) {
      getEducation(value, type);
    }
    return 'Nincs megadva';
  }
}
