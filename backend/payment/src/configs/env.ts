//Read .env and append env var for config service
import { plainToClass } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';
import { ToBoolean, ToNumber } from 'src/utils/transform';

enum ENVIRONMENT {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

class EnvironmentVariables {
  @IsEnum(ENVIRONMENT)
  NODE_ENV!: ENVIRONMENT;

  @IsNumber()
  @ToNumber()
  PORT!: number;

  @IsString()
  INTERNAL_KEY!: string;

  @IsString()
  SERVICE_NAME!: string;

  @IsString()
  LOG_SERVICE_NAME!: string;

  @IsString()
  LOG_LEVEL!: string;

  @IsBoolean()
  @ToBoolean()
  LOG_INLINE!: boolean;

  @IsString()
  MYSQL_HOST!: string;

  @IsString()
  MYSQL_PORT!: string;

  @IsString()
  MYSQL_USER!: string;

  @IsString()
  MYSQL_PASSWORD!: string;

  @IsString()
  MYSQL_DATABASE!: string;

  @IsString()
  REDIS_HOST!: string;

  @IsNumber()
  @ToNumber()
  REDIS_PORT!: number;

  @IsString()
  NATS_HOST!: string;
}

export function validate(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToClass(EnvironmentVariables, config);
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  const errorMessages: string[] = [];
  errors.forEach((error) => {
    for (const validation in error.constraints) {
      errorMessages.push(`${error.constraints[validation]}`);
    }
  });

  if (errorMessages.length > 0) {
    const msg = errorMessages?.join(', ');
    throw new Error(msg);
  }

  return validatedConfig;
}

export const ENV_CONFIG = () => ({
  IS_PROD: process.env.NODE_ENV === ENVIRONMENT.PRODUCTION,
});
