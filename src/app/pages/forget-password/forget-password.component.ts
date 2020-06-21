import { AppService } from './../../services/app.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent implements OnInit {
  public formForgetpass: FormGroup;
  constructor(public service: AppService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formForgetpass = this.formBuilder.group({
      username: ['', Validators.required],
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      personalId: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  public onForgetpassword = () => {
    console.log(this.formForgetpass.value);
    this.service
      .httpPost(`/rememberpw`, JSON.stringify(this.formForgetpass.value))
      .then((value: any) => {
        if (value.success) {
          this.service.showAlert('', value.message, 'success');
          this.service.navRouter('/login');
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };
}
