declare module 'class-validator' {
  export interface ValidationOptions {
    validationError?: {
      target?: boolean;
      value?: boolean;
    };
  }
  export function IsOptional(validationOptions?: ValidationOptions): PropertyDecorator;
  export function IsInt(validationOptions?: ValidationOptions): PropertyDecorator;
  export function Min(min: number, validationOptions?: ValidationOptions): PropertyDecorator;
  export function Max(max: number, validationOptions?: ValidationOptions): PropertyDecorator;
  export function IsString(validationOptions?: ValidationOptions): PropertyDecorator;
  export function IsEnum<T>(entity: T, validationOptions?: ValidationOptions): PropertyDecorator;
  export function IsEmail(validationOptions?: ValidationOptions): PropertyDecorator;
  export function MinLength(min: number, validationOptions?: ValidationOptions): PropertyDecorator;
  export function MaxLength(max: number, validationOptions?: ValidationOptions): PropertyDecorator;
  export function Matches(pattern: RegExp, message?: string, validationOptions?: ValidationOptions): PropertyDecorator;
}