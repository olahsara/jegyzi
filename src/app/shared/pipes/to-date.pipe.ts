import { Pipe, type PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'toDate',
  standalone: true,
})
/** Timestamp átalakítássa Date-re */
export class toDatePipe implements PipeTransform {
  transform(value: Timestamp): Date {
    return value.toDate();
  }
}
