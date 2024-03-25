import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }
  showAlert(title: string, text: string, icon: any): void {
    Swal.fire({
      title: title,
      text: text,
      icon: icon
    });
  }
  showConfirmationAlert(title: string, text: string, callbackConfirm: () => void, callbackRefuse?: () => void): void {
    Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        callbackConfirm(); // Llamar a la función de callback si el usuario confirma
      }else if(callbackRefuse){
        callbackRefuse();
      }
    });
  }
}
