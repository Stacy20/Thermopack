import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { YesNoPipePipe } from "../../pipes/yes-no-pipe.pipe";
import { CommonModule } from '@angular/common';
import { MainService } from '../../../services/service';

interface UsersTableRow {
  userEmail: string;
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
  constructor(
    private service: MainService,
  ) {}

  ngOnInit() {
    this.getData();;
  }

  public users: UsersTableRow[] = [];
  public selectedUser : UsersTableRow | null = null;
  public isEditing : boolean = false
  public email: string = '';
  public privileges: boolean[] = [false,false,false,false];

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
    this.privileges[privilege] = this.privileges[privilege] === false ? true : false;
    this.checkedPrivilages[privilege] = (<HTMLInputElement>event.target).checked
  }

  isEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  addUser() : void{
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].userEmail == this.email || !this.isEmail(this.email)){
        return; // TODO alert
      }
    }
    const p = 'Password123.'; //TODO generar contrasenhas
    const privilegesAsNumbers = this.privileges.map(privilege => privilege ? 1 : 0);
    this.service.createUser(this.email, p, privilegesAsNumbers).subscribe((user) => {
      if (user.email == this.email){
        // TODO alert que salio bien
        location.reload();
      }
    });
  }

  getData(): void {
    this.service.getAllUsers().subscribe((users) => {
      for (let i = 0; i < users.length; i++) {
        this.users.push({ userEmail: users[i].email, privEditText: users[i].privileges[0] == 1, privAddItems: users[i].privileges[1] == 1, privEditItems: users[i].privileges[2] == 1, privDelItems: users[i].privileges[3] == 1, editable: false })
      }
    });
  }
}
