import {enableProdMode} from '@angular/core'
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic'
import {AlternativeValidationModule} from './index'

enableProdMode();
platformBrowserDynamic().bootstrapModule(AlternativeValidationModule);
