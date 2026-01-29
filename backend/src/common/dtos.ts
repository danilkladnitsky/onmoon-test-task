import { IsNumber, IsPositive, Max, Min, Validate } from 'class-validator';
import { IsOdd } from './validation';

export class CreateSessionDto {
  @IsNumber()
  @Min(1)
  @IsPositive()
  @Validate(IsOdd)
  diamondsCount: number;

  @IsNumber()
  @Min(1)
  @IsPositive()
  @Max(6)
  size: number;
}
