import { IValidatorConfig } from './validator-config';
export interface IAlternativeValidationConfig {
  validator?: IValidatorConfig[];
  asyncValidator?: IValidatorConfig[];
}
