import { format, Logform, transport, transports } from 'winston';
import { ENV_CONFIG } from './env';

/**
 * Where and how the log are exported
 * Details: https://github.com/winstonjs/winston#transports
 */
export const winstonTransports: transport[] = [
  // new transports.File({ filename: 'error.log', level: 'error' }),
  // new transports.File({ filename: 'combined.log' }),
  new transports.Console({
    stderrLevels: ['error'],
    consoleWarnLevels: ['warn'],
  }),
];

/**
 * Config the logging format
 * Details: https://github.com/winstonjs/winston#formats
 */
export const winstonFormat: Logform.Format[] = [
  format.timestamp({ format: 'isoDateTime' }),
  format.json(),
];

ENV_CONFIG().IS_LOG_INLINE
  ? undefined
  : winstonFormat.push(format.prettyPrint({ colorize: true }));
