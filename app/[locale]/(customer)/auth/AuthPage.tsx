"use client";
import { Card, CardBody, Tab, Tabs, Divider, Button } from "@heroui/react"
import React, { useEffect, useState } from "react"


import Link from "next/link";
import Login from "@/src/features/auth/components/Login";
import Register from "@/src/features/auth/components/Register";
import { AuthSocial } from "@/src/features/auth/components";



const AuthPage = () => {
  const [selected, setSelected] = useState("login")
  const [isShowTwoFactor, setIsShowFactor] = useState(false)
  

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col">
        <Card className="max-w-full w-[340px] ">
          <CardBody className="overflow-hidden">
            {isShowTwoFactor ? (
              // 2FA режим: без вкладок, только форма логина с полем кода
              <Login
                setSelected={setSelected}
                isShowTwoFactor={isShowTwoFactor}
                setIsShowFactor={setIsShowFactor}
              />
            ) : (
              // Обычный режим: вкладки логин/регистрация
              <Tabs
                fullWidth
                size="md"
                selectedKey={selected}
                onSelectionChange={key => setSelected(key as string)}
              >
                <Tab key="login" title="Вход">
                  <Login
                    setSelected={setSelected}
                    isShowTwoFactor={isShowTwoFactor}
                    setIsShowFactor={setIsShowFactor}
                  />
                  <Button as={Link} href="/forum" fullWidth className="mt-4">
                    Открыть форум анонимно
                  </Button>
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Divider className="flex-1" />
                      <span className="text-tiny text-default-400">или</span>
                      <Divider className="flex-1" />
                    </div>
                    <AuthSocial/>

                  </div>
                </Tab>
                <Tab key="register" title="Регистрация">
                  <Register setSelected={setSelected} />
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Divider className="flex-1" />
                      <span className="text-tiny text-default-400">или</span>
                      <Divider className="flex-1" />
                    </div>
                    <AuthSocial/>

                    
                  </div>
                </Tab>
              </Tabs>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default AuthPage
