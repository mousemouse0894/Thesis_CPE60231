import { SharedModule } from './../../../../shared/shared-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShareExamRoutingModule } from './share-exam-routing.module';
import { ShareExamComponent } from './share-exam.component';

@NgModule({
  declarations: [ShareExamComponent],
  imports: [CommonModule, ShareExamRoutingModule, SharedModule],
})
export class ShareExamModule {}
