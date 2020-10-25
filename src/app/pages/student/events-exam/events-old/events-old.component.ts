import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-events-old',
  templateUrl: './events-old.component.html',
  styleUrls: ['./events-old.component.scss'],
})
export class EventsOldComponent implements OnInit {
  public Topictestresult: Array<any> = [];
  public currentTime: Date = new Date();
  public historySelected: any = null;
  public historyTestResult: Array<any> = [];

  constructor(public service: AppService) {}

  ngOnInit(): void {
    this.getTopictest();
    this.getCurrentTime();
  }

  filterTopicList = (topic: Array<any>) => {
    return topic.filter((e) => {
      return new Date(e.timeEnd).getTime() <= this.currentTime.getTime();
    });
  };

  timeRemake = (time) => {
    let dt = new Date(time);
    return `${
      dt.toISOString().split('T')[0]
    } ${dt.getHours()}:${dt.getMinutes()}`;
  };

  public getCurrentTime = () => {
    this.service
      .httpGet(
        `/getDateTime?token=${
          this.service.localStorage.get('userLogin')['token']
        }`
      )
      .then((val: any) => {
        this.currentTime = new Date(`${val.result}`.replace(/ /g, 'T'));
      });
  };

  public getTopictest = () => {
    this.service
      .httpGet(
        `/extopic/getMyEventTopic/${
          this.service.localStorage.get('userLogin')['groupid_fk']
        }?token=${this.service.localStorage.get('userLogin')['token']}
    `
      )
      .then((value: any) => {
        if (value.success) {
          this.Topictestresult = value.result;
        } else {
          this.service.showAlert('', value.massage, 'error');
        }
      });
  };

  public historyTest = (x: any) => {
    this.historySelected = x;
    console.log(x);
    this.service
      .httpGet(
        `stTesting/teacherGetHistory/${x.examtopicID}/${x.groupID_fk}?token=${
          this.service.localStorage.get('userLogin')['token']
        }`
      )
      .then((value: any) => {
        if (value.success) {
          if (value.result.length > 0) {
            this.historyTestResult = [
              ...value.result.filter((e) => {
                return (
                  e.studentId ==
                  this.service.localStorage.get('userLogin')['studentId']
                );
              }),
            ];

            console.log(this.historyTestResult);
          }
        } else {
          this.service.showAlert(``, value.massage, `error`);
        }
      });
  };

  subString = (str: any) => {
    return String(str).length > 4 ? String(str).substring(0, 5) : String(str);
  };
}
