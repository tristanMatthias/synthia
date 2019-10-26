// tslint:disable variable-name
import {
  AccessDeniedError,
  ConnectionError,
  ConnectionRefusedError,
  ConnectionTimedOutError,
  DatabaseError,
  EmptyResultError,
  ExclusionConstraintError,
  ForeignKeyConstraintError,
  HostNotFoundError,
  HostNotReachableError,
  InvalidConnectionError,
  OptimisticLockError,
  SequelizeScopeError,
  TimeoutError,
  UniqueConstraintError,
  ValidationError,
} from 'sequelize';

import { ErrorGeneral, ErrorResourceNotFound, ErrorResourceUnique } from '.';
import { db } from '../../database/database';
import { logger } from '../../lib/logger';


type SequelizeError =
  SequelizeScopeError |
  ValidationError |
  EmptyResultError |
  DatabaseError |
  TimeoutError |
  UniqueConstraintError |
  ForeignKeyConstraintError |
  ExclusionConstraintError |
  OptimisticLockError |
  ConnectionError |
  ConnectionRefusedError |
  AccessDeniedError |
  HostNotFoundError |
  HostNotReachableError |
  InvalidConnectionError |
  ConnectionTimedOutError;


const lookupModelByTableName = (tableName: string) =>
  Object.values(db.models).find(m => m.getTableName() === tableName);


export const handleSequelizeError = async (e: SequelizeError) => {

  switch (e.constructor) {
    case ValidationError:
      return e;

    case ForeignKeyConstraintError:
      // @ts-ignore detail does exist
      const detail = (e as UniqueConstraintError).parent.detail as string;
      const breakdown = /^Key \((.*)\)=\((.*)\) is not present in table "(.*)"\.$/.exec(detail);

      if (breakdown) {
        const [, , id, table] = breakdown;
        const model = lookupModelByTableName(table)!;
        throw new ErrorResourceNotFound(model.name, id);
      } else return new ErrorGeneral();

    case UniqueConstraintError:
      const err = (e as UniqueConstraintError).errors[0];
      // @ts-ignore
      const model = lookupModelByTableName((e as UniqueConstraintError).parent.table);
      return new ErrorResourceUnique(model!.name, err.path, err.value);

    case SequelizeScopeError:
    case EmptyResultError:
    case DatabaseError:
    case TimeoutError:
    case ExclusionConstraintError:
    case OptimisticLockError:
    case ConnectionError:
    case ConnectionRefusedError:
    case AccessDeniedError:
    case HostNotFoundError:
    case HostNotReachableError:
    case InvalidConnectionError:
    case ConnectionTimedOutError:

    default:
      console.log(e);

      logger.error(e);
      return new ErrorGeneral();
  }
};
