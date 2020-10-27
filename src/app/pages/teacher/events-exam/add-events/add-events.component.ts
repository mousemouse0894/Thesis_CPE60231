import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-events',
  templateUrl: './add-events.component.html',
  styleUrls: ['./add-events.component.scss'],
})
export class AddEventsComponent implements OnInit {
  public formInserttest: FormGroup;
  public groupStudent: any = null;
  public listExamSet: Array<any> = [];
  public examView: Array<any> = [];
  public paginationPage: number = 1;
  public examTopic: any = null;
  public selectBody: any = null;
  public historySelected: any = null;
  public CheckCreateexam: boolean = false;
  public historyTestResult: any = null;
  public studentScore: any = null;
  public studentScoreDetail: any = null;
  public currentTime: Date = new Date();
  public topicSelect: any = null;

  constructor(public service: AppService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initialFrom();
    this.getExamSet();
    this.onGetgroupstudent();
    this.onGetexamtopic();
    this.getCurrentTime();
  }

  public initialFrom = () => {
    this.formInserttest = this.formBuilder.group({
      examtopicID: [''],
      groupID_fk: ['', Validators.required],
      exambodyID_fk: ['', Validators.required],
      topicPassword: ['', Validators.required],
      timeStart: ['', Validators.required],
      timeEnd: ['', Validators.required],
      topicText: ['', Validators.required],
      owner: this.service.localStorage.get('userLogin')['uid'],
      limitIP: ['', Validators.required],
      statusHistory: ['0'],
      statusAdvice: ['0'],
    });
  };

  replaceText = (data: string) => {
    let div = document.createElement('div');
    div.innerHTML = data;
    let text: string = div.textContent || div.innerText || '';
    return text.length > 30 ? text.substring(0, 30) + '...' : text;
  };

  public getCurrentTime = () => {
    this.service
      .httpGet(
        `/getDateTime?token=${
          this.service.localStorage.get('userLogin')['token']
        }`
      )
      .then((val: any) => {
        this.currentTime = new Date(val.result);
      });
  };

  public selectExamView = (list: Array<any>) => {
    this.examView = list;
  };

  timeRemake = (time) => {
    let dt = new Date(time);
    return `${
      dt.toISOString().split('T')[0]
    } ${dt.getHours()}:${dt.getMinutes()}`;
  };

  isTimeOver = (tiemEnd) => {
    return new Date(tiemEnd).getTime() <= new Date().getTime();
  };

  public getExamSet = () => {
    this.service
      .httpGet(
        `/exbody/getExamBody/${
          this.service.localStorage.get('userLogin')['uid']
        }?token=${this.service.localStorage.get('userLogin')['token']}`
      )
      .then((val: any) => {
        if (val.result.length > 0) {
          this.listExamSet = val.result.filter((e) => {
            return e.status != 'off';
          });
        } else {
          this.listExamSet = [];
        }
      });
  };

  public insertTopic = () => {
    this.service
      .httpPost(
        `extopic/insert?token=${
          this.service.localStorage.get('userLogin')['token']
        }`,
        JSON.stringify(this.formInserttest.value)
      )
      .then((value: any) => {
        if (value.success) {
          this.onGetexamtopic();
          this.selectBody = null;
          this.service.showAlert('', 'บันทึกข้อมูลสำเร็จ', 'success');
        } else {
          this.service.showAlert('', value.message, 'error');
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

  public onSelectExam = (x: any) => {
    this.formInserttest.patchValue({
      exambodyID_fk: x.exambodyID,
    });
    this.selectBody = x;
    this.service.modal.hide('exampleModalSelectBody');
  };

  public onGetexamtopic = () => {
    this.service
      .httpGet(
        `/extopic/get/${
          this.service.localStorage.get('userLogin')['uid']
        }?token=${this.service.localStorage.get('userLogin')['token']}`
      )
      .then((value: any) => {
        if (value.success) {
          this.examTopic = value.result;
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
          this.onGetexamtopic();
          this.service.showAlert('', 'บันทึกข้อมูลสำเร็จ', 'success');
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  public historyTest = (data: any) => {
    this.service.navRouter(
      `/events-exam/${data.examtopicID}/${data.groupID_fk}`
    );
  };

  public selectBeforeUpdate = (data: any) => {
    this.topicSelect = data;
    this.formInserttest.patchValue({
      examtopicID: data['examtopicID'],
      groupID_fk: data['groupID_fk'],
      exambodyID_fk: data['exambodyID_fk'],
      topicPassword: data['topicPassword'],
      timeStart: data['timeStart'],
      timeEnd: data['timeEnd'],
      topicText: data['topicText'],
      limitIP: data['limitIP'],
      statusHistory: data['statusHistory'],
      statusAdvice: data['statusAdvice'],
    });
  };

  public onUpdateTopic = () => {
    this.service
      .httpPost(
        `extopic/updateTopic?token=${
          this.service.localStorage.get('userLogin')['token']
        }`,
        JSON.stringify(this.formInserttest.value)
      )
      .then((value: any) => {
        if (value.success) {
          this.onGetexamtopic();
          this.selectBody = null;
          this.topicSelect = null;
          this.service.showAlert('', 'บันทึกข้อมูลสำเร็จ', 'success');
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  public onDeleteTopic = (data) => {
    this.service
      .showConfirm(
        'ยืนยันการลบ',
        `รหัสรายการสอบ : ${data.examtopicID}`,
        'warning'
      )
      .then((val: boolean) => {
        if (val) {
          this.service
            .httpPost(
              `extopic/deltopic?token=${
                this.service.localStorage.get('userLogin')['token']
              }`,
              JSON.stringify(data)
            )
            .then((value: any) => {
              if (value['success']) {
                this.onGetexamtopic();
                this.service.showAlert('', 'ลบข้อมูลสำเร็จ', 'success');
              } else {
                this.service.showAlert('', value.message, 'error');
              }
            });
        }
      });
  };
}
