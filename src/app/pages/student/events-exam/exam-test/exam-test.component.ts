import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-exam-test',
  templateUrl: './exam-test.component.html',
  styleUrls: ['./exam-test.component.scss'],
})
export class ExamTestComponent implements OnInit {
  public Getexamtopicdata: any = null;
  public checkPassword: boolean = true;
  public answerFrom: FormGroup;

  constructor(
    public service: AppService,
    private activeRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    // console.log(this.activeRoute.snapshot.paramMap.get('topicId'));
    this.onGetexamtopicdata();
    this.service.showSidenav = false;
    this.answerFrom = this.formBuilder.group({
      answerList: this.formBuilder.array([]),
    });
  }

  public onGetexamtopicdata = () => {
    this.service
      .httpGet(
        `/extopic/getTopicData/${this.activeRoute.snapshot.paramMap.get(
          'topicId'
        )}/${this.service.localStorage.get('userLogin')['uid']}?token=${
          this.service.localStorage.get('userLogin')['token']
        }
  `
      )
      .then((value: any) => {
        if (value.success) {
          this.Getexamtopicdata = value;
          if (value.topicData.length > 0) {
            let answerList = this.answerFrom.get('answerList') as FormArray;
            value.topicData.forEach((element) => {
              answerList.push(
                this.formBuilder.group({
                  stID_fk: this.service.localStorage.get('userLogin')['uid'],
                  topicID_fk: [element.examtopicID, Validators.required],
                  storeID_fk: [element.storeID, Validators.required],
                  groupID_fk: this.service.localStorage.get('userLogin')[
                    'groupid_fk'
                  ],
                  studentAnswer: ['', Validators.required],
                  studentScore: [null, Validators.required],
                  teacherScore: [null],
                })
              );
            });
          }
        } else {
          this.service.showAlert('', value.massage, 'error');
        }
      });
  };

  public checkTopicpassword = (password) => {
    if (password == this.Getexamtopicdata.result[0].topicPassword) {
      this.checkPassword = false;
    } else {
      this.service.showAlert('รหัสผ่านไม่ถูกต้อง', '', 'error');
    }
  };

  // public onSumitTest = (x: any, studentAnswer: any) => {
  //   let data = {
  //     stID_fk: this.service.localStorage.get('userLogin')['uid'],
  //     topicID_fk: x.examtopicID,
  //     storeID_fk: x.storeID,
  //     groupID_fk: this.service.localStorage.get('userLogin')['groupid_fk'],
  //     studentAnswer: studentAnswer,
  //     studentScore: null,
  //     teacherScore: null,
  //   };

  //   console.log(data);
  //   this.service
  //     .httpPost(
  //       `stTesting/insertAns?token=${
  //         this.service.localStorage.get('userLogin')['token']
  //       }`,
  //       JSON.stringify(data)
  //     )
  //     .then((value: any) => {
  //       if (value.success) {
  //       } else this.service.showAlert('', value.message, 'error');
  //     });
  // };

  public onSubmitAllAnswer = () => {
    this.http
      .post(
        `${environment.rootAPI}stTesting/insertAns?token=${
          this.service.localStorage.get('userLogin')['token']
        }`,
        JSON.stringify(this.answerFrom.value.answerList)
      )
      .toPromise()
      .then((value: any) => {
        console.log(value);
        if (value.isLogin == false) {
          window.close();
        }
      })
      .catch((reason) => {
        console.log(reason);
      });
  };
}
