import { AppService } from './../../services/app.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  public formChangepassword: FormGroup;
  constructor(public service:AppService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.formChangepassword = this.formBuilder.group({
      oldpassword: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required]
    });
  }

  public onChangepassword = () =>{
    let data = {
        username: this.service.localStorage.get('userLogin')['uid'],
        personalId:this.service.localStorage.get('userLogin')['personalId'],
        password:this.formChangepassword.value.password,
        oldpassword:this.formChangepassword.value.oldpassword
    }
    if(this.formChangepassword.value.password==this.formChangepassword.value.password2){
        this.service.httpPost(`/repw?token=${this.service.localStorage.get('userLogin')['token']}`,JSON.stringify(data)).then((value:any)=>{
          if(value.success){
            this.service.showAlert('', value.message, 'success');
          }else{
            this.service.showAlert('', value.message, 'error');
          }

        })
    }else{
      this.service.showAlert('','รหัสผ่านไม่ตรงกัน','error');
    }

  }

}
