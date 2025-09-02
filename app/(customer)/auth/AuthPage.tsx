"use client";
import { Card, CardBody, Tab, Tabs, Divider } from "@heroui/react"
import React, { useEffect, useState } from "react"
import Login from "../../components/features/user/Login"
import Register from "../../components/features/user/Register"
import { useRouter } from "next/navigation"
import { selectIsAuthenticated } from "@/src/store/user/user.slice"
import { useAppSelector } from "@/src/hooks/reduxHooks"
import GoogleSignIn from "@/components/GoogleSignIn"

const AuthPage = () => {
  const [selected, setSelected] = useState("login")
  

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col">
        <Card className="max-w-full w-[340px] h-[500px]">
          <CardBody className="overflow-hidden">
            <Tabs
              fullWidth
              size="md"
              selectedKey={selected}
              onSelectionChange={key => setSelected(key as string)}
            >
              <Tab key="login" title="Вход">
                <Login setSelected={setSelected} />
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Divider className="flex-1" />
                    <span className="text-tiny text-default-400">или</span>
                    <Divider className="flex-1" />
                  </div>
                  <GoogleSignIn />
                </div>
              </Tab>
              <Tab key="sign-up" title="Регистрация">
                <Register setSelected={setSelected} />
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Divider className="flex-1" />
                    <span className="text-tiny text-default-400">или</span>
                    <Divider className="flex-1" />
                  </div>
                  <GoogleSignIn />
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default AuthPage
