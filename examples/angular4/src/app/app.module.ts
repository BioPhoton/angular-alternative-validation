import {NgModule} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {BrowserModule} from '@angular/platform-browser'
// Import your library
import {AlternativeValidationModule} from 'angular-alternative-validation'
import {AppRoutingModule} from './app-routing.module'

import {AppComponent} from './app.component'
import {CoreModule} from './core/core.module'
// Project specific imports
import {BasicUsageComponent} from './page/basic-usage/basic-usage.component'

@NgModule({
  declarations: [
    AppComponent,
    BasicUsageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AlternativeValidationModule.forRoot(),
    CoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
