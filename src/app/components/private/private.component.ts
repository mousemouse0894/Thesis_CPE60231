import { NavigationEnd, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const _window: any = window;

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
    public service: AppService,
    private router: Router
  ) {}

  private getLocation = (val) => {
    val(window.location.pathname);

    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        val(e.url);
      }
    });
  };

  ngOnInit() {
    this.getLocation((val: string) => {
      if (val == environment.baseHref) {
        if (this.service.localStorage.get('userLogin')['gidNumber'] == '4500') {
          this.service.navRouter('/group');
        } else {
          this.service.navRouter('/group-student');
        }
      }
    });

    if (this.service.localStorage.get('userLogin')['gidNumber'] == '4500') {
      this.getGroup();
      // นักศึกษา
      this.menuList = [
        {
          path: '/group',
          text: 'กลุ่มเรียน',
          icon: '<i class="fas fa-users"></i>',
        },
        {
          path: '/database',
          text: 'ฐานข้อมูล',
          icon: '<i class="fas fa-database"></i>',
        },
        {
          path: '/events',
          text: 'ระบบสอบ',
          icon: '<i class="fas fa-pen-square"></i>',
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
      this.menuList = [
        {
          path: '/group-student',
          text: 'กลุ่มเรียน',
          icon: '<i class="fas fa-users"></i>',
        },
        {
          path: '/database',
          text: 'ฐานข้อมูล',
          icon: '<i class="fas fa-database"></i>',
        },
        {
          path: '/exam-store',
          text: 'คลังข้อสอบ',
          icon: '<i class="fas fa-th-list"></i>',
        },
        {
          path: '/exam-set',
          text: 'ชุดข้อสอบ',
          icon: '<i class="fas fa-box"></i>',
        },
        {
          path: '/events-exam',
          text: 'ระบบสอบ',
          icon: '<i class="fas fa-pen-square"></i>',
        },
        {
          path: '/clear-access',
          text: 'ลบสถานะการเข้าสู่ระบบ',
          icon: '<i class="fas fa-clipboard-list"></i>',
        },
        {
          path: '/change-password',
          text: 'เปลี่ยนรหัสผ่าน',
          icon: '<i class="fas fa-key"></i>',
        },
      ];
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

          if (value.resultGroupMember) {
            this.service.localStorage.set(
              'resultGroupMember',
              value.resultGroupMember
            );
          }
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };
}
