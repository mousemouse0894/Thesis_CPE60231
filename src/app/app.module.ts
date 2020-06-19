import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
    SharedModule
  ],
  providers: [AppService, CheckLoginGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
