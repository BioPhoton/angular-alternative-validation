import {NgModule} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {BrowserModule} from '@angular/platform-browser'
import {AppRoutingModule} from './app-routing.module'

// Import your library
import {AlternativeValidationModule} from 'angular-alternative-validation'

// Project specific imports
import {CoreModule} from './core/core.module'
import {AppComponent} from './app.component'
import {BasicUsageComponent} from './page/basic-usage/basic-usage.component'
import {ControlStateComponent} from './page/basic-usage/control-state/control-state.component'
@NgModule({
  declarations: [
    AppComponent,
    BasicUsageComponent,
    ControlStateComponent
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
