import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

  constructor(public service: AppService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formTopic = this.formBuilder.group({
      owner: [this.service.localStorage.get('userLogin')['uid']],
      topic: ['', Validators.required],
      isRandom: [0, Validators.required],
      status: ['on', Validators.required],
      examstoreID_fk: ['', Validators.required],
      text: ['', Validators.required],
    });
    this.formUpdateTopic = this.formBuilder.group({
      topic: ['', Validators.required],
      text: ['', Validators.required],
      exambodyID: ['', Validators.required],
    });
    this.getExamSet();
    this.getUnittable();
  }

  public selectExamView = (list: Array<any>) => {
    this.examView = list;
    console.log(list);
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

  public onDeletebody = (exambodyID: any) => {
    let dataDelbody = {
      exambodyID: exambodyID,
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
  };

  public updateSubmit = () => {
    if (this.checkUpdateTopic) {
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
            this.getExamSet();
            this.service.showAlert(``, `สำเร็จ`, `success`);
          } else {
            this.service.showAlert('', value.message, 'error');
          }
        });
    } else {
      if (this.examList.length > 0) {
        let exam = [];
        this.examList.forEach((el, i) => {
          exam.push(el['storeID']);
        });
        this.formTopic.patchValue({
          examstoreID_fk: exam.join(','),
        });
      } else {
        this.formTopic.patchValue({
          examstoreID_fk: 'null',
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
          .then((val: any) => {});
      } else {
        this.service.showAlert('โปรดกรอกข้อมูลให้ครบถ้วน', '', 'error');
      }
    }
  };

  public onCheckRandom = (x) => {
    console.log(x);
    if (!x) {
      this.formTopic.patchValue({
        isRandom: 0,
      });
    }
    this.checkRandom = x == true ? false : true;
  };

  public examFilter = (data: Array<any>) => {
    let filter = [];

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

    console.log(this.examList);
  };

  public popExam = (data: any) => {
    if (this.examList.indexOf(data) !== -1) {
      this.examList.splice(this.examList.indexOf(data), 1);
    }
  };

  public onCheckInsert = () => {
    this.checkTnsert = true;
  };

  public onUpdateTopic = (x) => {
    this.formUpdateTopic = this.formBuilder.group({
      topic: x.topic,
      text: x.text,
      exambodyID: x.exambodyID,
    });
    this.checkUpdateTopic = true;
  };
}
