import { TeacherGuard } from './guards/teacher.guard';
import { StudentGuard } from './guards/student.guard';
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DefaultComponent } from './components/default/default.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PrivateComponent } from './components/private/private.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AppService } from './services/app.service';
import { CheckLoginGuard } from './guards/check-login.guard';
import { SharedModule } from './shared/shared-module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import localeTh from '@angular/common/locales/th';
import { ToastrModule } from 'ngx-toastr';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { NgxPaginationModule } from 'ngx-pagination';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { registerLocaleData } from '@angular/common';

import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/third_party/font_awesome.min';

registerLocaleData(localeTh);

@NgModule({
  declarations: [AppComponent, DefaultComponent, PrivateComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    SharedModule,
    NgxPaginationModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    ToastrModule.forRoot(),
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.circle,
      backdropBackgroundColour: 'rgba(0,0,0,0.5)',
      backdropBorderRadius: '0px',
      primaryColour: '#007bff',
      secondaryColour: '#fafafa',
      tertiaryColour: '#ffffff',
    }),
  ],
  providers: [
    AppService,
    CheckLoginGuard,
    StudentGuard,
    TeacherGuard,
    { provide: LOCALE_ID, useValue: 'th-TH' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
