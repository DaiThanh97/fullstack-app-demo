import { Transform } from 'class-transformer';

export function ToNumber(): PropertyDecorator {
  return Transform(({ value }) => (value ? +value : value));
}
