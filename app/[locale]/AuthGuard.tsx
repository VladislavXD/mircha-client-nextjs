"use client";
import React from "react";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default AuthGuard;
