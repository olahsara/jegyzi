import { inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { intlFormatDistance } from 'date-fns';

@Pipe({
  name: 'elapsedTime',
  standalone: true,
})
/** Eltelt idő megjelenítése  */
export class ElapsedTimePipe implements PipeTransform {
  private locale = inject(LOCALE_ID);
  transform(value: Date): string {
    return intlFormatDistance(value, new Date(), { locale: this.locale });
  }
}
