import { AppService } from './../../../services/app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-log-student',
  templateUrl: './log-student.component.html',
  styleUrls: ['./log-student.component.scss'],
})
export class LogStudentComponent implements OnInit {
  public logResult:any = null;
  constructor(public service: AppService) {}

  ngOnInit() {
    this.onGetlogstudent();
  }

  public onGetlogstudent = () => {
    this.service
      .httpGet(
        `/logmember/${
          this.service.localStorage.get('userLogin')['uid']
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