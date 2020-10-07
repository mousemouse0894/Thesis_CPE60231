import { AppService } from 'src/app/services/app.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-events-exam',
  templateUrl: './events-exam.component.html',
  styleUrls: ['./events-exam.component.scss'],
})
export class EventsExamComponent implements OnInit {
  constructor(public service: AppService) {}

  ngOnInit() {}
}
