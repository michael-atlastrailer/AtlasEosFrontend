import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AdminRoutingModule } from './admin-routing.module'
import { AdminComponent } from './admin.component'
import { AdminNavbarComponent } from '../templates/admin-navbar/admin-navbar.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { AddDealersComponent } from './add-dealers/add-dealers.component'
import { AddVendorsComponent } from './add-vendors/add-vendors.component'
import { AddBranchComponent } from './add-branch/add-branch.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { VendorOrderFormComponent } from './vendor-order-form/vendor-order-form.component'
import { PriceOverrideComponent } from './price-override/price-override.component'
import { DealerSummaryComponent } from './dealer-summary/dealer-summary.component'
import { MyMessagesComponent } from './my-messages/my-messages.component'
import { ResolveProblemComponent } from './resolve-problem/resolve-problem.component'
import { FaqComponent } from './faq/faq.component'
import { VeiwReportComponent } from './veiw-report/veiw-report.component'
import { RespondReportComponent } from './respond-report/respond-report.component'
import { AllVendorsComponent } from './all-vendors/all-vendors.component'
import { MatTableModule } from '@angular/material/table'
import { AddVendorUsersComponent } from './add-vendor-users/add-vendor-users.component'
import { AddAdminComponent } from './add-admin/add-admin.component'
import { AllVendorUsersComponent } from './all-vendor-users/all-vendor-users.component'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatPaginatorModule } from '@angular/material/paginator'
import { EditVendorUserComponent } from './edit-vendor-user/edit-vendor-user.component'
import { AllDealerUsersComponent } from './all-dealer-users/all-dealer-users.component'
import { EditDealerUsersComponent } from './edit-dealer-users/edit-dealer-users.component'
import { AllProductsComponent } from './all-products/all-products.component'
import { EditProductComponent } from './edit-product/edit-product.component'
import { EditProductPriceComponent } from './edit-product-price/edit-product-price.component'
import { AddProductComponent } from './add-product/add-product.component'
import { AddSeminarComponent } from './add-seminar/add-seminar.component'
import { AllSeminarsComponent } from './all-seminars/all-seminars.component'
import { AllAdminComponent } from './all-admin/all-admin.component'
import { AllFaqComponent } from './all-faq/all-faq.component'
import { EditFaqComponent } from './edit-faq/edit-faq.component'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core'
import { MatTimepickerModule } from 'mat-timepicker';
import { SetCountdownComponent } from './set-countdown/set-countdown.component';
import { AddPromotionalFlyerComponent } from './add-promotional-flyer/add-promotional-flyer.component';
import { AllPromotionalFlyerComponent } from './all-promotional-flyer/all-promotional-flyer.component';
import { EditSeminarComponent } from './edit-seminar/edit-seminar.component';
import { EditPromotionalFlierComponent } from './edit-promotional-flier/edit-promotional-flier.component';
import { AtlasNotesComponent } from './atlas-notes/atlas-notes.component';
import { VendorNotesComponent } from './vendor-notes/vendor-notes.component';
import { PriceOverrideReportComponent } from './price-override-report/price-override-report.component';
import { SpecialOrdersComponent } from './special-orders/special-orders.component'

@NgModule({
  declarations: [
    AdminComponent,
    AdminNavbarComponent,
    DashboardComponent,
    AddDealersComponent,
    AddVendorsComponent,
    AddBranchComponent,
    VendorOrderFormComponent,
    PriceOverrideComponent,
    DealerSummaryComponent,
    MyMessagesComponent,
    ResolveProblemComponent,
    FaqComponent,
    VeiwReportComponent,
    RespondReportComponent,
    AllVendorsComponent,
    AddVendorUsersComponent,
    AddAdminComponent,
    AllVendorUsersComponent,
    EditVendorUserComponent,
    AllDealerUsersComponent,
    EditDealerUsersComponent,
    AllProductsComponent,
    EditProductComponent,
    EditProductPriceComponent,
    AddProductComponent,
    AddSeminarComponent,
    AllSeminarsComponent,
    AllAdminComponent,
    AllFaqComponent,
    EditFaqComponent,
    SetCountdownComponent,
    AddPromotionalFlyerComponent,
    AllPromotionalFlyerComponent,
    EditSeminarComponent,
    EditPromotionalFlierComponent,
    AtlasNotesComponent,
    VendorNotesComponent,
    PriceOverrideReportComponent,
    SpecialOrdersComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTimepickerModule,
  ],
  exports: [],
})
export class AdminModule {}
