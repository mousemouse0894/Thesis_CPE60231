import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  public databaseResult: any = null;
  public tableResult: any = null;
  public Dataintable: any = null;
  public selectDatabase: any = null;
  public pagiShowdatabase: number = 1;

  constructor(public service: AppService) {}

  ngOnInit() {
    this.onGetdatabse();
  }

  public onGetdatabse = () => {
    this.databaseResult = null;
    this.service
      .httpGet(
        `/exdatabase/show/${
          this.service.localStorage.get('userLogin')['uid']
        }?token=${this.service.localStorage.get('userLogin')['token']}`
      )
      .then((value: any) => {
        if (value.success) {
          if (this.service.localStorage.get('userLogin')['gidNumber'] == 4500) {
            this.databaseResult = value.result.filter((value) => {
              return value.status == '1';
            });
          } else {
            this.databaseResult = value.result;
          }
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  public onGettable = (Database: any) => {
    this.selectDatabase = Database;
    this.tableResult = null;
    this.service
      .httpGet(
        `/exdatabase/table/${Database}?token=${
          this.service.localStorage.get('userLogin')['token']
        }`
      )
      .then((value: any) => {
        if (value.success) {
          this.tableResult = value.result;
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  public onGetDataintable = (table_name: any) => {
    this.Dataintable = null;
    this.service
      .httpGet(
        `/exdatabase/getdata/${this.selectDatabase}/${table_name}?token=${
          this.service.localStorage.get('userLogin')['token']
        }`
      )
      .then((value: any) => {
        if (value.success) {
          this.Dataintable = value.result;
        } else {
          this.Dataintable = [];
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  public getKeyObject = (array) => {
    if (array.length > 0) {
      let ObjectData = [...array];
      return Object.keys(ObjectData[0]);
    } else if (typeof array == 'object') {
      return Object.keys(array);
    } else {
      return [];
    }
  };

  public onToggleDatabase = (x: any) => {
    let data = {
      dbName: x.Database,
      status: x.status == 1 ? 0 : 1,
      owner: this.service.localStorage.get('userLogin')['uid'],
    };
    this.service
      .httpPost(
        `/exdatabase/insertdup?token=${
          this.service.localStorage.get('userLogin')['token']
        }`,
        JSON.stringify(data)
      )
      .then((value: any) => {
        if (value.success) {
          this.onGetdatabse();
          // this.service.showAlert('', 'บันทึกสำเร็จ', 'success');
          this.service.toastr.success('บันทึกสำเร็จ');
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };
}
