import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { YesNoPipePipe } from "../../pipes/yes-no-pipe.pipe";
import { CommonModule } from '@angular/common';
import { MainService } from '../../../services/service';
import { Users } from '../../../interfaces/users.interface';

interface UsersTableRow {
  userEmail: string;
  privAddItems: boolean;
  privEditItems: boolean;
  privDelItems: boolean;
  privCreateUsers: boolean;
  editable: boolean;
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
  public originalEmail: string = '';
  public privileges: boolean[] = [false,false,false,false];

  @ViewChild('txtUserEmail')
  private txtUserEmail !: ElementRef<HTMLInputElement>;

  @ViewChild('txtUserPswrd')
  private txtUserPswrd !: ElementRef<HTMLInputElement>;

  @ViewChild('chkPrivEditText')
  chkPrivEditText !: ElementRef<HTMLInputElement>;

  @ViewChild('chkPrivAddItems')
  chkPrivAddItems !: ElementRef<HTMLInputElement>;

  @ViewChild('chkPrivEditItems')
  chkPrivEditItems !: ElementRef<HTMLInputElement>;

  @ViewChild('chkPrivDelItems')
  chkPrivDelItems !: ElementRef<HTMLInputElement>;

  @ViewChild('txtPrivEditText') txtPrivEditText!: ElementRef<HTMLInputElement>;
  @ViewChild('txtPrivAddItems') txtPrivAddItems!: ElementRef<HTMLInputElement>;
  @ViewChild('txtPrivEditItems') txtPrivEditItems!: ElementRef<HTMLInputElement>;
  @ViewChild('txtPrivDelItems') txtPrivDelItems!: ElementRef<HTMLInputElement>;

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
    const privilegesAsNumbers = this.privileges.map(privilege => privilege ? 1 : 0);
    this.service.createUser(this.email, privilegesAsNumbers).subscribe((user) => {
      if (user.email == this.email){
        console.log('fine')// TODO alert que salio bien
        this.reload();
        // location.reload();
      }
    });
  }

  reload(): void {
    this.email = '';
    this.checkedPrivilages = this.privileges = [false, false, false, false];

    const checkboxes = [
      this.txtPrivEditText.nativeElement,
      this.txtPrivAddItems.nativeElement,
      this.txtPrivEditItems.nativeElement,
      this.txtPrivDelItems.nativeElement
    ];

    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });

    this.users = [];
    this.service.getAllUsers().subscribe((users) => {
      for (let i = 0; i < users.length; i++) {
        this.users.push({ userEmail: users[i].email, privAddItems: users[i].privileges[0] == 1, privEditItems: users[i].privileges[1] == 1, privDelItems: users[i].privileges[2] == 1, privCreateUsers: users[i].privileges[3] == 1, editable: false })
      }
    });
  }

  getData(): void {
    this.service.getAllUsers().subscribe((users) => {
      for (let i = 0; i < users.length; i++) {
        this.users.push({ userEmail: users[i].email, privAddItems: users[i].privileges[0] == 1, privEditItems: users[i].privileges[1] == 1, privDelItems: users[i].privileges[2] == 1, privCreateUsers: users[i].privileges[3] == 1, editable: false })
      }
    });
  }

  editUser(user: UsersTableRow): void {
    user.editable = true;
    this.isEditing = true;
    this.originalEmail = user.userEmail;
  }

  saveUser(user: UsersTableRow, index: number): void {
    console.log('save') // TODO alert de confirmacion
    for (let i = 0; i < this.users.length; i++) {
      if (!this.isEmail(user.userEmail) || (this.users[i].userEmail == user.userEmail && i != index)){
        console.log('email repetido o invalido') // TODO alert
        return;
      }
    }

    if (!this.existSuperAdminWithout(user)){
      if (!user.privAddItems || !user.privCreateUsers || !user.privDelItems || !user.privEditItems){
        console.log('ocupa super admin'); // TODO alert
        return;
      }
    }

    this.service.getAllUsers().subscribe((users) => {
      const privilegesAsNumbers = [user.privAddItems ? 1 : 0, user.privEditItems ? 1 : 0,
                                   user.privDelItems ? 1 : 0, user.privCreateUsers ? 1 : 0]
      this.service.updateUserByEmail(users[index].email, user.userEmail, users[index].password, privilegesAsNumbers).subscribe((response) => {
        if (response.message == 'Successfully modified'){
          user.editable = false;
          this.isEditing = false;
          this.selectedUser = null;
          console.log('exito') // TODO alert
          location.reload();
        }else{
          console.log('error') // TODO alert
        }
      });
    });
  }

  existSuperAdminWithout(user: UsersTableRow): boolean {
    const index = this.users.indexOf(user);
    const newUsersList = [...this.users.slice(0, index), ...this.users.slice(index + 1)];
    for (const item of newUsersList) {
      if (item.privCreateUsers && item.privAddItems && item.privDelItems && item.privEditItems) {
        return true;
      }
    }
    console.log("no puede dejar sin superadmin") // TODO alert
    return false;
  }

  deleteUser(user: UsersTableRow): void {
    // TODO alert dde confirmacion
    this.selectedUser = null;
    this.isEditing = false;

    if (this.existSuperAdminWithout(user)){
      this.service.deleteUserByEmail(user.userEmail).subscribe((response) => {
        if (response.message == 'Successfully deleted'){
          // TODO alert de listo
          console.log('exito')
          this.users.splice(this.users.indexOf(user), 1);
        }else{
          console.log('error')
        }
      });
    }
  }

  reset(user: UsersTableRow, index: number): void {
    user.editable = false;
    this.isEditing = false;
    this.selectedUser = null;

    this.service.getAllUsers().subscribe((users) => {
      user.userEmail = users[index].email;
      user.privAddItems = users[index].privileges[0] == 1 ? true : false;
      user.privEditItems = users[index].privileges[1] == 1 ? true : false;
      user.privDelItems = users[index].privileges[2] == 1 ? true : false;
      user.privCreateUsers = users[index].privileges[3] == 1 ? true : false;
    });
  }

}
