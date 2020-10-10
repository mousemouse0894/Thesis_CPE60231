import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

const _window: any = window;

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
  public CkeckChange: boolean = false;
  public selectPurpose: any = null;
  public unitSelected: any = null;

  constructor(public service: AppService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formInsertUnit = this.formBuilder.group({
      name: ['', Validators.required],
      owner: this.service.localStorage.get('userLogin')['uid'],
      examUnitID: [''],
    });

    this.formInsertPurpose = this.formBuilder.group({
      name: ['', Validators.required],
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
            this.service.showAlert('', 'บันทึกสำเรีจ', 'success');
            this.getUnittable();
            _window.$(`#exampleModalUnit`).modal('hide');
          } else {
            this.checkupdate = false;
            this.service.showAlert('', value.message, 'error');
            this.getUnittable();
          }
        });
    } else {
      //เพิ่มunit
      this.service
        .httpPost(
          '/examunit/insertunit?token=' +
            this.service.localStorage.get('userLogin')['token'],
          JSON.stringify(this.formInsertUnit.value)
        )
        .then((value: any) => {
          if (value.success) {
            this.getUnittable();
            this.service.showAlert('', 'บันทึกสำเรีจ', 'success');
            _window.$(`#exampleModalUnit`).modal('hide');
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
          console.log(value);
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  public onUpdateUnit = (unitname: any, examUnitID: any) => {
    this.formInsertUnit.patchValue({
      examUnitID: examUnitID,
      name: unitname,
    });

    this.checkupdate = true;
  };

  //-------------------------------------------------------------------------------------
  public getPurpose = (data: any) => {
    this.unitSelected = data;
    this.service
      .httpGet(
        `/exampurpose/get/` +
          data.examUnitID +
          `?token=` +
          this.service.localStorage.get('userLogin')['token']
      )
      .then((value: any) => {
        if (value.success) {
          this.getpurposeTable = value.result;
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  public onInertPurpose = () => {
    if (this.checkupdate) {
      //อัพเดทจุดประสงค์
      this.service
        .httpPost(
          `/exampurpose/updatepurpose?token=${
            this.service.localStorage.get('userLogin')['token']
          }`,
          JSON.stringify(this.formInsertPurpose.value)
        )
        .then((value: any) => {
          if (value.success) {
            this.checkupdate = false;
            this.getPurpose(this.unitSelected);
            this.service.showAlert('', 'บันทึกสำเร็จ', 'success');
            _window.$(`#exampleModalPurpose`).modal('hide');
          } else {
            this.checkupdate = false;
            this.service.showAlert('', value.message, 'error');
          }
        });
    } else {
      //เพิ่มจุดประสงค์
      let dataPurpost = {
        name: this.formInsertPurpose.value.name,
        examunitID_fk: this.unitSelected.examUnitID,
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
            this.getPurpose(this.unitSelected);
            this.service.showAlert('', 'บันทึกสำเร็จ', 'success');
            _window.$(`#exampleModalPurpose`).modal('hide');
          } else {
            this.service.showAlert('', value.message, 'error');
          }
        });
    }
  };

  public onUpdatePurpose = (name: any, exampurposeID: any) => {
    this.formInsertPurpose = this.formBuilder.group({
      exampurposeID: exampurposeID,
      name: [name, Validators.required],
    });
    this.checkupdate = true;
  };

  public onDeletePurpose = (exampurposeID: any) => {
    let deldata = {
      exampurposeID: exampurposeID,
    };
    this.service
      .httpPost(
        `/exampurpose/delpurpose?token=${
          this.service.localStorage.get('userLogin')['token']
        }`,
        JSON.stringify(deldata)
      )
      .then((value: any) => {
        if (value.success) {
          this.getPurpose(this.unitSelected);
          this.service.showAlert('', 'ลบสำเร็จ', 'success');
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  //ย้ายจุดประสงค์
  public onCkeckChange = (exampurposeID: any) => {
    this.selectPurpose = exampurposeID;
    this.CkeckChange = true;
  };

  public onChangepurpose = (examUnitID: any) => {
    let changedata = {
      exampurposeID: this.selectPurpose,
      examunitID_fk: examUnitID,
    };
    this.service
      .httpPost(
        `/exampurpose/updateunitid?token=${
          this.service.localStorage.get('userLogin')['token']
        }`,
        JSON.stringify(changedata)
      )
      .then((value: any) => {
        if (value.success) {
          this.CkeckChange = false;
          this.getPurpose(this.unitSelected);
          this.service.showAlert('', 'บันทึกสำเร็จ', 'success');
          _window.$(`#exampleModalCkeckChange`).modal('hide');
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  subUnit = (list) => {
    if (list)
      return list.filter((e) => {
        return e != this.unitSelected;
      });

    return [];
  };
}
