import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import MySQLParser, { SqlMode, MySQLQueryType } from 'ts-mysql-parser';

const parser = new MySQLParser({
  version: '5.7.7',
  mode: SqlMode.AnsiQuotes,
});
const _window: any = window;

@Component({
  selector: 'app-exam-test',
  templateUrl: './exam-test.component.html',
  styleUrls: ['./exam-test.component.scss'],
})
export class ExamTestComponent implements OnInit {
  public Getexamtopicdata: any = null;
  public checkPassword: boolean = true;
  public answerFrom: FormGroup;
  public countdownInterval: any = null;
  public timeCountdow: string = '00:00:00';
  public isIPAddress: boolean = false;
  public listSelect: number = 0;
  public testSuccess: boolean = false;

  public sqlFormat = {
    isTrue: false,
    message: '',
    keywordMissing: '',
  };

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

  answerKeyup = (str: string, keyword: Array<any>) => {
    const checkSQLParse = parser.parse(`${str}`);
    let listMissing = [];
    if (checkSQLParse['parserError'] == undefined) {
      this.sqlFormat.isTrue = true;

      keyword.forEach((e, i) => {
        if (!str.toLowerCase().includes(`${e}`.toLowerCase()))
          listMissing.push(`${keyword[i]}`);
      });

      this.sqlFormat.keywordMissing = listMissing.join(', ');
    } else {
      this.sqlFormat = {
        isTrue: false,
        message: checkSQLParse['parserError']['message'],
        keywordMissing: '',
      };
    }
  };

  timeRemake = (time) => {
    let dt = new Date(time);

    return `${dt.getDate()} ${this.service.month[dt.getMonth()]} ${
      dt.getFullYear() + 543
    }  ${dt.getHours()}:${dt.getMinutes()}`;
  };

