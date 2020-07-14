export interface IPackage {
  name: string;
  types?: string[];
}

export interface IParam {
  param: string[];
  description: string;
  exec: () => Promise<void>;
  values?: string[];
  usage?: string;
}

export interface IParams {
  [type: string]: IParam;
}

export interface IMessages {
  init?: string;
  success?: string;
  error?: string;
}

export interface IInstallOptions {
  pkg: IPackage;
  version: string;
  options?: string;
  messages?: IMessages;
}

export interface IInstallPackagesOptions {
  packageNames?: string[];
  version?: string;
}

export interface IPackageInfo {
  name: string;
  version: string;
  tag: string;
}
