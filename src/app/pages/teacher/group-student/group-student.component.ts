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
  public studentingroup: any = null;
  public formInsertgroup: FormGroup;
  public checkedit: boolean = false;
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
    if (this.checkedit) {
      //updategroup
      console.log(JSON.stringify(this.formInsertgroup.value));
      this.service
        .httpPost(
          `/groupst/update?token=${
            this.service.localStorage.get('userLogin')['token']
          }`,
          JSON.stringify(this.formInsertgroup.value)
        )
        .then((value: any) => {
          if (value.success) {
            this.checkedit = false;
            this.service.showAlert('', 'เพิ่มสำเร็จ', 'success');
            this.onGetgroupstudent();
          } else {
            this.service.showAlert('', value.message, 'error');
          }
        });
    } else {
      //insartgroup
      let data = {
        groupname: this.formInsertgroup.value.groupname,
        password: this.formInsertgroup.value.password,
        status: this.formInsertgroup.value.status,
        owner: this.service.localStorage.get('userLogin')['uid'],
      };
      this.service
        .httpPost(
          `/groupst/insert?token=${
            this.service.localStorage.get('userLogin')['token']
          }`,
          JSON.stringify(data)
        )
        .then((value: any) => {
          if (value.success) {
            this.service.showAlert('', 'เเก้ไขสำเร็จ', 'success');
            this.onGetgroupstudent();
          } else {
            this.service.showAlert('', value.message, 'error');
          }
        });
    }
  };

  public onEditgroup = (
    groupID: any,
    name: String,
    status: String,
    password: String
  ) => {
    this.formInsertgroup = this.formBuilder.group({
      groupID: groupID,
      groupname: [name, Validators.required],
      password: [password, Validators.required],
      status: [status, Validators.required],
    });
    this.checkedit = true;
  };

  public getStudentingroup = (groupId: any) => {
    this.service
      .httpGet(
        '/groupst/getstingroup/' +
          groupId +
          '?token=' +
          this.service.localStorage.get('userLogin')['token']
      )
      .then((value: any) => {
        if (value.success) {
          this.studentingroup = value.result;
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  public onDeletestudent = (uid: any,groupid_fk:any) => {
    let data = {
      username: uid
    };
    console.log(data);
    this.service
      .httpPost(
        '/groupst/clearmember?token=' +
          this.service.localStorage.get('userLogin')['token'],
        JSON.stringify(data)
      )
      .then((value: any) => {
        if (value.success) {
          this.service.showAlert('', 'ลบสำเร็จ', 'success');
          this.getStudentingroup(groupid_fk);
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };
}
