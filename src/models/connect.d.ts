import { MenuDataItem, Settings as ProSettings } from '../pro-layout';
import { GlobalModelState } from './global';
import { UserModelState } from './user';
import { CustomerModelState } from './cust';
import { SendMessageModelState } from './sendMessage';
import { StateType } from './login';

export { GlobalModelState, UserModelState, CustomerModelState };

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    cust?: boolean;
    login?: boolean;
  };
}

export interface ConnectState {
  global: GlobalModelState;
  loading: Loading;
  settings: ProSettings;
  user: UserModelState;
  cust: CustomerModelState;
  login: StateType;
  message: SendMessageModelState;  
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}
