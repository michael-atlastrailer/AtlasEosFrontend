import { NgModule } from '@angular/core'
import { CommonModule, CurrencyPipe } from '@angular/common'

import { DealersRoutingModule } from './dealers-routing.module'
import { DealersComponent } from './dealers.component'
import { QuickOrderComponent } from './quick-order/quick-order.component'
import { DealerNavbarComponent } from '../templates/dealer-navbar/dealer-navbar.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { ShowOrdersComponent } from './show-orders/show-orders.component'
import { SpecialOrderComponent } from './special-order/special-order.component'
import { OrdersRemainingComponent } from './orders-remaining/orders-remaining.component'
import { EditOrderComponent } from './edit-order/edit-order.component'
import { OrderSummaryComponent } from './order-summary/order-summary.component'
import { PurchaseSummaryComponent } from './purchase-summary/purchase-summary.component'
import { FlyersComponent } from './flyers/flyers.component'
import { ProductSeminiarsComponent } from './product-seminiars/product-seminiars.component'
import { HelpComponent } from './help/help.component'
import { FormsModule } from '@angular/forms'
import { NgApexchartsModule } from 'ng-apexcharts'
import { PdfViewerModule } from 'ng2-pdf-viewer'
import { NewOrdersComponent } from './new-orders/new-orders.component'
import { ReportProblemComponent } from './report-problem/report-problem.component'
import { AllSeminarsComponent } from './seminars/all-seminars/all-seminars.component'
import { MatTableModule } from '@angular/material/table'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { OngoingSeminarsComponent } from './seminars/ongoing-seminars/ongoing-seminars.component'
import { SheduledSeminarsComponent } from './seminars/sheduled-seminars/sheduled-seminars.component'
import { SafepipePipe } from 'src/app/core/pipes/safepipe.pipe'
import { BrowserModule } from '@angular/platform-browser'
import { MessagesComponent } from './messages/messages.component'

import { PromotionalFlyerComponent } from './promotional-flyer/promotional-flyer.component'
import { SearchComponent } from './search/search.component'
import { MatSortModule } from '@angular/material/sort'

import { ViewSupportTicketComponent } from './view-support-ticket/view-support-ticket.component'
import { SupportTicketsComponent } from './support-tickets/support-tickets.component'
import { EditOrderVendorPageComponent } from './edit-order-vendor-page/edit-order-vendor-page.component'
import { TestShowOrderComponent } from './test-show-order/test-show-order.component'

import { TableRowComponent } from './table-row/table-row.component'
import { WatchedSeminarsComponent } from './seminars/watched-seminars/watched-seminars.component'

import { TestQuickOrderComponent } from './test-quick-order/test-quick-order.component'
import { DeactivateGuard } from 'src/app/core/guard/deactivate.guard'
import { MatMenuModule } from '@angular/material/menu';
import { DealerPurchaserSummaryComponent } from './dealer-purchaser-summary/dealer-purchaser-summary.component'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

@NgModule({
  declarations: [
    DealersComponent,
    QuickOrderComponent,
    DealerNavbarComponent,
    DashboardComponent,
    ShowOrdersComponent,
    SpecialOrderComponent,
    OrdersRemainingComponent,
    EditOrderComponent,
    OrderSummaryComponent,
    PurchaseSummaryComponent,
    FlyersComponent,
    ProductSeminiarsComponent,
    HelpComponent,
    NewOrdersComponent,
    ReportProblemComponent,
    AllSeminarsComponent,
    OngoingSeminarsComponent,
    SheduledSeminarsComponent,
    SafepipePipe,
    PromotionalFlyerComponent,
    SearchComponent,
    MessagesComponent,
    SupportTicketsComponent,
    ViewSupportTicketComponent,
    EditOrderVendorPageComponent,
    TestShowOrderComponent,

    TableRowComponent,
    WatchedSeminarsComponent,

    TestQuickOrderComponent,
    DealerPurchaserSummaryComponent,
  ],
  imports: [
    CommonModule,
    DealersRoutingModule,
    FormsModule,
    NgApexchartsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    PdfViewerModule,
    MatMenuModule,
  ],
  providers: [DeactivateGuard],
})
export class DealersModule {}
