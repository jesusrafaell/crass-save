"use client";
import { useLogout } from "@/hooks/auth";
import { IUser } from "@/models";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  User,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";
import { menuItems } from "./MenuItems";

const NavBar: FC<{ user: IUser }> = ({ user }) => {
  const t = useTranslations("NavBar");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { firstName, lastName, email, photo } = user;
  const { mutateAsync: logoutUserFn } = useLogout();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logoutUserFn();
  };

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent justify="center">
        <NavbarBrand>
          <p className="font-bold text-inherit">AppAssistance</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        <Dropdown placement="bottom-start">
          <DropdownTrigger>
            <User
              as="button"
              avatarProps={{
                isBordered: true,
                src: photo,
              }}
              className="transition-transform"
              classNames={{
                name: "hidden sm:flex",
                description: "hidden sm:flex line line-clamp-1",
              }}
              description={email}
              name={`${firstName} ${lastName}`}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-bold">{t("signedas")}</p>
              <p className="font-bold text-xs">{email}</p>
            </DropdownItem>
            {/* <DropdownItem key='settings'>My Settings</DropdownItem> */}
            <DropdownItem
              key="logout"
              color="danger"
              as="button"
              onClick={handleLogout}
            >
              <p className="font-bold text-danger text-start">{t("logout")}</p>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full text-center"
              color={
                pathname.includes(`${item.toLowerCase()}`)
                  ? "warning"
                  : "foreground"
              }
              href={`/${item.toLowerCase()}`}
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
        <Link
          className="w-full"
          color={"danger"}
          href={`#`}
          size="lg"
          onClick={handleLogout}
        >
          {t("logout")}
        </Link>
      </NavbarMenu>
    </Navbar>
  );
};

export default NavBar;
