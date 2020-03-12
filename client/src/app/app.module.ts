import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';

import { RestService } from './service/rest.service';
import { BigvaluePipe } from './pipe/bigvalue.pipe';
import { ModalComponent } from './modal/modal.component';
import { FormsModule } from '@angular/forms';
import { TimerPipe } from './pipe/timer.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    BigvaluePipe,
    ModalComponent,
    TimerPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule, 
    BrowserAnimationsModule
  ],
  providers: [RestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
