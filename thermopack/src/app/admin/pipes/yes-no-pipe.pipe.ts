import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'yesNoPipe',
  standalone: true
})
export class YesNoPipePipe implements PipeTransform {

  transform(value: boolean | undefined, lang: string): string {
    if(lang === 'es'){
      return value  ? 'Sí' : 'No';
    }else{
      return value ? 'Yes' : 'No';
    }

  }

}
