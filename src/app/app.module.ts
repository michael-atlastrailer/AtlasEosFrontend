import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LoginComponent } from './components/login/login.component'
import { ToastrModule } from 'ngx-toastr'
import { HttpClientModule } from '@angular/common/http'
import { AdminNavbarComponent } from './components/templates/admin-navbar/admin-navbar.component'
import { SeminarNavbarComponent } from './components/templates/seminar-navbar/seminar-navbar.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { DealerNavbarComponent } from './components/templates/dealer-navbar/dealer-navbar.component'
import { AdminLoginComponent } from './components/admin-login/admin-login.component'
import {
  authInterceptorProviders,
  JwtAuthInterceptor,
} from './core/services/jwt-auth.interceptor'
import { SafepipePipe } from './core/pipes/safepipe.pipe'
import { CommonModule, CurrencyPipe } from '@angular/common'
import { BranchNavbarComponent } from './components/templates/branch-navbar/branch-navbar.component'
import { VendorNavbarComponent } from './components/templates/vendor-navbar/vendor-navbar.component'
import { ChatService } from './core/services/chat.service';
import { OutsideSalesNavbarComponent } from './components/templates/outside-sales-navbar/outside-sales-navbar.component';
import { InsideSalesNavbarComponent } from './components/templates/inside-sales-navbar/inside-sales-navbar.component'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

@NgModule({
  declarations: [AppComponent, LoginComponent, AdminLoginComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule,

    ToastrModule.forRoot({
      timeOut: 3000,
    }),
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [authInterceptorProviders, CurrencyPipe, ChatService],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
