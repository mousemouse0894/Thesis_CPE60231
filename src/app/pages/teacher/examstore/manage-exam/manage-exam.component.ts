import { AppService } from 'src/app/services/app.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import Compressor from 'compressorjs';
import FroalaEditor from 'froala-editor';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
  public examResult: Array<any> = [];
  public checkEditexam: boolean = false;
  readonly separatorKeysCodes: number[] = [COMMA];
  public examSelected: any = null;
  public selectPurpose: any = '';
  public teacherResult: any = null;

  allKeyword: string[] = [
    'SUB QUERY',
    'SELECT',
    'INSERT',
    'DELETE',
    'UPDATE',
    'LEFT JOIN',
    'LIMIT',
  ];
  keyword: any[] = [];
  filteredKeyword: Observable<string[]>;
  keywordCtrl = new FormControl();

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
    this.filteredKeyword = this.keywordCtrl.valueChanges.pipe(
      startWith(null),
      map((keyword: string | null) =>
        keyword ? this._filter(keyword) : this.allKeyword.slice()
      )
    );
  }

  private _filter(value: string): string[] {
    return this.allKeyword.filter(
      (keyword) => keyword.toLowerCase().indexOf(value) === 0
    );
  }

  ngOnInit() {
    this.formExamInit();
    this.getTeacher();
    this.getUnittable();
    this.onGetdatabse();
    this.onGetexam();

    _window.$('#exampleModalCreactExam').on('hidden.bs.modal', (e) => {
      this.formExamInit();
    });
  }

  replaceText = (data: string) => {
    let div = document.createElement('div');
    div.innerHTML = data;
    let text: string = div.textContent || div.innerText || '';
    return text.length > 30 ? text.substring(0, 30) + '...' : text;
  };

  filterMyExam = () => {
    if (this.selectPurpose == 'shared') {
      return this.examResult.filter((e, i) => {
        return (
          e.owner == this.service.localStorage.get('userLogin')['uid'] &&
          e.status == 'on' &&
          e.purposeID_fk == null
        );
      });
    } else {
      let filter = this.examResult.filter((e, i) => {
        return (
          e.owner == this.service.localStorage.get('userLogin')['uid'] &&
          e.status == 'on' &&
          e.purposeID_fk != null
        );
      });

      return 'object' == typeof this.selectPurpose
        ? filter.filter((e) => {
            return (
              e.purpose_name == this.selectPurpose.purpose_name &&
              e.unit_name == this.selectPurpose.unit_name
            );
          })
        : filter;
    }
  };

  readPurpose = () => {
    if (this.examResult.length > 0) {
      let list = [];
      this.examResult
        .filter((e) => {
          return e.purpose_name != null;
        })
        .forEach((e) => {
          let obj = {};
          obj['purpose_name'] = e.purpose_name;
          obj['unit_name'] = e.unit_name;

          list.push(JSON.stringify(obj));
        });

      return [...new Set(list)];
    } else {
      return [];
    }
  };

  formExamInit = () => {
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

    this.keyword = [];
  };

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
        `/exdatabase/getall/${
          this.service.localStorage.get('userLogin')['uid']
        }?token=${this.service.localStorage.get('userLogin')['token']}`
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
    this.formInsertexam.patchValue({
      answer: `${this.formInsertexam.value.answer}`.replace(/\s\s+/g, ' '),
    });
    if (this.checkEditexam) {
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
    this.service
      .showConfirm('ยืนยันการลบข้อสอบ', '', 'warning')
      .then((val: boolean) => {
        if (val) {
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
                this.service.showAlert('', 'บันทึกสำเร็จ', 'success');
              } else {
                this.service.showAlert('', value.message, 'error');
              }
            });
        }
      });
  };

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.keyword.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.formInsertexam.patchValue({
      keyword: this.keyword.length > 0 ? JSON.stringify(this.keyword) : '',
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.keyword.push(event.option.viewValue);
    this.keywordInput.nativeElement.value = null;
    this.keywordCtrl.setValue(null);
    this.keywordInput.nativeElement.blur();

    this.formInsertexam.patchValue({
      keyword: this.keyword.length > 0 ? JSON.stringify(this.keyword) : '',
    });
  }

  remove(keyword: any): void {
    const index = this.keyword.indexOf(keyword);

    if (index >= 0) {
      this.keyword.splice(index, 1);
    }

    this.formInsertexam.patchValue({
      keyword: this.keyword.length > 0 ? JSON.stringify(this.keyword) : '',
    });
  }

  showKeyword = () => {
    return this.keyword
      .map((e) => {
        return e;
      })
      .join();
  };

  public getTeacher = () => {
    this.service
      .httpGet(
        `/exstore/getTeacher/${
          this.service.localStorage.get('userLogin')['uid']
        }?token=${this.service.localStorage.get('userLogin')['token']}`
      )
      .then((value: any) => {
        if (value.success) {
          this.teacherResult = value.result;
        } else {
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  public selectExam = (selectExam: any) => {
    this.examSelected = selectExam;
  };

  public shareExam = (selectTeacher: any) => {
    this.service
      .showConfirm('ยืนยันการแบ่งปันข้อสอบ', ``, 'warning')
      .then((val: boolean) => {
        if (val) {
          let data = {
            text: this.examSelected.text,
            answer: this.examSelected.answer,
            keyword: this.examSelected.keyword,
            databaseName: this.examSelected.databaseName,
            newOwner: selectTeacher.uid,
            owner: this.service.localStorage.get('userLogin')['uid'],
            storeID: this.examSelected.storeID,
            score: this.examSelected.score,
          };

          this.service
            .httpPost(
              `/exstore/shareExam?token=${
                this.service.localStorage.get('userLogin')['token']
              }`,
              JSON.stringify(data)
            )
            .then((value: any) => {
              if (value.success) {
                _window.$(`#exampleModalTeaher`).modal('hide');
                this.service.showAlert('', 'บันทึกสำเร็จ', 'success');
              } else {
                this.service.showAlert('', value.message, 'error');
              }
            });
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
}
