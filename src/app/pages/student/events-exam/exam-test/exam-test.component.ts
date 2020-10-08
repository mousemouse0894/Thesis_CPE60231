import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { promise } from 'protractor';

@Component({
  selector: 'app-exam-test',
  templateUrl: './exam-test.component.html',
  styleUrls: ['./exam-test.component.scss'],
})
export class ExamTestComponent implements OnInit {
  public Getexamtopicdata: any = null;
  public checkPassword: boolean = true;
  public answerFrom: FormGroup;
  private countdownInterval: any = null;
  public timeCountdow: string = '00:00:00';

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

  public testCountDown = (timeNow, timeEnd) => {
    let countDownDate = new Date(timeEnd).getTime();
    let now = new Date(timeNow).getTime();
    let distance = countDownDate - now;

    this.countdownInterval = setInterval(() => {
      now += 1000;
      distance = countDownDate - now;

      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.timeCountdow = `${this.service.zeroPad(
        hours,
        10
      )}:${this.service.zeroPad(minutes, 10)}:${this.service.zeroPad(
        seconds,
        10
      )}`;

      // if (distance < 0) {
      //   clearInterval(this.countdownInterval);
      //   document.getElementById("demo").innerHTML = "EXPIRED";
      // }
    }, 1000);
  };

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
                  studentScore: ['', Validators.required],
                  teacherScore: [null],
                  checkDetail: ['', Validators.required],
                  isEnd: [null, Validators.required],
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
      this.testCountDown(
        this.Getexamtopicdata['getDateTime'],
        this.Getexamtopicdata['result'][0]['timeEnd']
      );
    } else {
      this.service.showAlert('รหัสผ่านไม่ถูกต้อง', '', 'error');
    }
  };

  public onSubmitOneAnswer = (indexAnswer: number, topicData: any) => {
    let formAnswer: FormGroup = this.answerFrom.get('answerList')['controls'][
      indexAnswer
    ];

    let studentAnswer: string = `${formAnswer['value']['studentAnswer']}`
      .replace(/,/g, ', ')
      .replace('( ', '(')
      .replace(' )', ')')
      .replace(/\s\s+/g, ' ');

    let teacherAnswer: string = `${topicData['answer']}`
      .replace(/,/g, ', ')
      .replace('( ', '(')
      .replace(' )', ')')
      .replace(/\s\s+/g, ' ');

    let keyword: Array<string> = [
      ...[...JSON.parse(`${topicData['keyword']}`)].map((m) =>
        `${m}`.toLowerCase()
      ),
    ];

    let score = {
      arrayMatch: {
        teacherRow: [],
        studentRow: [],
        teacherColumn: [],
        studentColumn: [],
        isQueryMatch: false,
        tableMatch: [],
      },
      keywordMatch: {
        keywordTeacher: keyword,
        keywordStudent: {},
      },
      stringMatch: {
        teacherAnswer: teacherAnswer,
        studentAnswer: studentAnswer,
      },
    };

    // 1. check array match
    let promiseCheckArrayMatch = new Promise((resolveSelect) => {
      if (teacherAnswer.toLowerCase().includes('select')) {
        // Student Query Value
        let studentQuery = new Promise((resolve) => {
          this.http
            .post(
              `${environment.rootAPI}exdatabase/simquery?token=${
                this.service.localStorage.get('userLogin')['token']
              }`,
              JSON.stringify({
                sqldatabase: topicData.databaseName,
                sqlquery: studentAnswer,
              })
            )
            .toPromise()
            .then((value: any) => {
              if (value.success) {
                if (value.result['isQuery']) {
                  resolve({ student: value['result'] });
                }
                resolve({ student: null });
              } else {
                resolve({ student: null });
              }
            })
            .catch(() => {
              resolve({ student: null });
            });
        });

        // Teacher Query Value
        let teacherQuery = new Promise((resolve) => {
          this.http
            .post(
              `${environment.rootAPI}exdatabase/simquery?token=${
                this.service.localStorage.get('userLogin')['token']
              }`,
              JSON.stringify({
                sqldatabase: topicData.databaseName,
                sqlquery: teacherAnswer,
              })
            )
            .toPromise()
            .then((value: any) => {
              if (value.success) {
                if (value.result['isQuery']) {
                  resolve({ teacher: value['result'] });
                }
                resolve({ teacher: null });
              } else {
                resolve({ teacher: null });
              }
            })
            .catch(() => {
              resolve({ teacher: null });
            });
        });

        Promise.all([studentQuery, teacherQuery]).then((values: any) => {
          // Extract array from promise
          const [student, teacher] = [...values];
          const studentQuery = { ...student.student };
          const teacherQuery = { ...teacher.teacher };

          score.arrayMatch = {
            teacherRow: teacherQuery['result'] ? teacherQuery['result'] : [],
            studentRow: studentQuery['result'] ? studentQuery['result'] : [],
            teacherColumn: this.getKeyObject(
              teacherQuery['result'] ? teacherQuery['result'] : []
            ),
            studentColumn: this.getKeyObject(
              studentQuery['result'] ? studentQuery['result'] : []
            ),
            isQueryMatch: true,
            tableMatch: [],
          };

          // After Query
          // Check value between teacher and student
          let newObj = [];
          let allkey = [
            ...new Set([
              ...score.arrayMatch.teacherColumn,
              ...score.arrayMatch.studentColumn,
            ]),
          ];

          if (score.arrayMatch.studentRow.length > 0) {
            if (keyword.includes('order by')) {
              // Row match with order by
              if (
                score.arrayMatch.studentRow.length >
                score.arrayMatch.teacherRow.length
              ) {
                score.arrayMatch.studentRow.forEach((array, i) => {
                  if (typeof newObj[i] != 'object') newObj[i] = {};
                  allkey.forEach((obj) => {
                    try {
                      if (score.arrayMatch.teacherRow[i][obj]) {
                        if (
                          score.arrayMatch.teacherRow[i][obj] ==
                          score.arrayMatch.studentRow[i][obj]
                        ) {
                          newObj[i][
                            `green,${obj}`
                          ] = `<span style="color : #0f0">${score.arrayMatch.studentRow[i][obj]}</span>`;
                        } else {
                          score.arrayMatch.isQueryMatch = false;
                          newObj[i][
                            `red,${obj}`
                          ] = `<span style="color : #000">${score.arrayMatch.teacherRow[i][obj]}</span>`;
                        }
                      } else {
                        score.arrayMatch.isQueryMatch = false;
                        newObj[i][
                          `black,${obj}`
                        ] = `<span style="color : #000">${score.arrayMatch.studentRow[i][obj]}</span>`;
                      }
                    } catch (e) {
                      score.arrayMatch.isQueryMatch = false;
                      newObj[i][`black,${obj}`] = `<span style="color : #000">${
                        score.arrayMatch.studentRow[i][obj] == undefined
                          ? ''
                          : score.arrayMatch.studentRow[i][obj]
                      }</span>`;
                    }
                  });
                });

                score.arrayMatch.tableMatch = [...newObj];
                resolveSelect(true);
              } else {
                score.arrayMatch.teacherRow.forEach((array, i) => {
                  if (typeof newObj[i] != 'object') newObj[i] = {};
                  allkey.forEach((obj) => {
                    try {
                      if (score.arrayMatch.studentRow[i][obj]) {
                        if (
                          score.arrayMatch.teacherRow[i][obj] ==
                          score.arrayMatch.studentRow[i][obj]
                        ) {
                          newObj[i][
                            `green,${obj}`
                          ] = `<span style="color : #0f0">${score.arrayMatch.teacherRow[i][obj]}</span>`;
                        } else {
                          score.arrayMatch.isQueryMatch = false;
                          newObj[i][
                            `black,${obj}`
                          ] = `<span style="color : #000">${score.arrayMatch.studentRow[i][obj]}</span>`;
                        }
                      } else {
                        score.arrayMatch.isQueryMatch = false;
                        newObj[i][
                          `red,${obj}`
                        ] = `<span style="color : #f00">${score.arrayMatch.teacherRow[i][obj]}</span>`;
                      }
                    } catch (e) {
                      score.arrayMatch.isQueryMatch = false;
                      newObj[i][`black,${obj}`] = `<span style="color : #000">${
                        score.arrayMatch.teacherRow[i][obj] == undefined
                          ? ''
                          : score.arrayMatch.teacherRow[i][obj]
                      }</span>`;
                    }
                  });
                });

                score.arrayMatch.tableMatch = [...newObj];
                resolveSelect(true);
              }
            } else {
              // Row match without order by
              const Compare = (arr1, arr2) => {
                if (arr1.length != arr2.length) {
                  return false;
                }

                let a1 = arr1.map((e) => JSON.stringify(e)).sort();
                let a2 = arr2.map((e) => JSON.stringify(e)).sort();

                return !a1.map((e, i) => e == a2[i]).includes(false);
              };

              score.arrayMatch.isQueryMatch = Compare(
                score.arrayMatch.studentRow,
                score.arrayMatch.teacherRow
              );
              resolveSelect(true);
            }
          } else {
            // Student Query Error
            score.arrayMatch.isQueryMatch = false;
            resolveSelect(true);
          }
        });
      } else {
        resolveSelect(true);
      }
    });

    // 2. Check keyword match
    let promiseCheckKeywordMatch = new Promise((resoveCheckKeyword) => {
      let { keywordTeacher } = score.keywordMatch;
      let { keywordStudent } = score.keywordMatch;

      keywordTeacher.forEach((e, i) => {
        if (e == 'sub query') {
          keywordStudent[e] =
            (studentAnswer.toLowerCase().match(/select/g) || []).length > 1;
        } else {
          keywordStudent[e] = studentAnswer.toLowerCase().includes(e);
        }
      });

      score.keywordMatch.keywordStudent = keywordStudent;
      resoveCheckKeyword(true);
    });

    // 3. Check string match
    let promiseCheckStringMatch = new Promise((resloveCheckStringMatch) => {
      function diff(o, n) {
        let ns = new Object();
        let os = new Object();

        for (let i = 0; i < n.length; i++) {
          if (ns[n[i]] == null) ns[n[i]] = { rows: new Array(), o: null };
          ns[n[i]].rows.push(i);
        }

        for (let i = 0; i < o.length; i++) {
          if (os[o[i]] == null) os[o[i]] = { rows: new Array(), n: null };
          os[o[i]].rows.push(i);
        }

        for (let i in ns) {
          if (
            ns[i].rows.length == 1 &&
            typeof os[i] != 'undefined' &&
            os[i].rows.length == 1
          ) {
            n[ns[i].rows[0]] = { text: n[ns[i].rows[0]], row: os[i].rows[0] };
            o[os[i].rows[0]] = { text: o[os[i].rows[0]], row: ns[i].rows[0] };
          }
        }

        for (let i = 0; i < n.length - 1; i++) {
          if (
            n[i].text != null &&
            n[i + 1].text == null &&
            n[i].row + 1 < o.length &&
            o[n[i].row + 1].text == null &&
            n[i + 1] == o[n[i].row + 1]
          ) {
            n[i + 1] = { text: n[i + 1], row: n[i].row + 1 };
            o[n[i].row + 1] = { text: o[n[i].row + 1], row: i + 1 };
          }
        }

        for (let i = n.length - 1; i > 0; i--) {
          if (
            n[i].text != null &&
            n[i - 1].text == null &&
            n[i].row > 0 &&
            o[n[i].row - 1].text == null &&
            n[i - 1] == o[n[i].row - 1]
          ) {
            n[i - 1] = { text: n[i - 1], row: n[i].row - 1 };
            o[n[i].row - 1] = { text: o[n[i].row - 1], row: i - 1 };
          }
        }

        return { o: o, n: n };
      }

      const diffString = (o, n) => {
        o = o.replace(/\s+$/, '');
        n = n.replace(/\s+$/, '');

        let out = diff(
          o == '' ? [] : o.split(/\s+/),
          n == '' ? [] : n.split(/\s+/)
        );
        let str = '';

        let oSpace = o.match(/\s+/g);
        if (oSpace == null) {
          oSpace = ['\n'];
        } else {
          oSpace.push('\n');
        }
        let nSpace = n.match(/\s+/g);
        if (nSpace == null) {
          nSpace = ['\n'];
        } else {
          nSpace.push('\n');
        }

        if (out.n.length == 0) {
          for (let i = 0; i < out.o.length; i++) {
            str += '<del>' + escape(out.o[i]) + oSpace[i] + '</del>';
          }
        } else {
          if (out.n[0].text == null) {
            for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
              str += '<del>' + escape(out.o[n]) + oSpace[n] + '</del>';
            }
          }

          for (let i = 0; i < out.n.length; i++) {
            if (out.n[i].text == null) {
              str += '<ins>' + escape(out.n[i]) + nSpace[i] + '</ins>';
            } else {
              let pre = '';

              for (
                n = out.n[i].row + 1;
                n < out.o.length && out.o[n].text == null;
                n++
              ) {
                pre += '<del>' + escape(out.o[n]) + oSpace[n] + '</del>';
              }
              str += ' ' + out.n[i].text + nSpace[i] + pre;
            }
          }
        }

        return str;
      };

      console.log(diffString(studentAnswer, teacherAnswer));

      resloveCheckStringMatch(true);
    });

    Promise.all([
      promiseCheckArrayMatch,
      promiseCheckKeywordMatch,
      promiseCheckStringMatch,
    ]).then((val) => {
      console.log(score);
    });
  };

  public onSubmitAnswer = () => {
    // Update isEnd

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
          // window.close();
        }
      })
      .catch((reason) => {
        console.log(reason);
      });
  };

  private getKeyObject = (array) => {
    if (array) {
      if (array.length > 0) {
        let ObjectData = [...array];
        return Object.keys(ObjectData[0]);
      } else if (typeof array == 'object') {
        return Object.keys(array);
      } else {
        return [];
      }
    }
    return [];
  };
}
