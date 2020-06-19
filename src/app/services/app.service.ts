import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private rootAPI: string =
    'http://www.cpe.rmuti.ac.th/project/sqlchecking/api/index.php/';
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

  constructor(private http: HttpClient, private router: Router) {}

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
    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.rootAPI}${url}`)
        .toPromise()
        .then((value) => {
          resolve(value);
        })
        .catch((reason) => {
          reject(reason);
        });
    });
  };

  public httpPost = (url: string, data: any) => {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.rootAPI}${url}`, data)
        .toPromise()
        .then((value) => {
          resolve(value);
        })
        .catch((reason) => {
          reject(reason);
        });
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
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
        focusCancel: true,
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
}
