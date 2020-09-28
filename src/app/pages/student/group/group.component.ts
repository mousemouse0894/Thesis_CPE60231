import { AppService } from './../../../services/app.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  public Allgroupstudent: Array<any> = [];
  public formJoingroup: FormGroup;
  constructor(public service: AppService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formJoingroup = this.formBuilder.group({
      username: [this.service.localStorage.get('userLogin')['uid']],
      groupName: [''],
      groupID: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.onGetgroupstudent();
  }

  public onGetgroupstudent = () => {
    this.service
      .httpGet(
        '/groupst/studentget?token=' +
          this.service.localStorage.get('userLogin')['token']
      )
      .then((value: any) => {
        if (value.success) {
          this.Allgroupstudent = value.result;
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  public onJoinGroup = () => {
    this.service
      .httpPost(
        '/groupst/stjoingroup?token=' +
          this.service.localStorage.get('userLogin')['token'],
        JSON.stringify(this.formJoingroup.value)
      )
      .then((value: any) => {
        if (value.success) {
          window.location.reload();
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  public leaveGroup = () => {
    this.service
      .showConfirm('', 'ยืนยันการออกจากกลุ่ม', 'warning')
      .then((value) => {
        if (value) {
          let data = {
            username: this.service.localStorage.get('userLogin')['uid'],
          };

          this.service
            .httpPost(
              `groupst/clearmember?token=${
                this.service.localStorage.get('userLogin')['token']
              }`,
              JSON.stringify(data)
            )
            .then((value: any) => {
              if (value.success) {
                this.service.showAlert('', 'ออกจากกลุ่มสำเร็จ', 'success');
                window.location.reload();
              } else {
                this.service.showAlert('', value.message, 'error');
              }
            });
        }
      });
  };
}
