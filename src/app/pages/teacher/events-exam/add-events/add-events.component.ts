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
  public CheckSelectexam: boolean = false;
  public CheckCreateexam: boolean = false;
  public historyTestResult: any = null;
  public TestResult: any = null;
  constructor(public service: AppService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formInserttest = this.formBuilder.group({
      groupID_fk: ['', Validators.required],
      exambodyID_fk: ['', Validators.required],
      topicPassword: ['', Validators.required],
      dateStart: ['', Validators.required],
      timeStart: ['', Validators.required],
      dateEnd: ['', Validators.required],
      timeEnd: ['', Validators.required],
      topicText: ['', Validators.required],
      owner: this.service.localStorage.get('userLogin')['uid'],
      limitIP: ['false'],
      statusHistory: ['0'],
    });

    this.getExamSet();
    this.onGetgroupstudent();
    this.onGetexamtopic();
    console.log(this.service.localStorage.get('userLogin'));
  }

  public selectExamView = (list: Array<any>) => {
    this.examView = list;
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
          this.listExamSet = val.result;
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
          console.log(this.formInserttest.value);
          this.onGetexamtopic();
          this.CheckSelectexam = false;
          this.CheckSelectexam = false;
          this.service.showAlert('', 'สำเร็จ', 'success');
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
    this.CheckSelectexam = true;
    this.service.showAlert('', 'เลือกข้อสอบ' + x.topic, 'success');
  };

  public onCreateExam = () => {
    this.CheckCreateexam = true;
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
          this.service.showAlert('', 'สำเร็จ', 'success');
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  public historyTest = (x: any) => {
    console.log(x);
    this.service
      .httpGet(
        `stTesting/teacherGetHistory/${x.examtopicID}/${x.groupID_fk}?token=${
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
}
