import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { VendorsRoutingModule } from './vendors-routing.module'
import { VendorsComponent } from './vendors.component'
import { VendorNavbarComponent } from '../templates/vendor-navbar/vendor-navbar.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { SpecialOrdersComponent } from './special-orders/special-orders.component'
import { HelpSectionComponent } from './help-section/help-section.component'
import { SalesDetailedComponent } from './sales-detailed/sales-detailed.component'
import { SalesSummaryComponent } from './sales-summary/sales-summary.component'
import { PurchasesDealerComponent } from './purchases-dealer/purchases-dealer.component'
import { VendorOrderComponent } from './vendor-order/vendor-order.component'
import { ReportProblemComponent } from './report-problem/report-problem.component'
import { MessagesComponent } from './messages/messages.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table'
import { MatSortModule } from '@angular/material/sort'
import { AllReportTicketsComponent } from './all-report-tickets/all-report-tickets.component'
import { ViewReportTicketComponent } from './view-report-ticket/view-report-ticket.component'
import { SwitchDealerComponent } from './switch-dealer/switch-dealer.component'
import { ViewDealerSummaryComponent } from './view-dealer-summary/view-dealer-summary.component'

import { MatMenuModule } from '@angular/material/menu'

@NgModule({
  declarations: [
    VendorsComponent,
    VendorNavbarComponent,
    DashboardComponent,
    SpecialOrdersComponent,
    HelpSectionComponent,
    SalesDetailedComponent,
    SalesSummaryComponent,
    PurchasesDealerComponent,
    VendorOrderComponent,
    ReportProblemComponent,
    MessagesComponent,
    AllReportTicketsComponent,
    ViewReportTicketComponent,
    SwitchDealerComponent,
    ViewDealerSummaryComponent,
  ],
  imports: [
    CommonModule,
    VendorsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatMenuModule,
  ],
})
export class VendorsModule {}
