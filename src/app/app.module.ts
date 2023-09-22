import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BuildpageComponent } from './buildpage/buildpage.component';
import { HttpClientModule } from '@angular/common/http';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { NavComponent } from './nav/nav.component';
import { ViewComponent } from './view/view.component'

@NgModule({
  declarations: [
    AppComponent,
    BuildpageComponent,
    FrontpageComponent,
    NavComponent,
    ViewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
