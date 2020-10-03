import { AppService } from './../../../services/app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clearaccess',
  templateUrl: './clearaccess.component.html',
  styleUrls: ['./clearaccess.component.scss'],
})
export class ClearaccessComponent implements OnInit {
  public accessStudentRecord: any = null;
  public checkAllselect: boolean = false;
  constructor(public service: AppService) {}

  ngOnInit() {
    this.getAccessStudent();
  }

  public getAccessStudent = () => {
    this.accessStudentRecord = null;
    this.service
      .httpGet(
        `/getaccess/${
          this.service.localStorage.get('userLogin')['uid']
        }?token=${this.service.localStorage.get('userLogin')['token']}`
      )
      .then((value: any) => {
        if (value.success) {
          if (value.result.length > 0) {
            this.accessStudentRecord = value.result.filter((e) => {
              return parseInt(e.time_end) * 1000 >= new Date().getTime();
            });
          }
        }
      });
  };

  public deleteAccressStudent = (uid: any) => {
    this.service
      .httpPost(
        `/logoutsso?token=${
          this.service.localStorage.get('userLogin')['token']
        }&username=${uid}&status=ออกจากระบบโดยอาจารย์`,
        ``
      )
      .then((value: any) => {
        console.log(value);
        this.getAccessStudent();
      });
  };

  public deleteSelect = () => {
    let listCheck: any = null;
    let arrChecked = [];
    this.accessStudentRecord.forEach((element) => {
      listCheck = document.getElementById(`check_${element.uid}`);
      if (listCheck.checked == true) {
        arrChecked.push(`\'${element.uid}\'`);
      }
    });

    if (arrChecked.length > 0) {
      this.deleteAccressStudent(arrChecked.join(', '));
    } else {
      // this.service.showAlert('', 'ไม่ได้เลือก', 'error');
    }
  };

  public tableCheck = (id: string) => {
    let listCheck: any = document.getElementById(`check_${id}`);
    listCheck.checked = !listCheck.checked;
  };

  public readTimeEnd = (data: string) => {
    let time = parseInt(data) * 1000;
    let dt = new Date(time + 1000 * 60 * 60 * 7);
    return `${dt.toISOString().replace('T', ' ').replace('.000Z', '')}`;
  };
}
