import { CONFIG_BASE } from './base';
import { API_CONFIG } from './types';

/*******************************************************************************
 *
 *              ! DO NOT PUT ANYTHING SECURE IN THESE FILES !
 *
 ******************************************************************************/


export const CONFIG_PRODUCTION: API_CONFIG = {
  ...CONFIG_BASE as API_CONFIG,
  corsAllowFrom: [/\.synthia\.app$/],
  clientHost: 'https://synthia.app',
};
