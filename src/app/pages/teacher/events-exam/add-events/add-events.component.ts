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
  public onCheckSelectexam: boolean = false;

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
          this.onCheckSelectexam = false;
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
    this.onCheckSelectexam = true;
    this.service.showAlert('', 'เลือกข้อสอบ' + x.topic, 'success');
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
}
