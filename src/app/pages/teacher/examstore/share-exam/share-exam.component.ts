import { AppService } from './../../../../services/app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-share-exam',
  templateUrl: './share-exam.component.html',
  styleUrls: ['./share-exam.component.scss'],
})
export class ShareExamComponent implements OnInit {
  public examResult: any = null;
  public teacherResult: any = null;
  public resultSelectExam: any = null;
  public checkSelectexam: boolean = false;
  constructor(public service: AppService) {}

  ngOnInit() {
    this.onGetexam();
    this.getTeacher();
  }

  public onGetexam = () => {
    this.service
      .httpGet(
        `/exstore/get/${
          this.service.localStorage.get('userLogin')['uid']
        }?token=${this.service.localStorage.get('userLogin')['token']}`
      )
      .then((value: any) => {
        if (value.success) {
          this.examResult = value.result;
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  public getTeacher = () => {
    this.service
      .httpGet(
        `/exstore/getTeacher/${
          this.service.localStorage.get('userLogin')['uid']
        }?token=${this.service.localStorage.get('userLogin')['token']}`
      )
      .then((value: any) => {
        if (value.success) {
          this.teacherResult = value.result;
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  public selectExam = (selectExam: any) => {
    this.resultSelectExam = selectExam;
    this.checkSelectexam = true;
  };

  public shareExam = (selectTeacher: any) => {
    let data = {
      text: this.resultSelectExam.text,
      answer: this.resultSelectExam.answer,
      keyword: this.resultSelectExam.keyword,
      databaseName: this.resultSelectExam.databaseName,
      newOwner: selectTeacher.uid,
      owner: this.service.localStorage.get('userLogin')['uid'],
      storeID: this.resultSelectExam.storeID,
      score: this.resultSelectExam.score,
    };

    console.log(data);
    this.service
      .httpPost(
        `/exstore/shareExam?token=${
          this.service.localStorage.get('userLogin')['token']
        }`,
        JSON.stringify(data)
      )
      .then((value: any) => {
        if (value.success) {
          this.service.showAlert('', 'แชร์สำเร็จ', 'success');
          this.checkSelectexam = false;
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };
}
