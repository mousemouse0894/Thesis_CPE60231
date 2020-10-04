import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss'],
})
export class UpdateComponent implements OnInit {
  public listUnit: Array<any> = [];
  public examList: Array<any> = [];
  public purposeList: Array<any> = [];
  public formTopic: FormGroup;
  public checkRandom: boolean = false;

  constructor(public service: AppService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formTopic = this.formBuilder.group({
      owner: [this.service.localStorage.get('userLogin')['uid']],
      topic: ['', Validators.required],
      isRandom: ['0', Validators.required],
      status: ['on', Validators.required],
      examstoreID_fk: ['', Validators.required],
      text: ['', Validators.required],
      random: ['', Validators.required],
    });
    this.getUnittable();
  }

  public updateSubmit = () => {
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
        examstoreID_fk: '',
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

  public onCheckRandom = (x) => {
    this.checkRandom = x == true ? false : true;
  };
}
