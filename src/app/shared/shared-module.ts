import { CalendarModule } from 'angular-calendar';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material-module';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import { CalendarHeaderComponent } from './calendar-header.component';
import { ToastrModule } from 'ngx-toastr';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { MdePopoverModule } from '@material-extended/mde';

FullCalendarModule.registerPlugins([
  // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
]);

@NgModule({
  declarations: [CalendarHeaderComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    FullCalendarModule,
    CalendarModule,
    ToastrModule,
    FroalaEditorModule,
    FroalaViewModule,
    MdePopoverModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    FullCalendarModule,
    CalendarModule,
    CalendarHeaderComponent,
    ToastrModule,
    FroalaEditorModule,
    FroalaViewModule,
    MdePopoverModule,
  ],
})
export class SharedModule {}

/**  Copyright 2019 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
