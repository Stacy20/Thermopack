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

enum Privileges {
  EditText,
  AddItems,
  EditItems,
  DelItems
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
  private txtUserEmail !: ElementRef<HTMLInputElement>;

  @ViewChild('txtUserPswrd')
  private txtUserPswrd !: ElementRef<HTMLInputElement>;

  @ViewChild('chkPrivEditText')
  private chkPrivEditText !: ElementRef<HTMLInputElement>;

  @ViewChild('chkPrivAddItems')
  private chkPrivAddItems !: ElementRef<HTMLInputElement>;

  @ViewChild('chkPrivEditItems')
  private chkPrivEditItems !: ElementRef<HTMLInputElement>;

  @ViewChild('chkPrivDelItems')
  private chkPrivDelItems !: ElementRef<HTMLInputElement>;

  public checkedPrivilages : boolean[] = [false, false, false, false];
  public EnumPrivileges = Privileges;

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const table = document.getElementById('users-table');
    if (!(table?.contains(target) || this.isEditing)) {
      this.selectedUser = null;
    }
  }

  checkChange(event: Event, privilege : Privileges){
    this.checkedPrivilages[privilege] = (<HTMLInputElement>event.target).checked
  }

  addUser(event: Event) : void{
    let newUser : User = {
      userEmail: this.txtUserEmail.nativeElement.textContent!,
      userPswrd: this.txtUserPswrd.nativeElement.textContent!,
      privEditText: this.chkPrivEditText.nativeElement.checked,
      privAddItems: this.chkPrivAddItems.nativeElement.checked,
      privEditItems: this.chkPrivEditItems.nativeElement.checked,
      privDelItems: this.chkPrivDelItems.nativeElement.checked
    }
    console.log(newUser);
  }
}
