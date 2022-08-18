import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DashboardComponent } from './dashboard/dashboard.component';
import { DealerSummaryComponent } from './dealer-summary/dealer-summary.component';
import { DetailedSummaryComponent } from './detailed-summary/detailed-summary.component';
import { MyMessagesComponent } from './my-messages/my-messages.component';
import { OutsideSalesComponent } from './outside-sales.component'
import { VendorOrderFormComponent } from './vendor-order-form/vendor-order-form.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  {
    path: '',
    component: OutsideSalesComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'dealer-summary',
        component: DealerSummaryComponent,
      },
      {
        path: 'detail-dealer-summary',
        component: DetailedSummaryComponent,
      },
      {
        path: 'detail-dealer-summary/:account_id',
        component: DetailedSummaryComponent,
      },
      {
        path: 'vendor-form',
        component: VendorOrderFormComponent,
      },
      {
        path: 'my-messages',
        component: MyMessagesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OutsideSalesRoutingModule {}
