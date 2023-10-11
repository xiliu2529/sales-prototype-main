export interface Customer{
  cstmrCd:string;
  cstmrNmDft:string;
  countOrgCd:string;
  orgNmDft:string;
}

export interface TagType {
  key: string;
  label: string;
}

export interface GeographicItemType {
  name: string;
  id: string;
}

export interface GeographicType {
  province: GeographicItemType;
  city: GeographicItemType;
}

export interface NoticeType {
  id: string;
  title: string;
  logo: string;
  description: string;
  updatedAt: string;
  member: string;
  href: string;
  memberLink: string;
}

export interface CurrentUser {
/*  name: string;
  avatar: string;
  userid: string;
  notice: NoticeType[];
  email: string;
  signature: string;
  title: string;
  group: string;
  tags: TagType[];
  notifyCount: number;
  unreadCount: number;
  country: string;
  geographic: GeographicType;
  address: string;
  phone: string; */

   name:string;
   company:string;
   title:string;
   depart:string;
   email:string;
   year:string;
}

export interface ChangePassModel {
  oldPassword:string,
  newPassword: string,
  confirmPassword: string,
  email:string,
  dispYear:string;
  loginUserCd:string,
}
