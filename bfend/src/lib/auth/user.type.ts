import { ACLType } from './acl.service';

export interface User {
  name?: string;
  avatar?: string;
  phone?: string;
  acl?: ACLType;

  [key: string]: any;
}
