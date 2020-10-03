import { AppService } from './../../../services/app.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

const _window: any = window;

@Component({
  selector: 'app-group-student',
  templateUrl: './group-student.component.html',
  styleUrls: ['./group-student.component.scss'],
})
export class GroupStudentComponent implements OnInit {
  public groupStudent: Array<any> = [];
  public studentingroup: any = null;
  public formInsertgroup: FormGroup;
  public checkedit: boolean = false;
  public logResult: any = null;
  public groupSelectName: any = null;
  public pagiShowstudent: number = 1;
  public historyTopicResult: any = null;
  public historyTestResult: any = null;
  public TestResult: any = null;
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

  public onDeleteGroup = (group: any) => {
    this.service
      .showConfirm(
        `ยืนยันการลบกลุ่มเรียน ${group.name}`,
        `ข้อมูลนักศึกษาและข้อมูลการสอบทั้งหมดในกลุ่มนี้จะถูกลบด้วย`,
        `warning`
      )
      .then((isConform: boolean) => {
        if (isConform) {
          this.service
            .httpPost(
              `groupst/del?token=${
                this.service.localStorage.get('userLogin')['token']
              }`,
              JSON.stringify(group)
            )
            .then((val: any) => {
              if (val.success) {
                this.onGetgroupstudent();
                this.service.showAlert(
                  `ลบกลุ่มเรียน ${group.name} สำเร็จ`,
                  ``,
                  `success`
                );
              } else {
                this.service.showAlert('', val.message, 'error');
              }
            });
        }
      });
  };

  public onGetgroupstudent = () => {
    this.groupStudent = [];
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
            this.service.showAlert('', 'บันทึกสำเร็จ', 'success');
            this.onGetgroupstudent();
            _window.$(`#exampleModalEditGroup`).modal('hide');
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
            this.service.showAlert('', 'บันทึกสำเร็จ', 'success');
            this.onGetgroupstudent();
            _window.$(`#exampleModalEditGroup`).modal('hide');
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
    this.groupSelectName = data;

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

  public onDeletestudent = (x: any) => {
    console.log(x);
    this.service
      .showConfirm('ยืนยันการลบรายชื่อจากกลุ่มเรียน', '', 'warning')
      .then((val: boolean) => {
        if (val) {
          let data = {
            username: x.uid,
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
                this.getStudentingroup(x);
              } else {
                this.service.showAlert('', value.message, 'error');
              }
            });
        }
      });
  };

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

  public historyTopic = (x: any) => {
    this.service
      .httpGet(
        `stTesting/teacherGetTopic/${x.groupID}?token=${
          this.service.localStorage.get('userLogin')['token']
        }`
      )
      .then((value: any) => {
        if (value.success) {
          this.historyTopicResult = value.result;
        } else {
          this.service.showAlert(``, value.massage, `error`);
        }
      });
  };

  public historyTest = (x: any) => {
    this.service
      .httpGet(
        `stTesting/teacherGetHistory/${x.examtopicID}?token=${
          this.service.localStorage.get('userLogin')['token']
        }`
      )
      .then((value: any) => {
        if (value.success) {
          this.historyTestResult = value.result;
        } else {
          this.service.showAlert(``, value.massage, `error`);
        }
      });
  };

  public getStdDatatest = (x) => {
    this.TestResult = x.testData;
    console.log(x);
  };

  public updateScore = (x: any, score: any) => {
    let data = {
      teacherScore: score,
      stID_fk: x.stID_fk,
      topicID_fk: x.topicID_fk,
      storeID_fk: x.storeID,
    };

    this.service
      .httpPost(
        `stTesting/teacherUpdateScore?token=${
          this.service.localStorage.get('userLogin')['token']
        }
  `,
        JSON.stringify(data)
      )
      .then((value: any) => {
        if (value.success) {
          this.service.showAlert('', 'สำเร็จ', 'success');
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  public onToggle = (x: any) => {
    let data = {
      statusHistory: x.statusHistory == 1 ? 0 : 1,
      examtopicID: x.examtopicID,
      owner: x.owner,
    };
    this.service
      .httpPost(
        `extopic/setHistoryTesting?token=${
          this.service.localStorage.get('userLogin')['token']
        }`,
        JSON.stringify(data)
      )
      .then((value: any) => {
        if (value.success) {
          this.service.showAlert('', 'สำเร็จ', 'success');
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };
}
