import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { YesNoPipePipe } from "../../pipes/yes-no-pipe.pipe";
import { CommonModule } from '@angular/common';

interface UsersTableRow {
  userEmail: string;
  userPswrd: string;
  privEditText: boolean;
  privAddItems: boolean;
  privEditItems: boolean;
  privDelItems: boolean;
  editable: boolean;
}

interface User {
  userEmail: string;
  userPswrd: string;
  privEditText: boolean;
  privAddItems: boolean;
  privEditItems: boolean;
  privDelItems: boolean;
}

@Component({
    selector: 'admin-user-table',
    standalone: true,
    templateUrl: './user-table.component.html',
    styles: ``,
    imports: [FormsModule, YesNoPipePipe, CommonModule]
})
export class UserTableComponent {

  public users: UsersTableRow[] = [
    { userEmail: 'jarrieta@anymail.com', userPswrd: 'abcdef', privEditText: true, privAddItems: true, privEditItems: true, privDelItems: true, editable: false },
    { userEmail: 'amoreira@anymail.com', userPswrd: 'ghijk', privEditText: false, privAddItems: true, privEditItems: true, privDelItems: false, editable: false },
    { userEmail: 'dmiranda@anymail.com', userPswrd: 'lmnop', privEditText: true, privAddItems: false, privEditItems: false, privDelItems: false, editable: false },
    { userEmail: 'fblanco@anymail.com', userPswrd: 'qrstuv', privEditText: true, privAddItems: true, privEditItems: false, privDelItems: false, editable: false }
  ];

  public selectedUser : UsersTableRow | null = null;

  public isEditing : boolean = false

  @ViewChild('txtUserEmail')
  public txtUserEmail !: ElementRef<HTMLInputElement>;

  @ViewChild('txtUserPswrd')
  public txtUserPswrd !: ElementRef<HTMLInputElement>;

  @ViewChild('chkPrivEditText')
  public chkPrivEditText !: ElementRef<HTMLInputElement>;

  @ViewChild('chkPrivAddItems')
  public chkPrivAddItems !: ElementRef<HTMLInputElement>;

  @ViewChild('chkPrivEditItems')
  public chkPrivEditItems !: ElementRef<HTMLInputElement>;

  @ViewChild('chkPrivDelItems')
  public chkPrivDelItems !: ElementRef<HTMLInputElement>;

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const table = document.getElementById('users-table');
    if (!(table?.contains(target) || this.isEditing)) {
      this.selectedUser = null;
    }
  }
}
