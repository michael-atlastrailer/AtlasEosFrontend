import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { BranchNavbarComponent } from '../templates/branch-navbar/branch-navbar.component'

import { BranchRoutingModule } from './branch-routing.module'
import { BranchComponent } from './branch.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { DealerSummaryComponent } from './dealer-summary/dealer-summary.component'
import { MyMessagesComponent } from './my-messages/my-messages.component'
import { DetailedSummaryComponent } from './detailed-summary/detailed-summary.component'

import { MatPaginatorModule } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { VendorOrderFormComponent } from './vendor-order-form/vendor-order-form.component'

@NgModule({
  declarations: [
    BranchComponent,
    DashboardComponent,
    BranchNavbarComponent,
    DealerSummaryComponent,
    MyMessagesComponent,
    DetailedSummaryComponent,
    VendorOrderFormComponent,
  ],
  imports: [
    CommonModule, MatFormFieldModule,MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    BranchRoutingModule,
  ],
})
export class BranchModule {}
