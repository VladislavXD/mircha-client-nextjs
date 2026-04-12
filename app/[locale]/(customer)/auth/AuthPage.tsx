"use client";
import React, { useState } from "react";
import Link from "next/link";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Login from "@/src/features/auth/components/Login";
import Register from "@/src/features/auth/components/Register";
import { AuthSocial } from "@/src/features/auth/components";

const AuthPage = () => {
  const [selected, setSelected] = useState("login");
  const [isShowTwoFactor, setIsShowFactor] = useState(false);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col">
        <Tabs className="w-full" value={selected} onValueChange={setSelected}>
          <Card className="max-w-full w-[340px]">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="register">Регистрация</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              {isShowTwoFactor ? (
                // 2FA режим: без вкладок, только форма логина с полем кода
                <Login
                  isShowTwoFactor={isShowTwoFactor}
                  setIsShowFactor={setIsShowFactor}
                  setSelected={setSelected}
                />
              ) : (
                // Обычный режим: вкладки логин/регистрация

                <>
                  <TabsContent className="mt-4" value="login">
                    <Login
                      isShowTwoFactor={isShowTwoFactor}
                      setIsShowFactor={setIsShowFactor}
                      setSelected={setSelected}
                    />
                    <Button
                      asChild
                      className="w-full mt-4 "
                      variant="secondary"
                    >
                      <Link href="/forum">Открыть форум анонимно</Link>
                    </Button>
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Separator className="flex-1" />
                        <span className="text-xs text-gray-500">или</span>
                        <Separator className="flex-1" />
                      </div>
                      <AuthSocial />
                    </div>
                  </TabsContent>

                  <TabsContent className="mt-4" value="register">
                    <Register setSelected={setSelected} />
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Separator className="flex-1" />
                        <span className="text-xs text-gray-500">или</span>
                        <Separator className="flex-1" />
                      </div>
                      <AuthSocial />
                    </div>
                  </TabsContent>
                </>
              )}
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
