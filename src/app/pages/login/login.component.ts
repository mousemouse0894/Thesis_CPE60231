import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private oldPath: string = '/home';
  public formLogin: FormGroup;

  constructor(
    public service: AppService,
    private activeRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  async ngOnInit() {
    this.formLogin = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.activeRoute.queryParams.subscribe((value: any) => {
      if (value.oldPath) this.oldPath = value.oldPath;
      if (value.sso) {
        this.service
          .httpGet(`/loginsso?perid=${value.perid}`)
          .then((value: any) => {
            console.log(value);
            if (value.success) {
              this.service.localStorage.set('userLogin', value.result);
              this.service.navRouter('/');
            } else {
              this.service.showAlert(
                '',
                'กำลังใช้งานอยู่ที่ ' + value.ip,
                'error'
              );
            }
          });
      }
    });
  }

  public onLogin = () => {
    this.service
      .httpPost(`/loginmanual`, JSON.stringify(this.formLogin.value))
      .then((value: any) => {
        console.log(value);
        if (value.success) {
          this.service.localStorage.set('userLogin', value.result);
          this.service.navRouter('/');
        } else if (value.ip) {
          this.service.showAlert(
            '',
            'กำลังใช้งานอยู่ที่ IP ' + value.ip,
            'error'
          );
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  public openSSO = () => {
    window.location.replace(environment.ssoLogin);
  };
}
