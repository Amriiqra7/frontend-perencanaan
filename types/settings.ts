export interface MenuDetail {
  group_name: string;
  icon: string;
  id: number;
  menu_name: string;
  link: string;
}

export interface SidebarIcon {
  id: number;
  namamenu: string;
  icon: string;
}
export interface MenuGroup {
  group_name: string;
  group_link: string;
  menus: MenuDetail[];
}

export interface DekstopSettings {
  idx: number;
  mundurtglbyr: number;
  headerlap1: string;
  headerlap2: string;
  alamat1: string;
  alamat2: string;
  footerkota: string;
  stricpayment: boolean;
  information: string;
  link_bacameter: string;
}
