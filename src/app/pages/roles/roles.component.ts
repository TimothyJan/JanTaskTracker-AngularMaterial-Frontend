import { Component } from '@angular/core';
import { RoleCreateComponent } from "./role-create/role-create.component";
import { RoleListComponent } from "./role-list/role-list.component";

@Component({
  selector: 'app-roles',
  imports: [RoleCreateComponent, RoleListComponent],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css',
  standalone: true
})
export class RolesComponent {

}
