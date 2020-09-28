import { AppService } from './../../../services/app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history-test',
  templateUrl: './history-test.component.html',
  styleUrls: ['./history-test.component.scss'],
})
export class HistoryTestComponent implements OnInit {
  public getTopictestResult: any = null;
  public getStudenttestResult: any = null;
  constructor(public service: AppService) {}

  ngOnInit() {
    this.getTopictest();
  }

  public getTopictest = () => {
    this.service
      .httpGet(
        `stTesting/stHistoryTopicTest/${
          this.service.localStorage.get('userLogin')['uid']
        }?token=${this.service.localStorage.get('userLogin')['token']}`
      )
      .then((value: any) => {
        if (value.success) {
          this.getTopictestResult = value.result;
          console.log(this.getTopictestResult);
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  public getStudenttest = (x) => {
    console.log(x);
    this.service
      .httpGet(
        `stTesting/stHistoryTest/${
          this.service.localStorage.get('userLogin')['uid']
        }/${x.examtopicID}?token=${
          this.service.localStorage.get('userLogin')['token']
        }`
      )
      .then((value: any) => {
        if (value.success) {
          this.getStudenttestResult = value.result;
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };
}
