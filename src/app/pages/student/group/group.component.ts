import { AppService } from './../../../services/app.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  public Allgroupstudent: any = null;
  public gid: any = null;
  public groupName: any = null;
  public checkselectgroup: boolean = false;
  public formJoingroup: FormGroup;
  constructor(public service: AppService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formJoingroup = this.formBuilder.group({
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

  public onSendGid = (groupID: any, gname: any) => {
    this.gid = groupID;
    this.groupName = gname;
    this.checkselectgroup = true;
  };

  public onJoinGroup = () => {
    if (this.checkselectgroup) {
      let data = {
        groupID: this.gid,
        username: this.service.localStorage.get('userLogin')['uid'],
        password: this.formJoingroup.value.password,
      };
      this.service
        .httpPost(
          '/groupst/stjoingroup?token=' +
            this.service.localStorage.get('userLogin')['token'],
          JSON.stringify(data)
        )
        .then((value: any) => {
          console.log(value);
          console.log(data);
          if (value.success) {
            this.checkselectgroup = false;
            this.service.showAlert('', 'เข้าสำเร็จ', 'success');
          } else {
            this.service.showAlert('', value.message, 'error');
          }
        });
    } else {
      this.service.showAlert('', 'เลือกกลุ่มด้วย', 'error');
    }
  };
}
