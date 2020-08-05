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
  public groupSelectName: string = '';

  constructor(public service: AppService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formInsertgroup = this.formBuilder.group({
      groupID: [''],
      groupname: ['', Validators.required],
      password: ['', Validators.required],
      status: ['on', Validators.required],
      owner: this.service.localStorage.get('userLogin')['uid'],
    });

    this.onGetgroupstudent();
  }

  public onInsertGroup = () => {
    this.formInsertgroup.patchValue({
      groupID: '',
      groupname: '',
      password: '',
      status: 'on',
    });

    this.checkedit = false;
  };

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
    this.formInsertgroup.patchValue({
      groupname: 'CPE.' + this.formInsertgroup.value.groupname,
    });

    console.log('asdasd');

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

  public onEditgroup = (x: any) => {
    this.formInsertgroup.patchValue({
      groupID: x.groupID,
      groupname: x.name.replace('CPE.', ''),
      password: x.password,
      status: x.status,
    });

    this.checkedit = true;
  };

  public getStudentingroup = (data: any) => {
    this.studentingroup = null;
    this.groupSelectName = data.name;

    this.service
      .httpGet(
        '/groupst/getstingroup/' +
          data.groupID +
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

  public onDeletestudent = (uid: any, groupid_fk: any) => {
    this.service
      .showConfirm('ยืนยันการลบรายชื่อจากกลุ่มเรียน', '', 'warning')
      .then((val: boolean) => {
        if (val) {
          let data = {
            username: uid,
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
        }
      });
  };

  //------------------------------------------------------------------------
  // getlog
  public onGetlogstudent = (studentid: any) => {
    this.service
      .httpGet(
        `/logmember/${studentid}?token=${
          this.service.localStorage.get('userLogin')['token']
        }`
      )
      .then((value: any) => {
        if (value.success) {
          this.logResult = value.result;
          console.log(value);
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };
}
