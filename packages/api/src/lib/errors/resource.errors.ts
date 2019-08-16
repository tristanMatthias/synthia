// tslint:disable variable-name
import { ErrorBadRequest, ErrorNotFound } from './general.errors';

export class ErrorResourceNotFound extends ErrorNotFound {
  constructor(resourceName: string, value?: string | number, property: string = 'id') {
    super(`No ${resourceName.toLowerCase()} found${value ? ` with ${property} '${value}'` : ''}`);
  }
}

export class ErrorResourceUnique extends ErrorBadRequest {
  constructor(
    resourceName: string,
    field: string,
    value: string
  ) {
    super(`A ${resourceName.toLowerCase()} already exists with '${field}' as '${value}'`);
  }
}

export class ErrorResourceNotPublic extends ErrorBadRequest {
  constructor(
    resourceName: string
  ) {
    super(`This ${resourceName.toLowerCase()} is not public`);
  }
}
