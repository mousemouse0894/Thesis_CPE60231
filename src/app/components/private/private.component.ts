import { AppService } from 'src/app/services/app.service';
import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { JsonPipe } from '@angular/common';

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

  constructor(
    private breakpointObserver: BreakpointObserver,
    public service: AppService
  ) {}
  ngOnInit() {
    this.onGetgroup();
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

  public onGetgroup = () => {
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
          let setGroup = {
            ...this.service.localStorage.get('userLogin'),
            ...value.result,
          };
          this.service.localStorage.set('userLogin', setGroup);
          console.log(this.service.localStorage.get('userLogin'));
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  public onchange1() {
    this.service.navRouter('/unit');
  }
  public onchange2() {
    this.service.navRouter('/group-student');
  }
}
