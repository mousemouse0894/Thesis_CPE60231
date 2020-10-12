import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-detail-events',
  templateUrl: './detail-events.component.html',
  styleUrls: ['./detail-events.component.scss'],
})
export class DetailEventsComponent implements OnInit {
  public testResult: Object = null;
  public historyTestResult: Array<any> = [];
  public numTopicList: Array<any> = [];
  public listSelect: number = 0;
  public examId: string = '';
  public groupId: string = '';

  constructor(
    private activeRoute: ActivatedRoute,
    public service: AppService
  ) {}

  ngOnInit(): void {
    this.examId = this.activeRoute.snapshot.paramMap.get('examId');
    this.groupId = this.activeRoute.snapshot.paramMap.get('groupId');

    this.testHistory();
    this.onGetexamtopic();
  }

  private onGetexamtopic = () => {
    this.service
      .httpGet(
        `/extopic/get/${
          this.service.localStorage.get('userLogin')['uid']
        }?token=${this.service.localStorage.get('userLogin')['token']}`
      )
      .then((value: any) => {
        if (value.success) {
          let resultFilter = value.result.filter((e) => {
            return e.examtopicID == this.examId && this.groupId == e.groupID_fk;
          });
          this.testResult = resultFilter.length > 0 ? resultFilter[0] : null;
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  private testHistory = () => {
    this.service
      .httpGet(
        `stTesting/teacherGetHistory/${this.examId}/${this.groupId}?token=${
          this.service.localStorage.get('userLogin')['token']
        }`
      )
      .then((value: any) => {
        if (value.success) {
          if (value.result.length > 0) {
            this.historyTestResult = value.result;
            this.historyTestResult = this.historyTestResult.sort((a, b) => {
              return b['studentId'] - a['studentId'];
            });

            let a = this.historyTestResult.sort((a, b) => {
              return b['testData']['length'] - a['testData']['length'];
            });

            this.numTopicList = a[0]['testData'];
          }
        } else {
          this.service.showAlert(``, value.massage, `error`);
        }
      });
  };

  public detailScore = (data) => {
    this.service.navRouter(
      `/events-exam/${this.examId}/${this.groupId}/${data.studentId}`
    );
  };

  timeRemake = (time) => {
    let dt = new Date(time);
    return `${
      dt.toISOString().split('T')[0]
    } ${dt.getHours()}:${dt.getMinutes()}`;
  };

  subString = (str: any) => {
    return String(str).length > 4 ? String(str).substring(0, 5) : String(str);
  };
}
