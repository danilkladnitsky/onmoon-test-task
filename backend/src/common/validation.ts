import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsOdd', async: false })
export class IsOdd implements ValidatorConstraintInterface {
  validate(value: number): boolean {
    return value % 2 !== 0;
  }

  defaultMessage(): string {
    return 'Value must be odd';
  }
}
