import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import your library

// Project specific imports
import { BasicUsageComponent } from './page/basic-usage/basic-usage.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { ValidationWarningModule } from './validatorWarning/index';
import { AngularMessagesModule } from './angular-messages/angular-messages.module';
@NgModule({
  declarations: [
    AppComponent,
    BasicUsageComponent,
  ],
  exports: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMessagesModule.forRoot(),
    AlternativeValidationModule.forRoot(),
    CoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
