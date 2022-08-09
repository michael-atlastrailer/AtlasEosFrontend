import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { BranchComponent } from './branch.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { DealerSummaryComponent } from './dealer-summary/dealer-summary.component'
import { DetailedSummaryComponent } from './detailed-summary/detailed-summary.component'
import { MyMessagesComponent } from './my-messages/my-messages.component'
import { VendorOrderFormComponent } from './vendor-order-form/vendor-order-form.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  {
    path: '',
    component: BranchComponent,
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
        path: 'my-messages',
        component: MyMessagesComponent,
      },{
        path: 'vendor-form',
        component: VendorOrderFormComponent,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BranchRoutingModule {}
