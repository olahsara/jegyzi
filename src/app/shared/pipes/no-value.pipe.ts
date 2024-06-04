import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'noValue',
  standalone: true,
})
export class NoValuePipe implements PipeTransform {

  transform(value: string | number | undefined | null): string {
    return value?value.toString():'Nincs megadva!';
  }

}
