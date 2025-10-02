"use client";

import React, { FC } from "react";
import { useParams } from "next/navigation";
import Link, { LinkProps } from "next/link";

interface CustomLinkProps extends LinkProps {
  href: string;
  children: React.ReactNode;
}

const CustomLink: FC<CustomLinkProps> = ({ href, children, ...props }) => {
  const { locale } = useParams();

  const finalHref = locale ? `/${locale}${href}` : href;

  return (
    <Link href={finalHref} {...props}>
      {children}
    </Link>
  );
};

export default CustomLink;
