import { Pipe, type PipeTransform } from '@angular/core';
import { Education, EducationType } from '../models/eductaion.model';

@Pipe({
  name: 'educationYear',
  standalone: true,
})
export class EducationYearPipe implements PipeTransform {

  transform(value: string | undefined, type: string | undefined): string {
    
    if(type && value){
      const EDUCTAION_TYPE = EducationType;
      
      if( type === EDUCTAION_TYPE.primary ){
        return value+'. osztályos';
      }
      if( type === EDUCTAION_TYPE.secondary ){
        if(value === '0'){
            return 'Előkészítő';
        } else {
            return value+'. osztályos';
        }
      }
      if( type === EDUCTAION_TYPE.upper || type === EDUCTAION_TYPE.university ){
        return value+'. éves'

      }
    }
    return 'Nincs megadva'
  }

}