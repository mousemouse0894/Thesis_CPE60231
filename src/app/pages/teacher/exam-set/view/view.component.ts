import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  public listExamSet: Array<any> = [];
  public examView: Array<any> = [];
  public paginationPage: number = 1;

  constructor(public service: AppService) {}

  ngOnInit(): void {
    this.getExamSet();
  }

  public selectExamView = (list: Array<any>) => {
    this.examView = list;
    console.log(list);
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

  public onDeletebody = (exambodyID: any) => {
    let dataDelbody = {
      exambodyID: exambodyID,
      status: 'off',
    };
    this.service
      .httpPost(
        `exbody/updateStatus?token=${
          this.service.localStorage.get('userLogin')['token']
        }`,
        JSON.stringify(dataDelbody)
      )
      .then((value: any) => {
        if (value.success) {
          this.getExamSet();
          this.service.showAlert('', 'ลบสำเร็จ', 'success');
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };
}
