import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AdminLoginComponent } from './components/admin-login/admin-login.component'
import { LoginComponent } from './components/login/login.component'

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'admin/login',
    component: AdminLoginComponent,
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./components/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'dealers',
    loadChildren: () =>
      import('./components/dealers/dealers.module').then(
        (m) => m.DealersModule,
      ),
  },
  {
    path: 'vendors',
    loadChildren: () =>
      import('./components/vendors/vendors.module').then(
        (m) => m.VendorsModule,
      ),
  },
  {
    path: 'branch',
    loadChildren: () =>
      import('./components/branch/branch.module').then((m) => m.BranchModule),
  },
  {
    path: 'seminar',
    loadChildren: () =>
      import('./components/seminar/seminar.module').then(
        (m) => m.SeminarModule,
      ),
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
