import { IValidatorConfig } from './validator-config';
export interface IValidatorWarningConfig {
  validatorWarning?: IValidatorConfig[];
  asyncValidatorWarning?: IValidatorConfig[];
}
