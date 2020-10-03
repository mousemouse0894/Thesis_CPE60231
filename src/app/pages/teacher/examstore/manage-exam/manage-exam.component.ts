import { AppService } from 'src/app/services/app.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import Compressor from 'compressorjs';
import FroalaEditor from 'froala-editor';

const _window: any = window;
let self = null;

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
  public checkEditexam: boolean = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  allKeyword: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  keyword: any[] = [];
  @ViewChild('keywordInput') keywordInput: ElementRef<HTMLInputElement>;

  public options: Object = {
    placeholderText: 'โจทย์',
    charCounterCount: false,
    events: {
      'image.beforePasteUpload': function (img) {
        if (img.src) {
          let data = {
            img: img.src,
            imgType: 'png',
          };

          self.service
            .httpPost(
              `/upload?token=${
                self.service.localStorage.get('userLogin')['token']
              }`,
              JSON.stringify(data)
            )
            .then((val: any) => {
              img.src = `${self.service.rootFile}${val.path}`;
            });

          return false;
        }
        return false;
      },
      'image.beforeUpload': function (images) {
        let that = this;
        new Compressor(images[0], {
          quality: 0.75,
          success(result) {
            let reader = new FileReader();
            let imgA: any = result;
            reader.onload = function (img) {
              let data = {
                img: img.target.result,
                imgType: imgA.name.split('.')[imgA.name.split('.').length - 1],
              };

              self.service
                .httpPost(
                  `/upload?token=${
                    self.service.localStorage.get('userLogin')['token']
                  }`,
                  JSON.stringify(data)
                )
                .then((val: any) => {
                  that.image.insert(
                    `${self.service.rootFile}${val.path}`,
                    null,
                    null,
                    that.image.get()
                  );
                });
            };
            reader.readAsDataURL(result);
          },
          error(err) {
            self.service.showAlert('ไม่รองรับไฟล์นี้', '', 'error');
            console.log(err.message);
          },
        });

        this.popups.hideAll();
        return false;
      },
    },
  };

  constructor(public service: AppService, private formBuilder: FormBuilder) {
    self = this;
  }

  ngOnInit() {
    this.formInsertexam = this.formBuilder.group({
      purposeID_fk: ['', Validators.required],
      databaseName: ['', Validators.required],
      text: [''],
      answer: ['', Validators.required],
      keyword: ['', Validators.required],
      score: ['', Validators.required],
      UnitID: ['', Validators.required],
      owner: this.service.localStorage.get('userLogin')['uid'],
      oldOwner: this.service.localStorage.get('userLogin')['uid'],
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
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  public onInsartexam = () => {
    // this.formInsertexam.patchValue({
    //   text: this.froalaEditor.html.get(),
    // });
    if (this.checkEditexam) {
      console.log(this.formInsertexam.value);
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
            _window.$('#exampleModalCreactExam').modal('hide');
            this.checkEditexam = false;
            this.onGetexam();
            this.service.showAlert('', 'แก้ไขสำเร็จสำเร็จ', 'success');
          } else {
            this.service.showAlert('', value.message, 'error');
          }
        });
    } else {
      console.log(JSON.stringify(this.formInsertexam.value));
      this.service
        .httpPost(
          `/exstore/insertexam?token=${
            this.service.localStorage.get('userLogin')['token']
          }`,
          JSON.stringify(this.formInsertexam.value)
        )
        .then((value: any) => {
          if (value.success) {
            console.log(value);
            _window.$('#exampleModalCreactExam').modal('hide');
            this.onGetexam();
            this.service.showAlert('', 'เพิ่มสำเร็จ', 'success');
          } else {
            this.service.showAlert('', value.message, 'error');
          }
        });
    }
  };

  public onCheckupdateexam = (x: any) => {
    this.getUnittable();
    this.onGetselectunit(x.examunitID_fk);
    this.keyword = JSON.parse(x.keyword);
    this.formInsertexam = this.formBuilder.group({
      answer: [x.answer, Validators.required],
      databaseName: [x.databaseName, Validators.required],
      keyword: [x.keyword, Validators.required],
      purposeID_fk: [x.purposeID_fk, Validators.required],
      score: [x.score, Validators.required],
      storeID: x.storeID,
      text: [x.text, Validators.required],
      owner: this.service.localStorage.get('userLogin')['uid'],
      UnitID: [x.examunitID_fk, Validators.required],
      oldID: x.oldID,
      oldOwner: x.oldOwner,
    });
    this.checkEditexam = true;
  };

  public onDeleteexam = (x: any) => {
    let dataDeleteexam = {
      storeID: x.storeID,
    };
    this.service
      .httpPost(
        `/exstore/delexam?token=${
          this.service.localStorage.get('userLogin')['token']
        }`,
        JSON.stringify(dataDeleteexam)
      )
      .then((value: any) => {
        if (value.success) {
          this.onGetexam();
          this.service.showAlert('', 'ลบสำเร็จ', 'success');
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.keyword.push({ name: value.trim() });
    }
    if (input) {
      input.value = '';
    }
    this.formInsertexam.patchValue({
      keyword: this.keyword.length > 0 ? JSON.stringify(this.keyword) : '',
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event);
    this.keyword.push({ name: event.option.viewValue });
    this.keywordInput.nativeElement.value = null;
    this.keywordInput.nativeElement.blur();

    this.formInsertexam.patchValue({
      keyword: this.keyword.length > 0 ? JSON.stringify(this.keyword) : '',
    });
  }

  remove(fruit: any): void {
    const index = this.keyword.indexOf(fruit);

    if (index >= 0) {
      this.keyword.splice(index, 1);
    }

    this.formInsertexam.patchValue({
      keyword: this.keyword.length > 0 ? JSON.stringify(this.keyword) : '',
    });
  }
}
