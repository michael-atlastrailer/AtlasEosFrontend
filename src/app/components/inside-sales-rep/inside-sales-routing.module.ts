import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DashboardComponent } from './dashboard/dashboard.component';
import { DealerSummaryComponent } from './dealer-summary/dealer-summary.component';
import { DetailedSummaryComponent } from './detailed-summary/detailed-summary.component';
import { MyMessagesComponent } from './my-messages/my-messages.component';
import { InsideSalesComponent } from './inside-sales.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  {
    path: '',
    component: InsideSalesComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'vendor-form',
        component: DealerSummaryComponent,
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
export class InsideSalesRoutingModule {}
