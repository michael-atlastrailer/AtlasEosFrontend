import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'



import {  OutsideSalesRoutingModule} from './outside-sales-routing.module'
import {  OutsideSalesComponent } from './outside-sales.component'


import { MatPaginatorModule } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table'
import { DashboardComponent } from './dashboard/dashboard.component'
import { DealerSummaryComponent } from './dealer-summary/dealer-summary.component'
import { MyMessagesComponent } from './my-messages/my-messages.component'
import { DetailedSummaryComponent } from './detailed-summary/detailed-summary.component'
import { OutsideSalesNavbarComponent } from '../templates/outside-sales-navbar/outside-sales-navbar.component'

@NgModule({
  declarations: [
    OutsideSalesComponent,
    DashboardComponent,
    OutsideSalesNavbarComponent,
    DealerSummaryComponent,
    MyMessagesComponent,
    DetailedSummaryComponent,
  ],
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    OutsideSalesRoutingModule,
  ],
})
export class OutsideSalesModule {}