  public testCountDown = (timeNow, timeEnd, timeStart) => {
    let countDownDate = new Date(timeEnd).getTime();
    let now = new Date(timeNow).getTime();
    let start = new Date(timeStart).getTime();
    let distance = countDownDate - now;

    if (!this.testSuccess) {
      if (start - now > 0) {
        this.service.showAlert('ยังไม่ถึงเวลาเข้าสอบ', '', 'error');
      } else {
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

          if (distance < 0) {
            clearInterval(this.countdownInterval);
            this.checkPassword = true;
            // this.service.showAlert(
            //   'หมดเวลาทำข้อสอบ',
            //   `${this.Getexamtopicdata['result'][0].group_name}`,
            //   'error'
            // );

            this.countdownInterval = null;
            this.onSubmitAnswer(false);
          }
        }, 1000);
      }
    } else {
      this.service.showAlert(
        'คุณทำข้อสอบชุดนี้แล้ว',
        'สามารถดูคะแนนได้หลังจากหมดเวลาสอบ',
        'error'
      );
    }
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

          value['topicData'].forEach((e) => {
            if (e['isEnd'] == 'true') {
              this.testSuccess = true;
            }
          });

          if (`${value['result'][0]['limitIP']}` == '0') {
            this.isIPAddress = true;
          } else {
            if (
              `${value['MyIp']}`.split('.')[0] !=
              `${value['result'][0]['limitIP']}`.split('.')[0]
            ) {
              this.service.showAlert(
                'ไม่อนุญาตให้เข้าสอบจากเครือข่ายของคุณ',
                '',
                'error'
              );
              this.isIPAddress = false;
            } else {
              this.isIPAddress = true;
            }
          }

          // start count time
          this.testCountDown(
            `${this.Getexamtopicdata['getDateTime']}`.replace(/ /g, 'T'),
            `${this.Getexamtopicdata['result'][0]['timeEnd']}`,
            `${this.Getexamtopicdata['result'][0]['timeStart']}`
          );

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
                  studentAnswer: [
                    element.studentAnswer ? element.studentAnswer : '',
                    Validators.required,
                  ],
                  studentScore: [
                    element.studentScore ? element.studentScore : '',
                    Validators.required,
                  ],
                  teacherScore: [
                    element.teacherScore ? element.teacherScore : '',
                    Validators.required,
                  ],
                  stringMatch: [
                    element.stringMatch ? element.stringMatch : '',
                    Validators.required,
                  ],
                  checkDetail: [
                    element.checkDetail ? element.checkDetail : '',
                    Validators.required,
                  ],
                  isEnd: ['false', Validators.required],
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

  public onSubmitOneAnswer = (indexAnswer: number, topicData: any) => {
    let formAnswer: FormGroup = this.answerFrom.get('answerList')['controls'][
      indexAnswer
    ];

    let studentAnswer: string = `${formAnswer['value']['studentAnswer']}`
      .replace(/,/g, ', ')
      .replace('( ', '(')
      .replace(' )', ')')
      .replace(/\n/g, ' ')
      .replace(/\s\s+/g, ' ');

    let teacherAnswer: string = `${topicData['answer']}`
      .replace(/,/g, ', ')
      .replace('( ', '(')
      .replace(' )', ')')
      .replace(/\s\s+/g, ' ')
      .replace(/\n/g, ' ');

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
        studentCount: 0,
        percent: 0,
      },
      stringMatch: {
        percent: 0,
        same: 0,
      },
    };

    let stringMatch = '';

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
          if (score.arrayMatch.studentRow.length > 0) {
            if (keyword.includes('order by')) {
              // Check column match
              let listCol = [
                ...new Set([
                  ...score.arrayMatch.teacherColumn,
                  ...score.arrayMatch.studentColumn,
                ]),
              ];

              let isColMatch = true;

              listCol.forEach((e, i) => {
                if (
                  `${score.arrayMatch.teacherColumn[i]}` ===
                    `${score.arrayMatch.studentColumn[i]}` &&
                  score.arrayMatch.teacherColumn[i] != undefined &&
                  score.arrayMatch.teacherColumn[i] != ''
                ) {
                  listCol[i] = { col: `${e}`, match: true };
                } else {
                  listCol[i] = { col: `${e}`, match: false };
                  isColMatch = false;
                }
              });

              // console.log(listCol);

              // Check row
              if (isColMatch) {
                const Compare = (arr1, arr2) => {
                  if (arr1.length != arr2.length) {
                    return false;
                  }

                  let a1 = arr1.map((e) => JSON.stringify(e));
                  let a2 = arr2.map((e) => JSON.stringify(e));

                  return !a1.map((e, i) => e == a2[i]).includes(false);
                };

                score.arrayMatch.isQueryMatch = Compare(
                  score.arrayMatch.studentRow,
                  score.arrayMatch.teacherRow
                );
              } else {
                score.arrayMatch.isQueryMatch = false;
              }

              resolveSelect(true);
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

      Object.keys(keywordStudent).forEach((e) => {
        if (keywordStudent[e]) {
          score.keywordMatch.studentCount += 1;
        }
      });

      score.keywordMatch.keywordStudent = keywordStudent;
      score.keywordMatch.percent =
        (score.keywordMatch.studentCount / keywordTeacher.length) * 100;

      resoveCheckKeyword(true);
    });

    // 3. Check string match
    let promiseCheckStringMatch = new Promise((resloveCheckStringMatch) => {
      let countSame = 0;

      function diff(teacherString, studentString) {
        let teacherStringObj = new Object();
        let studentStringObj = new Object();

        for (let i = 0; i < teacherString.length; i++) {
          if (teacherStringObj[teacherString[i]] == null)
            teacherStringObj[teacherString[i]] = {
              rows: new Array(),
            };
          teacherStringObj[teacherString[i]].rows.push(i);
        }

        for (let i = 0; i < studentString.length; i++) {
          if (studentStringObj[studentString[i]] == null)
            studentStringObj[studentString[i]] = {
              rows: new Array(),
            };
          studentStringObj[studentString[i]].rows.push(i);
        }

        for (let i in studentStringObj) {
          if (
            studentStringObj[i].rows.length == 1 &&
            typeof teacherStringObj[i] != 'undefined' &&
            teacherStringObj[i].rows.length == 1
          ) {
            studentString[studentStringObj[i].rows[0]] = {
              text: studentString[studentStringObj[i].rows[0]],
              row: teacherStringObj[i].rows[0],
            };

            teacherString[teacherStringObj[i].rows[0]] = {
              text: teacherString[teacherStringObj[i].rows[0]],
              row: studentStringObj[i].rows[0],
            };
          }
        }

        for (let i = 0; i < studentString.length - 1; i++) {
          if (
            studentString[i].text != null &&
            studentString[i + 1].text == null &&
            studentString[i].row + 1 < teacherString.length &&
            teacherString[studentString[i].row + 1].text == null &&
            studentString[i + 1] == teacherString[studentString[i].row + 1]
          ) {
            studentString[i + 1] = {
              text: studentString[i + 1],
              row: studentString[i].row + 1,
            };

            teacherString[studentString[i].row + 1] = {
              text: teacherString[studentString[i].row + 1],
              row: i + 1,
            };
          }
        }

        for (let i = studentString.length - 1; i > 0; i--) {
          if (
            studentString[i].text != null &&
            studentString[i - 1].text == null &&
            studentString[i].row > 0 &&
            teacherString[studentString[i].row - 1].text == null &&
            studentString[i - 1] == teacherString[studentString[i].row - 1]
          ) {
            studentString[i - 1] = {
              text: studentString[i - 1],
              row: studentString[i].row - 1,
            };

            teacherString[studentString[i].row - 1] = {
              text: teacherString[studentString[i].row - 1],
              row: i - 1,
            };
          }
        }

        // o = teacherString
        // n = studentString
        return { o: teacherString, n: studentString };
      }

      const diffString = (o, n) => {
        let out = diff(
          o == '' ? [] : o.split(/\s+/),
          n == '' ? [] : n.split(/\s+/)
        );

        let str = '';

        if (out.n.length == 0) {
          for (let i = 0; i < out.o.length; i++) {
            str += `#DC3544,!-` + out.o[i] + ' ';
          }
        } else {
          if (out.n[0].text == null) {
            for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
              str += `#DC3544,!-` + out.o[n] + ' ';
            }
          }

          for (let i = 0; i < out.n.length; i++) {
            if (out.n[i].text == null) {
              // str += `#343A40,!-` + out.n[i] + ' ';
            } else {
              let pre = '';

              for (
                n = out.n[i].row + 1;
                n < out.o.length && out.o[n].text == null;
                n++
              ) {
                pre += `#DC3544,!-` + out.o[n] + ' ';
              }
              countSame += 1;
              str += `#2DA745,!-` + out.n[i].text + ' ' + pre;
            }
          }
        }

        return str.replace(/\s\s+/g, ' ').replace(/\n/g, ' ');
      };

      stringMatch = diffString(
        teacherAnswer.toLowerCase(),
        studentAnswer.toLowerCase()
      );
      let arrTeacher = teacherAnswer.split(' ');
      let arrStudent = studentAnswer.split(' ');
      let len =
        arrTeacher.length > arrStudent.length
          ? arrTeacher.length
          : arrStudent.length;

      let percent = (countSame / len) * 100;

      score.stringMatch.percent = percent;
      score.stringMatch.same = countSame;

      resloveCheckStringMatch(true);
    });

    Promise.all([
      promiseCheckArrayMatch,
      promiseCheckKeywordMatch,
      promiseCheckStringMatch,
    ]).then((val) => {
      // console.log('examStoreData', topicData);
      // console.log('score', score);
      let sumScore: number;
      if (
        teacherAnswer.toLowerCase().includes('select') &&
        score.arrayMatch.teacherRow.length > 0 &&
        score.arrayMatch.teacherColumn.length > 0
      ) {
        let subSc = topicData.score / 3;
        // console.log('subSc', subSc);
        // console.log('rm1', (subSc * 2) / 100);
        // console.log('km1', (subSc * score.keywordMatch.percent) / 100);
        // console.log('strm1', (subSc * score.stringMatch.percent) / 100);
        sumScore = score.arrayMatch.isQueryMatch
          ? subSc * 2 + (subSc * score.keywordMatch.percent) / 100
          : (subSc * score.keywordMatch.percent) / 100 +
            (subSc * score.stringMatch.percent) / 100;
        // console.log('sumScore', sumScore);
      } else {
        let subSc = topicData.score / 2;
        // console.log('subSc', subSc);
        // console.log('km', (subSc * score.keywordMatch.percent) / 100);
        // console.log('strm', (subSc * score.stringMatch.percent) / 100);
        sumScore =
          (subSc * score.keywordMatch.percent) / 100 +
          (subSc * score.stringMatch.percent) / 100;
        // console.log('sumScore', sumScore);
      }

      this.answerFrom.get('answerList')['controls'][indexAnswer].patchValue({
        checkDetail: JSON.stringify({ ...score }),
        stringMatch: stringMatch,
        studentScore: sumScore,
      });

      this.http
        .post(
          `${environment.rootAPI}stTesting/insertOneAns?token=${
            this.service.localStorage.get('userLogin')['token']
          }`,
          JSON.stringify(this.answerFrom.value.answerList[indexAnswer])
        )
        .toPromise()
        .then((value: any) => {
          if (value.isLogin == false) {
            // window.close();
          }
        })
        .catch((reason) => {
          console.log(reason);
        });
    });
  };

  public onSubmitAnswer = (isSubmit = false) => {
    // Update isEnd
    // let formAnswer: FormGroup = this.answerFrom.get('answerList')['controls'];

    if (isSubmit) {
      this.service
        .showConfirm(
          'สิ้นสุดการทำแบบทดสอบ',
          `เวลาที่เหลือ ${this.timeCountdow}`,
          'warning'
        )
        .then((val) => {
          if (val) {
            this.answerFrom.get('answerList')['controls'].forEach((e, i) => {
              this.answerFrom.get('answerList')['controls'][i].patchValue({
                isEnd: 'true',
              });
            });

            this.http
              .post(
                `${environment.rootAPI}stTesting/insertAns?token=${
                  this.service.localStorage.get('userLogin')['token']
                }`,
                JSON.stringify(this.answerFrom.value.answerList)
              )
              .toPromise()
              .then((value: any) => {
                window.close();
              })
              .catch((reason) => {
                console.log(reason);
              });
          }
        });
    } else {
      this.answerFrom.get('answerList')['controls'].forEach((e, i) => {
        this.answerFrom.get('answerList')['controls'][i].patchValue({
          isEnd: 'true',
        });
      });

      this.http
        .post(
          `${environment.rootAPI}stTesting/insertAns?token=${
            this.service.localStorage.get('userLogin')['token']
          }`,
          JSON.stringify(this.answerFrom.value.answerList)
        )
        .toPromise()
        .then((value: any) => {
          if (value.isLogin == false) {
            // window.close();
          }
        })
        .catch((reason) => {
          console.log(reason);
        });
    }
  };

  public getKeyObject = (array) => {
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
