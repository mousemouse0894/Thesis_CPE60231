import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exam-test',
  templateUrl: './exam-test.component.html',
  styleUrls: ['./exam-test.component.scss'],
})
export class ExamTestComponent implements OnInit {
  public Getexamtopicdata: any = null;
  public checkPassword: boolean = true;
  constructor(
    public service: AppService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    // console.log(this.activeRoute.snapshot.paramMap.get('topicId'));
    this.onGetexamtopicdata();
  }

  public onGetexamtopicdata = () => {
    this.service
      .httpGet(
        `/extopic/getTopicData/${this.activeRoute.snapshot.paramMap.get(
          'topicId'
        )}?token=${this.service.localStorage.get('userLogin')['token']}
  `
      )
      .then((value: any) => {
        if (value.success) {
          console.log(value);
          this.Getexamtopicdata = value;
        } else {
          this.service.showAlert('', value.massage, 'error');
        }
      });
  };
  public checkTopicpassword = (password) => {
    console.log(password);
    console.log(this.Getexamtopicdata.result[0].topicPassword);
    if (password == this.Getexamtopicdata.result[0].topicPassword) {
      this.checkPassword = false;
      this.service.showAlert('', 'รหัสถูกต้อง', 'success');
    } else {
      this.service.showAlert('', 'รหัสผิด', 'error');
    }
  };
}
