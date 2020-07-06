import { AppService } from './../../../services/app.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


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
  public logResult: any = null;
  constructor(public service: AppService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formInsertgroup = this.formBuilder.group({
      groupname: ['', Validators.required],
      password: ['', Validators.required],
      status: ['', Validators.required],
      owner: this.service.localStorage.get('userLogin')['uid'],
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
    this.formInsertgroup.value.groupname = 'CPE.'+ this.formInsertgroup.value.groupname
    if (this.checkedit) {
      //updategroup
      this.service
        .httpPost(
          `/groupst/update?token=${
            this.service.localStorage.get('userLogin')['token']
          }`,
          JSON.stringify(this.formInsertgroup.value)
        )
        .then((value: any) => {
          if (value.success) {
            console.log(value);
            this.checkedit = false;
            this.service.showAlert('', 'เเก้ไขสำเร็จ', 'success');
            this.onGetgroupstudent();
          } else {
            this.service.showAlert('', value.message, 'error');
          }
        });
    } else {
      //insartgroup
      this.service
        .httpPost(
          `/groupst/insert?token=${
            this.service.localStorage.get('userLogin')['token']
          }`,
          JSON.stringify(this.formInsertgroup.value)
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
    x: any,
  ) => {
    this.formInsertgroup = this.formBuilder.group({
      groupID: x.groupID,
      groupname: [x.name.replace('CPE.',''), Validators.required],
      password: [x.password, Validators.required],
      status: [x.status, Validators.required],
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

    //------------------------------------------------------------------------
  // getlog
  public onGetlogstudent = (studentid:any) => {
    this.service
      .httpGet(
        `/logmember/${
          studentid
        }?token=${this.service.localStorage.get('userLogin')['token']}`
      )
      .then((value: any) => {
        if (value.success) {
          this.logResult = value.result
          console.log(value);
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };


}
