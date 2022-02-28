import { format, Logform, transport, transports } from 'winston';

export const winstonTransports: transport[] = [
  new transports.Console({
    stderrLevels: ['error'],
    consoleWarnLevels: ['warn'],
  }),
];

export const winstonFormat: Logform.Format[] = [
  format.timestamp({ format: 'isoDateTime' }),
  format.json(),
];
