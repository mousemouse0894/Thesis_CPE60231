import { AppService } from 'src/app/services/app.service';
import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,public service:AppService) {}

  public onLogout = () => {
    this.service
      .showConfirm('', 'ยืนยันการออกจากระบบ', 'warning')
      .then((value) => {
        if (value) {
          let formdata = new FormData()
          formdata.append("username", this.service.localStorage.get("userLogin")["uid"])

          this.service.httpPost('/logoutsso', formdata).then((value)=>{
            // console.log(value)
          }).catch((reason)=>{
            // console.log(reason)
          }).finally(()=>{
            this.service.localStorage.clear();
            window.location.replace(environment.ssoLogout)
          })

        }
      });
  };

  public onchange1(){
    this.service.navRouter("/group-student");
  }


}
