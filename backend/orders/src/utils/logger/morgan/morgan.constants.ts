export enum TOKEN_TYPE {
  Request,
  Response,
}

export const MORGAN_FORMAT_STRING = {
  REQUEST: `[Request] :url :remote-addr ":method  HTTP/:http-version"`,
  RESPONSE: `[Response] content-length::res[content-length] total-time-ms::total-time[3]`,
};
