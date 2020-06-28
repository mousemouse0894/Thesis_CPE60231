import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from './../../../services/app.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss'],
})
export class UnitComponent implements OnInit {
  public formInsertUnit: FormGroup;
  public formInsertPurpose: FormGroup;
  public getunit: any = null;
  public checkupdate: boolean = false;
  public getpurposeTable: any = null;
  public examUnitIDPurpose: any = null;
  constructor(public service: AppService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formInsertUnit = this.formBuilder.group({
      name: ['', Validators.required],
      text: ['', Validators.required],
    });
    this.formInsertPurpose = this.formBuilder.group({
      text: ['', Validators.required],
    });
    this.getUnittable();
  }

  public getUnittable = () => {
    this.service
      .httpGet(
        '/examunit/get/' +
          this.service.localStorage.get('userLogin')['uid'] +
          '?token=' +
          this.service.localStorage.get('userLogin')['token']
      )
      .then((value: any) => {
        if (value.success) {
          this.getunit = value.result;
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  public insertUnit = () => {
    if (this.checkupdate) {
      //เเก้ไขunit
      this.service
        .httpPost(
          '/examunit/updateunit?token=' +
            this.service.localStorage.get('userLogin')['token'],
          JSON.stringify(this.formInsertUnit.value)
        )
        .then((value: any) => {
          if (value.success) {
            this.checkupdate = false;
            this.service.showAlert('', 'เเก้ไขสำเร็จ', 'success');
            this.getUnittable();
          } else {
            this.checkupdate = false;

            this.service.showAlert('', value.message, 'error');
            this.getUnittable();
          }
        });
    } else {
      //เพิ่มunit
      let datainsertUnit = {
        owner: this.service.localStorage.get('userLogin')['uid'],
        name: this.formInsertUnit.value.name,
        text: this.formInsertUnit.value.text,
      };
      console.log(JSON.stringify(datainsertUnit));
      this.service
        .httpPost(
          '/examunit/insertunit?token=' +
            this.service.localStorage.get('userLogin')['token'],
          JSON.stringify(datainsertUnit)
        )
        .then((value: any) => {
          if (value.success) {
            this.getUnittable();
            this.service.showAlert('', 'เพิ่มสำเร็จ', 'success');
          } else {
            this.service.showAlert('', value.message, 'error');
          }
        });
    }
  };

  public onDelunit = (examUnitID: any) => {
    let deldata = {
      examUnitID: examUnitID,
    };
    this.service
      .httpPost(
        `/examunit/delunit?token=${
          this.service.localStorage.get('userLogin')['token']
        }`,
        JSON.stringify(deldata)
      )
      .then((value: any) => {
        if (value.success) {
          this.getUnittable();
          this.service.showAlert('', 'ลบสำเร็จ', 'success');
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  public onUpdate = (unitname: any, unitContent: any, examUnitID: any) => {
    this.formInsertUnit = this.formBuilder.group({
      examUnitID: examUnitID,
      name: [unitname, Validators.required],
      text: [unitContent, Validators.required],
    });
    this.checkupdate = true;
  };

  //-------------------------------------------------------------------------------------
  public getPurpose = (examUnitID: any) => {
    this.examUnitIDPurpose = examUnitID;
    this.service
      .httpGet(
        `/exampurpose/get/` +
          examUnitID +
          `?token=` +
          this.service.localStorage.get('userLogin')['token']
      )
      .then((value: any) => {
        if (value.success) {
          this.getpurposeTable = value.result;
          console.log(this.getpurposeTable);
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  public onInertPurpose = () => {
    let dataPurpost = {
      name: this.service.localStorage.get('userLogin')['uid'],
      text: this.formInsertPurpose.value.text,
      examunitID_fk: this.examUnitIDPurpose,
    };
    this.service
      .httpPost(
        `/exampurpose/insertpurpose?token=${
          this.service.localStorage.get('userLogin')['token']
        }`,
        JSON.stringify(dataPurpost)
      )
      .then((value: any) => {
        if (value.success) {
          this.service.showAlert('', 'เพิ่มสำเร็จ', 'success');
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };
}
