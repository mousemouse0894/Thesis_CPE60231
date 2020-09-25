import { AppService } from 'src/app/services/app.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-events-exam',
  templateUrl: './events-exam.component.html',
  styleUrls: ['./events-exam.component.scss'],
})
export class EventsExamComponent implements OnInit {
  public Topictestresult: any = null;
  constructor(public service: AppService) {}

  ngOnInit() {
    this.getTopictest();
  }

  public openNewtab = (path: any) => {
    window.open(
      environment.url + 'events/' + path,
      '',
      'width=1024, height=728'
    );
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
          console.log(value);
        } else {
          this.service.showAlert('', value.massage, 'error');
        }
      });
  };
}
