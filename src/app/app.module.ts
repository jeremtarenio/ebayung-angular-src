import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './header/main/main.component';
import { CategoriesComponent } from './header/categories/categories.component';
import { BannerComponent } from './homepage/banner/banner.component';
import { HeaderMobileComponent } from './header-mobile/header-mobile.component';
import { HowItWorksComponent } from './homepage/how-it-works/how-it-works.component';
import { FeatureOneComponent } from './homepage/feature-one/feature-one.component';
import { FeatureTwoComponent } from './homepage/feature-two/feature-two.component';
import { ReviewsComponent } from './homepage/reviews/reviews.component';
import { ClosingFeatureComponent } from './homepage/closing-feature/closing-feature.component';
import { FooterComponent } from './footer/footer.component';
import { BannerV2Component } from './homepage/banner-v2/banner-v2.component';
import { TncsComponent } from './homepage/tncs/tncs.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ProductListComponent } from './product-list/product-list.component';
import { SubcategoryPageComponent } from './product-list/subcategory-page/subcategory-page.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FilterByMobileComponent } from './product-list/filter-by-mobile/filter-by-mobile.component';
import { DarkenerComponent } from './shared/darkener/darkener.component';
import { FilterByComponent } from './product-list/filter-by/filter-by.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { ProductImageComponent } from './product-list/product-image/product-image.component';
import { SingleProductComponent } from './single-product/single-product.component';
import { AdminComponent } from './admin/admin.component';
import { ProductsComponent } from './admin/products/products.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { ProductEditComponent } from './admin/products/product-edit/product-edit.component';
import { AdminProductListComponent } from './admin/products/admin-product-list/admin-product-list.component';
import { AccountComponent } from './account/account.component';
import { RegisterComponent } from './account/register/register.component';
import { AccountHomeComponent } from './account/account-home/account-home.component';
import { LoginComponent } from './account/login/login.component';
import { AuthInterceptor } from './account/auth-interceptor';
import { CartComponent } from './cart/cart.component';
import { PageLoadingSpinnerComponent } from './shared/page-loading-spinner/page-loading-spinner.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { DashboardComponent } from './account/account-home/dashboard/dashboard.component';
import { OrdersComponent } from './account/account-home/orders/orders.component';
import { ProfileComponent } from './account/account-home/profile/profile.component';
import { ChangePasswordComponent } from './account/account-home/change-password/change-password.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    CategoriesComponent,
    BannerComponent,
    HeaderMobileComponent,
    HowItWorksComponent,
    FeatureOneComponent,
    FeatureTwoComponent,
    ReviewsComponent,
    ClosingFeatureComponent,
    FooterComponent,
    BannerV2Component,
    TncsComponent,
    HomepageComponent,
    ProductListComponent,
    SubcategoryPageComponent,
    FilterByMobileComponent,
    DarkenerComponent,
    FilterByComponent,
    LoadingSpinnerComponent,
    ProductImageComponent,
    SingleProductComponent,
    AdminComponent,
    ProductsComponent,
    AdminHomeComponent,
    ProductEditComponent,
    AdminProductListComponent,
    AccountComponent,
    RegisterComponent,
    AccountHomeComponent,
    LoginComponent,
    CartComponent,
    PageLoadingSpinnerComponent,
    CheckoutComponent,
    DashboardComponent,
    OrdersComponent,
    ProfileComponent,
    ChangePasswordComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
