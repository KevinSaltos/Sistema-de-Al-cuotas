import { Component, Input, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UsersHttpService } from 'src/app/services/user.service';
import { UserListComponent } from '../user-list/user-list.component';
import { UserModel } from 'src/app/models/user.model';
import { CatalogueModel } from 'src/app/models/catalogue.model';
import { CatalogueService } from 'src/app/services/catalogue.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent {
  id?: any;
  form: FormGroup;
  user?: UserModel;
  state: CatalogueModel[]
  states: CatalogueModel[] = []

  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersHttpService,
    private route: Router,
    private catalogueService: CatalogueService
  ) {
    this.form = this.newForm();
    this.findUser();
    this.findCatalogues()
  }

  newForm(): FormGroup {
    return this.formBuilder.group({
      email: [null, [Validators.required]],
      name: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      identification: [null, [Validators.required]],
      cellPhone: [null, [Validators.required]],
      state: [null, [Validators.required]],
    });
  }


  findUser() {
    this.id = JSON.parse(String(localStorage.getItem('id')));
    this.userService.findOne(this.id).subscribe((res) => {
      this.user = res;
      this.form.patchValue(res);
    });
  }

  findCatalogues(){
    this.catalogueService.findAll().subscribe((res) => {
      this.state = res.data
      this.state.forEach((state) => {
      if(state.code === 'state'){
        this.states.push(state)
      }
      })
    })
  }

  create(user: UserModel) {
    this.userService.create(user).subscribe(() => {
      this.form.reset();
      this.close();
    });
  }

  update(user: UserModel) {
    this.id = JSON.parse(String(localStorage.getItem('id')));
    this.userService.update(this.id, user).subscribe(() => {
      this.form.reset();
      this.close();
    });
  }

  close() {
    localStorage.removeItem('id');
    this.route.navigate(['dashboard/user']);
  }

  onSubmit() {
    if (this.id) {
      this.update(this.form.value);
    } else {
      this.create(this.form.value);
    }
  }

  get stateField(): AbstractControl {
    return this.form.controls['state'];
  }

  
  cerrarSesion(){
    localStorage.removeItem('id');
    this.route.navigate(['']);
  }
}
