import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryTestRoutingModule } from './history-test-routing.module';
import { HistoryTestComponent } from './history-test.component';


@NgModule({
  declarations: [HistoryTestComponent],
  imports: [
    CommonModule,
    HistoryTestRoutingModule
  ]
})
export class HistoryTestModule { }
