import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuardGuard } from 'src/app/core/guard/auth-guard.guard'
import { AddAdminComponent } from './add-admin/add-admin.component'
import { AddDealersComponent } from './add-dealers/add-dealers.component'
import { AddProductComponent } from './add-product/add-product.component'
import { AddPromotionalFlyerComponent } from './add-promotional-flyer/add-promotional-flyer.component'
import { AddSeminarComponent } from './add-seminar/add-seminar.component'
import { AddVendorUsersComponent } from './add-vendor-users/add-vendor-users.component'
import { AddVendorsComponent } from './add-vendors/add-vendors.component'
import { AdminComponent } from './admin.component'
import { AllAdminComponent } from './all-admin/all-admin.component'
import { AllDealerUsersComponent } from './all-dealer-users/all-dealer-users.component'
import { AllFaqComponent } from './all-faq/all-faq.component'
import { AllProductsComponent } from './all-products/all-products.component'
import { AllPromotionalFlyerComponent } from './all-promotional-flyer/all-promotional-flyer.component'
import { AllSeminarsComponent } from './all-seminars/all-seminars.component'
import { AllVendorUsersComponent } from './all-vendor-users/all-vendor-users.component'
import { AllVendorsComponent } from './all-vendors/all-vendors.component'
import { AtlasNotesComponent } from './atlas-notes/atlas-notes.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { DealerSummaryComponent } from './dealer-summary/dealer-summary.component'
import { EditDealerUsersComponent } from './edit-dealer-users/edit-dealer-users.component'
import { EditFaqComponent } from './edit-faq/edit-faq.component'
import { EditProductComponent } from './edit-product/edit-product.component'
import { EditPromotionalFlierComponent } from './edit-promotional-flier/edit-promotional-flier.component'
import { EditSeminarComponent } from './edit-seminar/edit-seminar.component'
import { EditVendorUserComponent } from './edit-vendor-user/edit-vendor-user.component'
import { FaqComponent } from './faq/faq.component'
import { MyMessagesComponent } from './my-messages/my-messages.component'
import { PriceOverrideReportComponent } from './price-override-report/price-override-report.component'
import { PriceOverrideComponent } from './price-override/price-override.component'
import { ResolveProblemComponent } from './resolve-problem/resolve-problem.component'
import { RespondReportComponent } from './respond-report/respond-report.component'
import { SetCountdownComponent } from './set-countdown/set-countdown.component'
import { SpecialOrdersComponent } from './special-orders/special-orders.component'
import { VeiwReportComponent } from './veiw-report/veiw-report.component'
import { VendorNotesComponent } from './vendor-notes/vendor-notes.component'
import { VendorOrderFormComponent } from './vendor-order-form/vendor-order-form.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'add-dealer',
        component: AddDealersComponent,
      },
      {
        path: 'vendor-order-form',
        component: VendorOrderFormComponent,
      },
      {
        path: 'price-override',
        component: PriceOverrideComponent,
      },
      {
        path: 'dealer-summary',
        component: DealerSummaryComponent,
      },
      {
        path: 'my-messages',
        component: MyMessagesComponent,
      },
      {
        path: 'resolve-problem',
        component: ResolveProblemComponent,
      },
      {
        path: 'view-report/:ticket',
        component: VeiwReportComponent,
      },
      {
        path: 'respond-report/:ticket',
        component: RespondReportComponent,
      },
      {
        path: 'faq',
        component: FaqComponent,
      },
      {
        path: 'all-faq',
        component: AllFaqComponent,
      },
      {
        path: 'edit-faq/:id',
        component: EditFaqComponent,
      },
      {
        path: 'all-vendors',
        component: AllVendorsComponent,
      },
      {
        path: 'add-vendor',
        component: AddVendorsComponent,
      },
      {
        path: 'add-vendor-users',
        component: AddVendorUsersComponent,
      },
      {
        path: 'add-admin',
        component: AddAdminComponent,
      },
      {
        path: 'all-admin',
        component: AllAdminComponent,
      },
      {
        path: 'all-vendor-users',
        component: AllVendorUsersComponent,
      },
      {
        path: 'edit-vendor-user/:user',
        component: EditVendorUserComponent,
      },
      {
        path: 'edit-dealer-user/:user',
        component: EditDealerUsersComponent,
      },
      {
        path: 'all-dealer-users',
        component: AllDealerUsersComponent,
      },
      {
        path: 'all-products',
        component: AllProductsComponent,
      },
      {
        path: 'edit-product/:id',
        component: EditProductComponent,
      },
      {
        path: 'edit-product',
        component: EditProductComponent,
      },
      {
        path: 'add-product',
        component: AddProductComponent,
      },
      {
        path: 'add-seminars',
        component: AddSeminarComponent,
      },
      {
        path: 'all-seminars',
        component: AllSeminarsComponent,
      },

      {
        path: 'set-countdown',
        component: SetCountdownComponent,
      },
      {
        path: 'add-promtional-flyer',
        component: AddPromotionalFlyerComponent,
      },
      {
        path: 'all-promotional-flyer',
        component: AllPromotionalFlyerComponent,
      },
      {
        path: 'edit-seminar/:id',
        component: EditSeminarComponent,
      },
      {
        path: 'edit-promotional-flier/:id',
        component: EditPromotionalFlierComponent,
      },
      {
        path: 'atlas-note',
        component: AtlasNotesComponent,
      },
      {
        path: 'vendor-note',
        component: VendorNotesComponent,
      },
      {
        path: 'price-overide-report',
        component: PriceOverrideReportComponent,
      },
      {
        path: 'special-order',
        component: SpecialOrdersComponent,
      },
    ],
    canActivate: [AuthGuardGuard],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
