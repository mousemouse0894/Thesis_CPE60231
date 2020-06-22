import { AppService } from './../../../services/app.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-group-student',
  templateUrl: './group-student.component.html',
  styleUrls: ['./group-student.component.scss'],
})
export class GroupStudentComponent implements OnInit {
  public groupStudent: any = null;
  public formInsertgroup: FormGroup;
  constructor(public service: AppService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formInsertgroup = this.formBuilder.group({
      groupname: ['', Validators.required],
      password: ['', Validators.required],
      status: ['', Validators.required],
    });
    this.onGetgroupstudent();
  }

  public onGetgroupstudent = () => {
    this.service
      .httpGet(
        '/groupst/getowner/' +
          this.service.localStorage.get('userLogin')['uid'] +
          `?token=${this.service.localStorage.get('userLogin')['token']}`
      )
      .then((value: any) => {
        if (value.success) {
          this.groupStudent = value.result;
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  public onInsartgroup = () => {
    let data = {
      groupname: this.formInsertgroup.value.groupname,
      password: this.formInsertgroup.value.password,
      status: this.formInsertgroup.value.status,
      owner: this.service.localStorage.get('userLogin')['uid'],
    };
    console.log(this.formInsertgroup.value);
    this.service
      .httpPost(
        `/groupst/insert?token=${
          this.service.localStorage.get('userLogin')['token']
        }`,
        JSON.stringify(data)
      )
      .then((value: any) => {
        if (value.success) {
          this.service.showAlert('', value.message, 'success');
          this.onGetgroupstudent();
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };
}
