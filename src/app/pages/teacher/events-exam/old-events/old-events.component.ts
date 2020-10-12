import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-old-events',
  templateUrl: './old-events.component.html',
  styleUrls: ['./old-events.component.scss'],
})
export class OldEventsComponent implements OnInit, AfterViewInit {
  public historyTestResult: Array<any> = [];
  public listSelect: number = 0;
  public examId: string = '';
  public groupId: string = '';
  public teacherScoreInput = new FormControl();

  constructor(
    private activeRoute: ActivatedRoute,
    public service: AppService
  ) {}

  ngOnInit(): void {
    this.examId = this.activeRoute.snapshot.paramMap.get('examId');
    this.groupId = this.activeRoute.snapshot.paramMap.get('groupId');
    this.testHistory();
  }

  ngAfterViewInit() {}

  private testHistory = () => {
    this.service
      .httpGet(
        `stTesting/teacherGetHistory/${this.examId}/${this.groupId}?token=${
          this.service.localStorage.get('userLogin')['token']
        }`
      )
      .then((value: any) => {
        if (value.success) {
          if (value.result.length > 0) {
            this.historyTestResult =
              value.result.filter((e) => {
                return (
                  e.studentId ==
                  `${this.activeRoute.snapshot.paramMap.get('studentId')}`
                );
              }).length > 0
                ? value.result.filter((e) => {
                    return (
                      e.studentId ==
                      `${this.activeRoute.snapshot.paramMap.get('studentId')}`
                    );
                  })
                : [];

            this.teacherScoreInput.setValue(
              `${
                this.historyTestResult[0]['testData'][this.listSelect][
                  'teacherScore'
                ]
              }`
            );
          }
        } else {
          // this.service.showAlert(``, value.massage, `error`);
        }
      });
  };

  strSplit = (data: string, key: string) => {
    return data.split(key);
  };

  decodeURIComponent = (uri_enc) => {
    return decodeURIComponent(uri_enc);
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

  upperCase = (str: string) => {
    return `${str}`.toLocaleUpperCase();
  };

  subString = (str: any) => {
    return String(str).length > 4 ? String(str).substring(0, 5) : String(str);
  };

  public updateScore = (x: any, score: any) => {
    score = parseInt(score);

    if (score > parseInt(x['score'])) {
      this.service.toastr.error('บันทึกคะแนนไม่สำเร็จ', '');
    } else {
      let data = {
        teacherScore: score,
        stID_fk: x.stID_fk,
        topicID_fk: x.topicID_fk,
        storeID_fk: x.storeID,
      };

      this.service
        .httpPost(
          `stTesting/teacherUpdateScore?token=${
            this.service.localStorage.get('userLogin')['token']
          }
      `,
          JSON.stringify(data)
        )
        .then((value: any) => {
          if (value.success) {
            this.service.toastr.success('บันทึกคะแนนสำเร็จ', '');
          } else {
            this.service.showAlert('', value.message, 'error');
          }
        });
    }
  };
}
