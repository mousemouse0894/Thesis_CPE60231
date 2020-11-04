import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

const _window: any = window;

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  public listExamSet: Array<any> = [];
  public examView: Array<any> = [];
  public formTopic: FormGroup;
  public formUpdateTopic: FormGroup;
  public paginationPage: number = 1;
  public listUnit: Array<any> = [];
  public examList: Array<any> = [];
  public purposeList: Array<any> = [];
  public checkRandom: boolean = false;
  public checkTnsert: boolean = false;
  public checkUpdateTopic: boolean = false;
  public countExamStore: number = 0;

  constructor(public service: AppService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initFrom(0, 0);

    this.getExamSet();
    this.getUnittable();
    this.getCountExam();

    _window.$('#exampleModalShowExam').on('hidden.bs.modal', (e) => {
      this.examView = [];
    });
  }

  public initFrom = (min: number, max: number, oldValue: boolean = false) => {
    this.formTopic = this.formBuilder.group({
      owner: [this.service.localStorage.get('userLogin')['uid']],
      topic: [oldValue ? this.formTopic.value.topic : '', Validators.required],
      isRandom: [
        min,
        [Validators.required, Validators.max(max), Validators.min(min)],
      ],
      status: ['on', Validators.required],
      examstoreID_fk: [
        oldValue ? this.formTopic.value.examstoreID_fk : '',
        Validators.required,
      ],
      text: [oldValue ? this.formTopic.value.text : '', Validators.required],
    });

    this.formUpdateTopic = this.formBuilder.group({
      topic: [
        oldValue ? this.formUpdateTopic.value.topic : '',
        Validators.required,
      ],
      text: [
        oldValue ? this.formUpdateTopic.value.text : '',
        Validators.required,
      ],
      exambodyID: [
        oldValue ? this.formUpdateTopic.value.exambodyID : '',
        Validators.required,
      ],
      examstoreID_fk: [
        oldValue ? this.formUpdateTopic.value.examstoreID_fk : '',
      ],
      owner: [this.service.localStorage.get('userLogin')['uid']],
      oldID: [oldValue ? this.formUpdateTopic.value.oldID : ''],
      isRandom: [
        min,
        [Validators.required, Validators.max(max), Validators.min(min)],
      ],
    });
  };

  public filterExamBody = () => {
    return this.listExamSet.filter((e) => {
      return e.status != 'off';
    });
  };

  public getExamSet = () => {
    this.service
      .httpGet(
        `/exbody/getExamBody/${
          this.service.localStorage.get('userLogin')['uid']
        }?token=${this.service.localStorage.get('userLogin')['token']}`
      )
      .then((val: any) => {
        if (val.result.length > 0) {
          this.listExamSet = val.result;
        } else {
          this.listExamSet = [];
        }
      });
  };

  public onDeletebody = (data: any) => {
    this.service
      .showConfirm(
        'ยืนยันการลบชุดข้อสอบ',
        `รหัส ${this.service.zeroPad(data.exambodyID, 1000)}`,
        'warning'
      )
      .then((val) => {
        if (val) {
          let dataDelbody = {
            exambodyID: data.exambodyID,
            status: 'off',
          };

          this.service
            .httpPost(
              `exbody/updateStatus?token=${
                this.service.localStorage.get('userLogin')['token']
              }`,
              JSON.stringify(dataDelbody)
            )
            .then((value: any) => {
              if (value.success) {
                this.getExamSet();
                this.service.showAlert('', 'ลบสำเร็จ', 'success');
              } else {
                this.service.showAlert('', value.message, 'error');
              }
            });
        }
      });
  };

  public updateSubmit = () => {
    if (this.checkUpdateTopic) {
      if (this.examList.length > 0) {
        let exam = [];
        this.examList.forEach((el, i) => {
          exam.push(el['storeID']);
        });
        this.formUpdateTopic.patchValue({
          examstoreID_fk: exam.join(','),
        });
      }

      if (this.formUpdateTopic.valid) {
        this.service
          .httpPost(
            `exbody/updateExamBody?token=${
              this.service.localStorage.get('userLogin')['token']
            }`,
            JSON.stringify(this.formUpdateTopic.value)
          )
          .then((value: any) => {
            if (value.success) {
              this.checkUpdateTopic = false;
              this.checkTnsert = false;
              this.getExamSet();
              this.service.showAlert(``, `สำเร็จ`, `success`);
            } else {
              this.service.showAlert('', value.message, 'error');
            }
          });
      } else {
        this.service.showAlert('โปรดกรอกข้อมูลให้ถูกต้อง', '', 'error');
      }
    } else {
      if (this.examList.length > 0) {
        let exam = [];
        this.examList.forEach((el, i) => {
          exam.push(el['storeID']);
        });
        this.formTopic.patchValue({
          examstoreID_fk: exam.join(','),
        });
      }

      if (this.formTopic.valid) {
        this.service
          .httpPost(
            `/exbody/insertExamBody?token=${
              this.service.localStorage.get('userLogin')['token']
            }`,
            JSON.stringify(this.formTopic.value)
          )
          .then((val: any) => {
            if (val.success) {
              this.checkUpdateTopic = false;
              this.checkTnsert = false;
              this.getExamSet();
              this.service.showAlert(``, `สำเร็จ`, `success`);
            } else {
              this.service.showAlert('', val.message, 'error');
            }
          });
      } else {
        this.service.showAlert('โปรดกรอกข้อมูลให้ถูกต้อง', '', 'error');
      }
    }
  };

  public onCheckRandom = (x) => {
    this.examList = x == false ? [] : this.examList;

    if (!x) {
      this.initFrom(1, this.countExamStore, true);
      this.formTopic.patchValue({
        examstoreID_fk: 'null',
      });
    } else {
      this.initFrom(0, this.countExamStore, true);
      this.formTopic.patchValue({
        examstoreID_fk: '',
      });
    }

    this.checkRandom = x == true ? false : true;
  };

  public examFilter = (data: Array<any>) => {
    let filter = [];
    data = data.filter((e) => {
      return e.status == 'on';
    });

    data
      .map((map, i) => {
        return map.storeID;
      })
      .forEach((loop, index) => {
        if (
          this.examList
            .map((e) => {
              return e.storeID;
            })
            .indexOf(loop) === -1
        ) {
          filter.push(data[index]);
        }
      });

    return filter;
  };

  private getUnittable = () => {
    this.service
      .httpGet(
        '/examunit/get/' +
          this.service.localStorage.get('userLogin')['uid'] +
          '?token=' +
          this.service.localStorage.get('userLogin')['token']
      )
      .then((value: any) => {
        if (value.result.length > 0) {
          this.listUnit = value.result;
        } else {
          this.listUnit = [];
        }
      });
  };

  public getExamByUnit = (unitId: string) => {
    this.service
      .httpGet(
        `/exbody/getExamPurposeStore/${unitId}?token=${
          this.service.localStorage.get('userLogin')['token']
        }`
      )
      .then((val: any) => {
        if (val.result.length > 0) {
          this.purposeList = val.result;
        } else {
          this.purposeList = [];
        }
      });
  };

  public pushExam = (data: any) => {
    if (
      this.examList
        .map((e) => {
          return e.storeID;
        })
        .indexOf(data.storeID) === -1
    ) {
      this.examList.push({ ...data });
    }
  };

  public popExam = (data: any) => {
    if (this.examList.indexOf(data) !== -1) {
      this.examList.splice(this.examList.indexOf(data), 1);
    }
  };

  public onCheckInsert = () => {
    this.checkTnsert = true;
    this.initFrom(0, 0);
  };

  public onUpdateTopic = (x) => {
    this.examList = x.exambodyData;
    this.checkRandom = x.exambodyData.length < 1
    this.formUpdateTopic.patchValue({
      topic: x.topic,
      text: x.text,
      exambodyID: x.exambodyID,
      owner: this.service.localStorage.get('userLogin')['uid'],
      oldID: x.oldID,
      isRandom: x.isRandom,
    });
  };

  replaceText = (data: string) => {
    let div = document.createElement('div');
    div.innerHTML = data;
    let text: string = div.textContent || div.innerText || '';
    return text.length > 30 ? text.substring(0, 30) + '...' : text;
  };

  private getCountExam = () => {
    this.countExamStore = 0;
    this.service
      .httpGet(
        `/exstore/countStore/${
          this.service.localStorage.get('userLogin')['uid']
        }?token=${this.service.localStorage.get('userLogin')['token']}`
      )
      .then((val: any) => {
        if (val.result.length > 0) {
          this.countExamStore = val.result[0]['countStore'];
          this.initFrom(0, this.countExamStore);
        }
      });
  };
}
