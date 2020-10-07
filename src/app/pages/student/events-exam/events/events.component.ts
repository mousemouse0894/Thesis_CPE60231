import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  public Topictestresult: Array<any> = [];
  public currentTime: Date = new Date();

  constructor(public service: AppService) {}

  ngOnInit(): void {
    this.getTopictest();
    this.getCurrentTime();
  }

  filterTopicList = (topic: Array<any>) => {
    return topic.filter((e) => {
      return new Date(e.timeEnd) > this.currentTime;
    });
  };

  public openNewtab = (path: any) => {
    window.open(environment.url + 'events/' + path, '_blank');
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
        this.currentTime = new Date(val.result);
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
}
