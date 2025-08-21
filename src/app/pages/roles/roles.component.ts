import { Component } from '@angular/core';
import { RoleListComponent } from "./role-list/role-list.component";
import { RoleDialogComponent } from '../../dialogs/role-dialog/role-dialog.component';

import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-roles',
  imports: [
    RoleListComponent,
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css',
  standalone: true
})
export class RolesComponent {

  constructor(
    private dialog: MatDialog
  ) {}

  onOpenRoleDialog(): void {
    this.dialog.open(RoleDialogComponent, {
      width: '500px',
      data: { }
    });
  }

}
