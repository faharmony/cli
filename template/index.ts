/**
 * MODULE
 * ------
 * This is the module configuration
 * -- Change required here --
 *
 * @author Siddhant Gupta <siddhant@fasolutions.com>
 * @copyright FA Solutions Oy
 */

import { IModuleProps } from "@faharmony/module";
import { FALogoIconDefinition } from "@faharmony/icons";
import { MainPage } from "./pages";
import { ModuleState } from "./state";
// import { appRoles } from "../../config";

/** Should match the Module folder name
 *  This ID is used for defining web URL.
 * It should be all lowercase letters
 * without spaces or special characters */
const ModuleID: string = `{{ moduleId }}`;

/** Fallback Module label.
 * Actual label is taken from locale files (key: moduleName) */
const ModuleLabelFallback: string = `{{ properCase moduleId  }}`;

/** Define page component to load when Module is accessed
 * @default MainPage */
const ModuleComponent: IModuleProps["component"] = MainPage;

/** List of roles to restrict access.
 * Use appRoles object defined in App configuration
 * to access roles available in app.
 * @default [] empty array for unrestricted access. */
const ModuleRoles: IModuleProps["roles"] = [];

/** Icon of the Module. Visible in AppMenu. */
const ModuleIcon: IModuleProps["icon"] = FALogoIconDefinition;

/** Sub-modules of the module. Visible in Menu
 * Empty array means no subModules. */
const subModules: IModuleProps["subModules"] = [
  {
    id: "subModule", // Locale key of same ID will be used for label translation
    label: `SubModule`, // Fallback label for subModule
    component: MainPage, // Page component to load when subModule is accessed
  },
];

/**
 * MODULE CONFIG
 * ━━━━━━━━━━━━━
 * DO NOT CHANGE
 */
export default {
  id: ModuleID,
  component: ModuleComponent,
  label: ModuleLabelFallback,
  roles: ModuleRoles,
  icon: ModuleIcon,
  state: ModuleState,
  subModules,
} as IModuleProps;
export { ModuleID };
