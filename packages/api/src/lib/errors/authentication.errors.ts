// tslint:disable variable-name
import { ForbiddenError } from 'apollo-server-core';

import { ErrorBadRequest, ErrorUnauthorized } from './general.errors';

export class ErrorAuthUnauthenticated extends ErrorUnauthorized {
  constructor() {
    super('You need to be authenticated');
  }
}
export class ErrorAuthInvalidDetails extends ErrorBadRequest {
  constructor() {
    super('Incorrect login details');
  }
}
export class ErrorAuthEmailNotVerified extends ErrorBadRequest {
  constructor() {
    super('Email is not verified');
  }
}
export class ErrorAuthInvalidToken extends ErrorUnauthorized {
  constructor() {
    super('Invalid access token');
  }
}
export class ErrorAuthInvalidAuthorizationHeader extends ErrorBadRequest {
  constructor() {
    super('Invalid Authorization header');
  }
}
export class ErrorAuthNoAccess extends ForbiddenError {
  constructor(resource: string) {
    super(`You do not have access to this ${resource.toLowerCase()}`);
  }
}
export class ErrorAuthPasswordMismatch extends ErrorBadRequest {
  constructor() {
    super('Passwords do not match');
  }
}
