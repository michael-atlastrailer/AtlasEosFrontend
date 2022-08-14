import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuardGuard } from 'src/app/core/guard/auth-guard.guard'

import { DashboardComponent } from './dashboard/dashboard.component'
import { DealersComponent } from './dealers.component'
import { EditOrderComponent } from './edit-order/edit-order.component'
import { FlyersComponent } from './flyers/flyers.component'
import { HelpComponent } from './help/help.component'
import { NewOrdersComponent } from './new-orders/new-orders.component'
import { OrderSummaryComponent } from './order-summary/order-summary.component'
import { OrdersRemainingComponent } from './orders-remaining/orders-remaining.component'
import { ProductSeminiarsComponent } from './product-seminiars/product-seminiars.component'
import { PromotionalFlyerComponent } from './promotional-flyer/promotional-flyer.component'

import { ReportProblemComponent } from './report-problem/report-problem.component'
import { SearchComponent } from './search/search.component'
import { AllSeminarsComponent } from './seminars/all-seminars/all-seminars.component'
import { OngoingSeminarsComponent } from './seminars/ongoing-seminars/ongoing-seminars.component'
import { SheduledSeminarsComponent } from './seminars/sheduled-seminars/sheduled-seminars.component'
import { ShowOrdersComponent } from './show-orders/show-orders.component'
import { SpecialOrderComponent } from './special-order/special-order.component'
import { MessagesComponent } from './messages/messages.component'
import { QuickOrderComponent } from './quick-order/quick-order.component'
import { SupportTicketsComponent } from './support-tickets/support-tickets.component'
import { ViewSupportTicketComponent } from './view-support-ticket/view-support-ticket.component'
import { EditOrderVendorPageComponent } from './edit-order-vendor-page/edit-order-vendor-page.component'
import { TestShowOrderComponent } from './test-show-order/test-show-order.component'

import { WatchedSeminarsComponent } from './seminars/watched-seminars/watched-seminars.component'

import { TestQuickOrderComponent } from './test-quick-order/test-quick-order.component'
import { DeactivateGuard } from 'src/app/core/guard/deactivate.guard'
import { PurchaseSummaryComponent } from './purchase-summary/purchase-summary.component'
import { DealerPurchaserSummaryComponent } from './dealer-purchaser-summary/dealer-purchaser-summary.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  {
    path: '',
    component: DealersComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'quick-order',
        component: TestQuickOrderComponent,
      },
      {
        path: 'flyer',
        component: FlyersComponent,
      },
      {
        path: 'help',
        component: HelpComponent,
      },
      {
        path: 'order-summary',
        component: OrderSummaryComponent,
      },
      {
        path: 'orders-remaining',
        component: OrdersRemainingComponent,
      },
      {
        path: 'product-seminars',
        component: ProductSeminiarsComponent,
      },
      {
        path: 'purchase-summary',
        component: PurchaseSummaryComponent,
      },
      {
        path: 'purchase-summary/:uid/:vendorId',
        component: DealerPurchaserSummaryComponent,
      },
      {
        path: 'show-orders/:vendorId/:atlasId',
        component: TestShowOrderComponent,
        canDeactivate: [DeactivateGuard],
      },
      {
        path: 'edit-order/:vendorId',
        component: EditOrderVendorPageComponent,
        canDeactivate: [DeactivateGuard],
      },

      {
        path: 'show-orders',
        component: TestShowOrderComponent,
        canDeactivate: [DeactivateGuard],
      },

      {
        path: 'special-order',
        component: SpecialOrderComponent,
      },
      {
        path: 'new-product',
        component: NewOrdersComponent,
      },
      {
        path: 'edit-order',
        component: EditOrderComponent,
      },
      {
        path: 'support',
        component: ReportProblemComponent,
      },
      {
        path: 'tickets',
        component: SupportTicketsComponent,
      },
      {
        path: 'view-tickets/:ticket',
        component: ViewSupportTicketComponent,
      },
      {
        path: 'all-seminars',
        component: AllSeminarsComponent,
      },
      {
        path: 'ongoing-seminars',
        component: OngoingSeminarsComponent,
      },
      {
        path: 'sheduled-seminars',
        component: SheduledSeminarsComponent,
      },
      {
        path: 'watched-seminars',
        component: WatchedSeminarsComponent,
      },
      {
        path: 'promotional-flyers',
        component: PromotionalFlyerComponent,
      },
      {
        path: 'report-problem',
        component: ReportProblemComponent,
      },
      {
        path: 'search/:search',
        component: SearchComponent,
      },
      {
        path: 'messages',
        component: MessagesComponent,
      },
      {
        path: 'test-show-order',
        component: TestShowOrderComponent,
        canDeactivate: [DeactivateGuard],
      },
      {
        path: 'test-quick-order',
        component: TestQuickOrderComponent,
      },
    ],
    canActivate: [AuthGuardGuard],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DealersRoutingModule {}
