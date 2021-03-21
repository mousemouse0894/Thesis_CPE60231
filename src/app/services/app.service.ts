import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public rootFile: string =
    'http://www.cpe.rmuti.ac.th/project/sqlchecking/api/';
  public month: Array<string> = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤษจิกายน',
    'ธันวาคม',
  ];
  public day: Array<string> = [
    'อาทิตย์',
    'จันทร์',
    'อังคาร',
    'พุธ',
    'พฤหัสบดี',
    'ศุกร์',
    'เสาร์',
  ];

  public stateLoading: boolean = false;
  public showSidenav: boolean = true;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastrCtrl: ToastrService
  ) {}

  public toastr = {
    success: (title: string, message = '') => {
      this.toastrCtrl.success(title, message);
    },
    error: (title: string, message = '') => {
      this.toastrCtrl.error(title, message);
    },
  };

  public localStorage = {
    get: (key: string) => {
      return JSON.parse(window.localStorage.getItem(`sqlchecking_${key}`));
    },
    set: (key: string, data: any) => {
      return window.localStorage.setItem(
        `sqlchecking_${key}`,
        JSON.stringify(data)
      );
    },
    clear: () => {
      window.localStorage.clear();
    },
  };

  public httpGet = (url: string) => {
    this.stateLoading = true;
    return new Promise((resolve) => {
      setTimeout(() => {
        this.http
          .get(`${environment.rootAPI}${url}`)
          .toPromise()
          .then((value: any) => {
            if (!environment.production) console.log(value);

            if (value.isLogin == false) {
              resolve(null);
              this.navRouter('/login');
              this.localStorage.clear();
            } else {
              resolve({ connect: true, ...value });
            }
            this.stateLoading = false;
          })
          .catch((reason) => {
            console.log(reason);
            let newReason = reason;
            newReason['message'] = reason['name'];
            resolve({ connect: false, ...newReason });
            this.stateLoading = false;
          });
      }, Math.round(Math.random() * 1200));
    });
  };

  public httpPost = (url: string, data: any) => {
    this.stateLoading = true;
    return new Promise((resolve) => {
      setTimeout(() => {
        this.http
          .post(`${environment.rootAPI}${url}`, data)
          .toPromise()
          .then((value: any) => {
            if (!environment.production) console.log(value);

            if (value.isLogin == false) {
              resolve(null);
              this.navRouter('/login');
              this.localStorage.clear();
            } else {
              resolve({ connect: true, ...value });
            }
            this.stateLoading = false;
          })
          .catch((reason) => {
            console.log(reason);
            let newReason = reason;
            newReason['message'] = reason['name'];
            resolve({ connect: false, ...newReason });
            this.stateLoading = false;
          });
      }, Math.round(Math.random() * 1200));
    });
  };

  public showAlert = (
    title: string,
    message: string,
    type: 'success' | 'warning' | 'error'
  ) => {
    Swal.fire({
      icon: type,
      title: title,
      text: message,
      confirmButtonText: 'ตกลง',
      onBeforeOpen: function (ele) {
        const windows: any = window;
        windows
          .$(ele)
          .find('button.swal2-confirm.swal2-styled')
          .toggleClass('swal2-confirm swal2-styled btn btn-primary')
          .attr('style', '');
      },
    });
  };

  public showConfirm = (
    title: string,
    message: string,
    type: 'success' | 'warning' | 'error'
  ) => {
    return new Promise((resolve) => {
      Swal.fire({
        title: title,
        text: message,
        icon: type,
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true,
        focusCancel: true,
        onBeforeOpen: function (ele) {
          const windows: any = window;
          windows
            .$(ele)
            .find('button.swal2-confirm.swal2-styled')
            .toggleClass('swal2-confirm swal2-styled btn btn-primary ml-2')
            .attr('style', '');

          windows
            .$(ele)
            .find('button.swal2-cancel.swal2-styled')
            .toggleClass('swal2-cancel swal2-styled btn btn-danger mr-2')
            .attr('style', '');
        },
      }).then((result) => {
        if (result.value) {
          resolve(true);
        }
        resolve(false);
      });
    });
  };

  public delay = (ms: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  };

  public zeroPad = (nr, base: number) => {
    var len = String(base).length - String(nr).length + 1;
    return len > 0 ? new Array(len).join('0') + nr : nr;
  };

  public navRouter = (path: string, params: any = {}) => {
    this.router.navigate([`${path}`], { queryParams: params });
  };

  public modal = {
    show: (id: string) => {
      const windows: any = window;

      windows.$(`#${id}`).modal('show');
    },
    hide: (id: string) => {
      const windows: any = window;
      windows.$(`#${id}`).modal('hide');
    },
  };

  jsParse = (data) => {
    let rt = null;
    try {
      rt = JSON.parse(data);
    } catch (error) {
      rt = null;
    }
    return rt;
  };

  jsStringify = (data) => {
    return JSON.stringify(data);
  };
}
