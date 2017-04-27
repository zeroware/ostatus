// @flow

class OstatusError extends Error {
  constructor(...args: *) {
    super(...args);
    Error.captureStackTrace(this, OstatusError);
  }
}

export default OstatusError;
