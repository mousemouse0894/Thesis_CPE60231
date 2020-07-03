import { AppService } from './../../../services/app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clearaccess',
  templateUrl: './clearaccess.component.html',
  styleUrls: ['./clearaccess.component.scss'],
})
export class ClearaccessComponent implements OnInit {
  public accessStudentrecord: any = null;
  public checkAllselect: boolean = false;
  constructor(public service: AppService) {}

  ngOnInit() {
    this.getAccessStudent();
  }

  public getAccessStudent = () => {
    console.log(this.service.localStorage.get('userLogin')['token']);
    this.accessStudentrecord = null;
    this.service
      .httpGet(
        `/getaccess?token=${
          this.service.localStorage.get('userLogin')['token']
        }`
      )
      .then((value: any) => {
        if (value.isLogin) {
          if (value.success) {
            console.log(value);
            this.accessStudentrecord = value.result;
          }
        } else {
          this.service.showAlert('', value.message, 'error');
          this.service.navRouter('/login');
        }
      });
  };

  public deleteAccressStudent = (uid: any) => {
    this.service
      .httpPost(
        `/logoutsso?token=${
          this.service.localStorage.get('userLogin')['token']
        }&username=${uid}&status=clear_token`,
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
    this.accessStudentrecord.forEach((element) => {
      listCheck = document.getElementById(`check_${element.uid}`);
      if (listCheck.checked == true) {
        arrChecked.push(`\'${element.uid}\'`);
      }
    });
    console.log(arrChecked.join(', '));
    if (arrChecked.length > 0) {
      this.deleteAccressStudent(arrChecked.join(', '));
    } else {
      this.service.showAlert('', 'ไม่ได้เลือก', 'error');
    }
  };

  public tableCheck = (id: string) => {
    let listCheck: any = document.getElementById(`check_${id}`);
    listCheck.checked = !listCheck.checked;
  };
}
