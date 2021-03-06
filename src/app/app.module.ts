import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import 'hammerjs';
import { GraficaComponent } from './grafica/grafica.component';
import { GraficaCuadComponent } from './grafica-cuad/grafica-cuad.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GraficaComponent,
    GraficaCuadComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
