import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-old-events',
  templateUrl: './old-events.component.html',
  styleUrls: ['./old-events.component.scss'],
})
export class OldEventsComponent implements OnInit {
  public historyTestResult: Array<any> = [];
  public listSelect: number = 0;

  constructor(
    private activeRoute: ActivatedRoute,
    public service: AppService
  ) {}

  ngOnInit(): void {
    this.testHistory();
  }

  private testHistory = () => {
    this.service
      .httpGet(
        `stTesting/teacherGetHistory/${this.activeRoute.snapshot.paramMap.get(
          'examId'
        )}/${this.activeRoute.snapshot.paramMap.get('groupId')}?token=${
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

            console.log(this.historyTestResult);
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
}
