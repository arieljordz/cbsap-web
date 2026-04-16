import { MenuItemDto } from "./MenuItemDto";

export interface MenuDto {
    label: string;
    icon: string | null;
    routerLink: string | null;
    items?: MenuItemDto[]; 
}