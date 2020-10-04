import { AppService } from './../../../../services/app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-share-exam',
  templateUrl: './share-exam.component.html',
  styleUrls: ['./share-exam.component.scss'],
})
export class ShareExamComponent implements OnInit {
  public examResult: Array<any> = [];
  public examSelected: any = null;

  constructor(public service: AppService) {}

  ngOnInit() {
    this.onGetexam();
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

  public filterShare = () => {
    return this.examResult.filter((e) => {
      return (
        e.owner != this.service.localStorage.get('userLogin')['uid'] &&
        e.oldOwner == this.service.localStorage.get('userLogin')['uid']
      );
    });
  };

  public filterReceive = () => {
    return this.examResult.filter((e) => {
      return (
        e.owner == this.service.localStorage.get('userLogin')['uid'] &&
        e.oldOwner != this.service.localStorage.get('userLogin')['uid']
      );
    });
  };

  replaceText = (data: string) => {
    let div = document.createElement('div');
    div.innerHTML = data;
    let text: string = div.textContent || div.innerText || '';
    return text.length > 30 ? text.substring(0, 30) + '...' : text;
  };

  readKeyword = (data) => {
    return JSON.parse(data)
      .map((e) => e.name)
      .join();
  };
}
