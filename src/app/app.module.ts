import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OperationalHomeComponent } from './Operational_Dashboard/operational-home-component/operational-home.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatInputModule,
   MatRadioModule, MatSlideToggleModule, MatSliderModule, MatDialogModule, MatSnackBar } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
//import { DistrictMapComponentComponent } from './Operational_Dashboard/District/district-map-component/district-map-component.component';
//import { DistrictMapDetailsComponent, DistrictMapDialogComponent } from './Operational_Dashboard/District/district-map-component/district-map-details/district-map-details.component';

import { CardComponent } from './Operational_Dashboard/Cards/card/card.component';
import {MatButtonModule} from '@angular/material/button';
import { LineChartComponent } from './Operational_Dashboard/Cards/line-chart/line-chart.component';

import { StackedBarChartComponent } from './Operational_Dashboard/Charts/stacked-bar-chart/stacked-bar-chart.component';
import { DistrictMainMenuComponent } from './Operational_Dashboard/District/district-main-menu/district-main-menu.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MapComponent } from './Operational_Dashboard/Charts/map/map.component';

import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import { TalukaMainMenuComponent } from './Operational_Dashboard/District/Taluka/taluka-main-menu/taluka-main-menu.component';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';


import { MenuComponent, TabularDialog } from './Operational_Dashboard/Menu/menu/menu.component';
import { MapInfoComponent } from './Operational_Dashboard/Menu/map-info/map-info.component';
import { MultiLineChartComponent } from './Operational_Dashboard/Charts/multi-line-chart/multi-line-chart.component';
import { DistrictExpenseMainMenuComponent } from './Operational_Dashboard/District/district-expense-main-menu/district-expense-main-menu.component';
import { DistrictTrainingMainMenuComponent } from './Operational_Dashboard/District/district-training-main-menu/district-training-main-menu.component';
import { MultiLineMenuComponent } from './Operational_Dashboard/Menu/multi-line-menu/multi-line-menu.component';
import {MatTabsModule} from '@angular/material/tabs';
import { GroupedBarChartComponent } from './PA-GroupChart/grouped-bar-chart/grouped-bar-chart.component';


//Services
import { CardLineChartService } from './Operational_Dashboard/Services/line-chart.card.service';
import { PatientCountService } from './Operational_Dashboard/Services/patient-count.service';
import { PatientCountDistrictService } from './Operational_Dashboard/Services/patient-count-district.service';
import { PatientCountTalukaService } from './Operational_Dashboard/Services/patient-count-taluka.service';
import { PatientCountLineDistrictService } from './Operational_Dashboard/Services/Multi-line-Services/patient-count-line-district.service';
import { TrainingCountDistrictService } from './Operational_Dashboard/Services/training-count-district.service';
import { ExpenseCountDistrictService } from './Operational_Dashboard/Services/expense-count-district.service';
import { NavBarTopComponent } from './nav-bar-top/nav-bar-top.component';
import {GroupedBarChartService } from './PA-GroupChart/Service/grouped-bar-chart.service'
import {GroupedLineChartService } from './PA-GroupChart/Service/grouped-line-chart.service'

//Authentication 
import { JwtModule } from '@auth0/angular-jwt';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { GroupMenuComponent } from './PA-GroupChart/group-menu/group-menu.component';
import { GroupLineChartComponent } from './PA-GroupChart/group-line-chart/group-line-chart.component';
import { GroupPieChartComponent } from './PA-GroupChart/group-pie-chart/group-pie-chart.component';
import { GroupedPieChartCasesService } from './PA-GroupChart/Service/grouped-pie-chart-cases.service';
import { GroupedPieChartTainingService } from './PA-GroupChart/Service/grouped-pie-chart-training.service';
import { GroupedPieChartExpenseService } from './PA-GroupChart/Service/grouped-pie-chart-expense.service';
import { PatientCountCardService } from './Operational_Dashboard/Services/patient-count.card.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MaterialModule } from './material-module';
import { AnalyticsComponent } from './analytics/analytics.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    OperationalHomeComponent,
   // DistrictMapComponentComponent,
    //DistrictMapDetailsComponent,
    //DistrictMapDialogComponent,
    CardComponent,
    LineChartComponent,

    StackedBarChartComponent,
    DistrictMainMenuComponent,
    TalukaMainMenuComponent,
    MapComponent,
    MenuComponent,
    MapInfoComponent,
    MultiLineChartComponent,
    DistrictExpenseMainMenuComponent,
    TabularDialog,
    DistrictTrainingMainMenuComponent,
    MultiLineMenuComponent,
    NavBarTopComponent,
    LoginComponent,
    GroupedBarChartComponent,
    GroupMenuComponent,
    GroupLineChartComponent,
    GroupPieChartComponent,
    AnalyticsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // MatDatepickerModule,
    // MatFormFieldModule,
    // MatNativeDateModule,
    // MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    // MatRadioModule,
    // MatSlideToggleModule,
    // MatSliderModule,
    // MatDialogModule,
    // MatButtonModule,
    // MatButtonToggleModule,
    // MatCardModule,
    // MatExpansionModule,
    // MatSelectModule,
    // MatIconModule,
    // MatSidenavModule,
    // MatTabsModule,
    // MatSnackBar,
    MaterialModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: ['localhost:3000', 'localhost:4200', '15.207.104.52:3000'],
        blacklistedRoutes: ['localhost:3000/api/auth','15.207.104.52:3000/api/auth']
      }
    })
  ],
  entryComponents:[
   // DistrictMapDialogComponent
   //LineChartDialog
   TabularDialog
  ],
  providers: [
    PatientCountCardService,
    CardLineChartService,
    PatientCountDistrictService,
    PatientCountTalukaService,
    ExpenseCountDistrictService,
    TrainingCountDistrictService,
    PatientCountLineDistrictService,
    AuthService,
    AuthGuard,
    GroupedBarChartService,
    GroupedLineChartService,
    GroupedPieChartCasesService,
    GroupedPieChartTainingService,
    GroupedPieChartExpenseService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
