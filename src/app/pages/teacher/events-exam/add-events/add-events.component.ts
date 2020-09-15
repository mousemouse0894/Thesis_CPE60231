import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-add-events',
  templateUrl: './add-events.component.html',
  styleUrls: ['./add-events.component.scss'],
})
export class AddEventsComponent implements OnInit {
  public examResult: any = null;
  public getunit: any = null;
  constructor(public service: AppService) {}

  ngOnInit() {
    this.onGetexam();
    this.getUnittable();
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
  public getUnittable = () => {
    this.service
      .httpGet(
        '/examunit/get/' +
          this.service.localStorage.get('userLogin')['uid'] +
          '?token=' +
          this.service.localStorage.get('userLogin')['token']
      )
      .then((value: any) => {
        if (value.success) {
          this.getunit = value.result;
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };
}
