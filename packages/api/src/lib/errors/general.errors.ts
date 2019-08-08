// tslint:disable variable-name
import { ApolloError } from 'apollo-server-core';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, UNAUTHORIZED, NOT_FOUND } from 'http-status';

export class ErrorGeneral extends ApolloError {
  constructor(error: string = 'An unknown error occurred') {
    super(error, INTERNAL_SERVER_ERROR.toString());
  }
}

export class ErrorBadRequest extends ApolloError {
  constructor(error: string) {
    super(error, BAD_REQUEST.toString());
  }
}

export class ErrorUnauthorized extends ApolloError {
  constructor(error: string = 'You are not authorized for this action') {
    super(error, UNAUTHORIZED.toString());
  }
}

export class ErrorNotFound extends ApolloError {
  constructor(error: string = 'Resource not found') {
    super(error, NOT_FOUND.toString());
  }
}
