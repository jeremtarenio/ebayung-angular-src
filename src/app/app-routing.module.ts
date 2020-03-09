import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { ProductListComponent } from './product-list/product-list.component';
import { SingleProductComponent } from './single-product/single-product.component';
import { AdminComponent } from './admin/admin.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { ProductsComponent } from './admin/products/products.component';
import { ProductEditComponent } from './admin/products/product-edit/product-edit.component';
import { AdminProductListComponent } from './admin/products/admin-product-list/admin-product-list.component';
import { AccountComponent } from './account/account.component';
import { AccountHomeComponent } from './account/account-home/account-home.component';
import { RegisterComponent } from './account/register/register.component';
import { LoginComponent } from './account/login/login.component';
import { AuthGuard } from './account/auth.guard';
import { UserLoggedInGuard } from './account/user-logged-in.guard';
import { CheckoutComponent } from './checkout/checkout.component';
import { CheckoutGuard } from './checkout/checkout.guard';
import { DashboardComponent } from './account/account-home/dashboard/dashboard.component';
import { OrdersComponent } from './account/account-home/orders/orders.component';
import { ProfileComponent } from './account/account-home/profile/profile.component';
import { ChangePasswordComponent } from './account/account-home/change-password/change-password.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AdminGuard } from './admin/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent
  },
  {
    path: 'products/category',
    children: [
      {
        path: ':category',
        component: ProductListComponent
      }
    ]
  },
  {
    path: 'products',
    children: [
      {
        path: ':id',
        component: SingleProductComponent
      }
      ,
      {
        path: '',
        component: ProductListComponent
      }
    ]
  },
  {
    path: 'checkout',
    children: [
      {
        path: '',
        component: CheckoutComponent,
        canActivate: [AuthGuard, CheckoutGuard]
      }
    ]
  },
  {
    path: 'search',
    children: [
      {
        path: '',
        component: ProductListComponent
      }
    ]
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: AdminHomeComponent,
        canActivate: [AuthGuard, AdminGuard],
        children: [
          {
            path: '',
            redirectTo: 'products/list',
            pathMatch: 'full'
          },
          {
            path: 'products/list',
            component: AdminProductListComponent,
          },
          {
            path: 'products/edit',
            component: ProductEditComponent
          }
        ]
      }
    ]
  },
  {
    path: 'account',
    component: AccountComponent,
    children: [
      {
        path: '',
        component: AccountHomeComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          },
          {
            path: 'dashboard',
            component: DashboardComponent
          },
          {
            path: 'orders',
            component: OrdersComponent
          },
          {
            path: 'profile',
            component: ProfileComponent
          },
          {
            path: 'profile/change-password',
            component: ChangePasswordComponent
          }
        ]
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [UserLoggedInGuard]
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [UserLoggedInGuard]
      }
    ]
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'disabled'})],
  exports: [RouterModule],
  providers: [AuthGuard, UserLoggedInGuard, CheckoutGuard, AdminGuard]
})
export class AppRoutingModule { }
