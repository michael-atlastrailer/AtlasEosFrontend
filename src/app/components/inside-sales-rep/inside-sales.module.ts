import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'



import {  InsideSalesRoutingModule} from './inside-sales-routing.module'
import {  InsideSalesComponent } from './inside-sales.component'


import { MatPaginatorModule } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table'
import { DashboardComponent } from './dashboard/dashboard.component'
import { DealerSummaryComponent } from './dealer-summary/dealer-summary.component'
import { MyMessagesComponent } from './my-messages/my-messages.component'
import { DetailedSummaryComponent } from './detailed-summary/detailed-summary.component'
import { InsideSalesNavbarComponent } from '../templates/inside-sales-navbar/inside-sales-navbar.component'

@NgModule({
  declarations: [
    InsideSalesComponent,
    DashboardComponent,
    InsideSalesNavbarComponent,
    DealerSummaryComponent,
    MyMessagesComponent,
    DetailedSummaryComponent,
  ],
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    InsideSalesRoutingModule,
  ],
})
export class InsideSalesModule {}
