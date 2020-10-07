import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { AppService } from '../services/app.service';

@Component({
  selector: 'mwl-demo-utils-calendar-header',
  template: `
    <div class="row">
      <div class="col-md-6">
        <div class="btn-group">
          <div
            class="btn btn-primary btn-sm"
            mwlCalendarPreviousView
            [view]="view"
            [(viewDate)]="viewDate"
            (viewDateChange)="viewDateChange.next(viewDate)"
          >
            เดือนที่แล้ว
          </div>
          <div
            class="btn btn-outline-secondary btn-sm"
            mwlCalendarToday
            [(viewDate)]="viewDate"
            (viewDateChange)="viewDateChange.next(viewDate)"
          >
            เดือนนี้
          </div>
          <div
            class="btn btn-primary btn-sm"
            mwlCalendarNextView
            [view]="view"
            [(viewDate)]="viewDate"
            (viewDateChange)="viewDateChange.next(viewDate)"
          >
            เดือนหน้า
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="text-right">
          <h2>
            เดือน{{ service.month[viewDate.getMonth()] }}
            {{ viewDate.getFullYear() + 543 }}
          </h2>
        </div>
      </div>
      <!-- <div class="col-md-4">
        <div class="btn-group">
          <div
            class="btn btn-primary"
            (click)="viewChange.emit(CalendarView.Month)"
            [class.active]="view === CalendarView.Month"
          >
            เดือน
          </div>
          <div
            class="btn btn-primary"
            (click)="viewChange.emit(CalendarView.Week)"
            [class.active]="view === CalendarView.Week"
          >
            สัปดาห์
          </div>
          <div
            class="btn btn-primary"
            (click)="viewChange.emit(CalendarView.Day)"
            [class.active]="view === CalendarView.Day"
          >
            วัน
          </div>
        </div>
      </div> -->
    </div>
    <br />
  `,
})
export class CalendarHeaderComponent {
  @Input() view: CalendarView;

  @Input() viewDate: Date;

  @Input() locale: string = 'th';

  @Output() viewChange = new EventEmitter<CalendarView>();

  @Output() viewDateChange = new EventEmitter<Date>();

  CalendarView = CalendarView;

  constructor(public service: AppService) {}
}
