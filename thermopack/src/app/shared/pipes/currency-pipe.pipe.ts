import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyPipe',
  standalone: true
})
export class CurrencyPipePipe implements PipeTransform {
  transform(value: number): string {
    return '₡' + value;
  }
}
