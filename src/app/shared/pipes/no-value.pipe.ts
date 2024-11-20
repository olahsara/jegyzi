import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'noValue',
  standalone: true,
})
/** "Nincs érték" megjelenítése undefined, null értékek esetén */
export class NoValuePipe implements PipeTransform {
  transform(value: string | number | undefined | null): string {
    return value ? value.toString() : 'Nincs megadva!';
  }
}
