import { AppService } from 'src/app/services/app.service';
import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss'],
})
export class PrivateComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  public menuList: Array<{ path: string; text: string; icon: string }> = [];

  constructor(
    private breakpointObserver: BreakpointObserver,
    public service: AppService
  ) {}

  ngOnInit() {
    if (this.service.localStorage.get('userLogin')['gidNumber'] == '4500') {
      this.getGroup();
      // นักศึกษา
      this.menuList = [
        {
          path: '/home',
          text: 'หน้าหลัก',
          icon: '<i class="fas fa-home"></i>',
        },
        {
          path: '/group',
          text: 'กลุ่มเรียน',
          icon: '<i class="fas fa-users"></i>',
        },
        {
          path: '/log',
          text: 'ประวัติการเข้าใช้งานระบบ',
          icon: '<i class="fas fa-clipboard-list"></i>',
        },
        {
          path: '/change-password',
          text: 'เปลี่ยนรหัสผ่าน',
          icon: '<i class="fas fa-key"></i>',
        },
      ];
    } else {
      // อาจารย์
    }
  }

  public onLogout = () => {
    this.service
      .showConfirm('', 'ยืนยันการออกจากระบบ', 'warning')
      .then((value) => {
        if (value) {
          let formdata = new FormData();
          formdata.append(
            'username',
            this.service.localStorage.get('userLogin')['uid']
          );

          this.service
            .httpPost('/logoutsso', formdata)
            .then((value) => {
              // console.log(value)
            })
            .catch((reason) => {
              // console.log(reason)
            })
            .finally(() => {
              this.service.localStorage.clear();
              window.location.replace(environment.ssoLogout);
            });
        }
      });
  };

  public getGroup = () => {
    let data = {
      username: this.service.localStorage.get('userLogin')['uid'],
      personalId: this.service.localStorage.get('userLogin')['personalId'],
    };
    this.service
      .httpPost(
        '/refresh?token=' + this.service.localStorage.get('userLogin')['token'],
        JSON.stringify(data)
      )
      .then((value: any) => {
        if (value.success) {
          this.service.localStorage.set('userLogin', {
            ...this.service.localStorage.get('userLogin'),
            ...value.result,
          });
          console.log(this.service.localStorage.get('userLogin'));
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };
}
