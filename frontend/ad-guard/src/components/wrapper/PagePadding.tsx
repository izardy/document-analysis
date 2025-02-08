import React from "react";

export const PagePadding = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return <div className="p-6">{children}</div>;
};
