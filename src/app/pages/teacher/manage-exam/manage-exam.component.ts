import { AppService } from './../../../services/app.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-exam',
  templateUrl: './manage-exam.component.html',
  styleUrls: ['./manage-exam.component.scss'],
})
export class ManageExamComponent implements OnInit {
  public getunit: any = null;
  public getpurposeTable: any = null;
  public formInsertexam: FormGroup;
  public databaseResult: any = null;
  public examResult: any = null;
  public checkEditexam:boolean = false;
  constructor(public service: AppService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formInsertexam = this.formBuilder.group({
      purposeID_fk: ['', Validators.required],
      databaseName: ['', Validators.required],
      text: ['', Validators.required],
      answer: ['', Validators.required],
      keyword: ['', Validators.required],
      score: ['', Validators.required],
      UnitID: ['', Validators.required],
    });
    this.getUnittable();
    this.onGetdatabse();
    this.onGetexam();
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

  public onGetselectunit = (examUnitID: any) => {
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
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };


  public onGetdatabse = () => {
    this.service
      .httpGet(
        `/exdatabase/show?token=${
          this.service.localStorage.get('userLogin')['token']
        }`
      )
      .then((value: any) => {
        if (value.success) {
          this.databaseResult = value.result;
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };



  public onGetexam = () => {
    this.service
      .httpGet(
        `/exstore/get/${
          this.service.localStorage.get('userLogin')['uid']
        }?token=${this.service.localStorage.get('userLogin')['token']}`
      )
      .then((value: any) => {
        if (value.success) {
          this.examResult = value.result;
          console.log(value);
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };



  public onInsartexam = () => {
    if(this.checkEditexam){
          console.log(this.formInsertexam.value)
          this.service
          .httpPost(
            `/exstore/update?token=${
              this.service.localStorage.get('userLogin')['token']
            }`,
            JSON.stringify(this.formInsertexam.value)
          )
          .then((value: any) => {
            if (value.success) {
              console.log(value);
              this.checkEditexam = false
              this.onGetexam();
              this.service.showAlert('', 'เเก้ไขสำเร็จสำเร็จ', 'success');
            } else {
              this.service.showAlert('', value.message, 'error');
            }
          });


    }else{
      let dataInsartexam = {
        purposeID_fk: this.formInsertexam.value.purposeID_fk,
        text: this.formInsertexam.value.text,
        answer: this.formInsertexam.value.answer,
        keyword: this.formInsertexam.value.keyword,
        score: this.formInsertexam.value.score,
        databaseName: this.formInsertexam.value.databaseName,
        owner: this.service.localStorage.get('userLogin')['uid'],
      };
      console.log(JSON.stringify(dataInsartexam));
      this.service
        .httpPost(
          `/exstore/insertexam?token=${
            this.service.localStorage.get('userLogin')['token']
          }`,
          JSON.stringify(dataInsartexam)
        )
        .then((value: any) => {
          if (value.success) {
            console.log(value);
            this.onGetexam();
            this.service.showAlert('', 'เพิ่มสำเร็จ', 'success');
          } else {
            this.service.showAlert('', value.message, 'error');
          }
        });
    }
  };

  public onCheckupdateexam = (
  x:any
  ) => {
    this.getUnittable();
    this.onGetselectunit(x.examunitID_fk);
    this.formInsertexam = this.formBuilder.group({
      answer:  [x.answer, Validators.required],
      databaseName: [x.databaseName, Validators.required],
      keyword: [x.keyword, Validators.required],
      purposeID_fk: [x.purposeID_fk, Validators.required],
      score: [x.score, Validators.required],
      storeID: x.storeID,
      text: [x.text, Validators.required],
      owner: this.service.localStorage.get('userLogin')['uid'],
      UnitID: [x.examunitID_fk, Validators.required],
    });
    this.checkEditexam = true
  };


  public onDeleteexam = (x:any) => {
    let dataDeleteexam = {
      storeID:x.storeID
    }
    this.service.httpPost(`/exstore/delexam?token=${this.service.localStorage.get('userLogin')['token']}`, JSON.stringify(dataDeleteexam)).then((value: any) => {
      if (value.success) {
        this.onGetexam();
        this.service.showAlert('', 'ลบสำเร็จ', 'success');
      } else {
        this.service.showAlert('', value.message, 'error');
      }
    });
  };
}
