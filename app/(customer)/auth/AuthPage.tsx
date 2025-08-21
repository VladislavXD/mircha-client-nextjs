"use client";
import { Card, CardBody, Tab, Tabs } from "@heroui/react"
import React, { useEffect, useState } from "react"
import Login from "../../components/features/user/Login"
import Register from "../../components/features/user/Register"
import { useRouter } from "next/navigation"
import { selectIsAuthenticated } from "@/src/store/user/user.slice"
import { useAppSelector } from "@/src/hooks/reduxHooks"

const AuthPage = () => {
  const [selected, setSelected] = useState("login")
  

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col">
        <Card className="max-w-full w-[340px] h-[450px]">
          <CardBody className="overflow-hidden">
            <Tabs
              fullWidth
              size="md"
              selectedKey={selected}
              onSelectionChange={key => setSelected(key as string)}
            >
              <Tab key="login" title="Вход">
                <Login setSelected={setSelected} />
              </Tab>
              <Tab key="sign-up" title="Регистрация">
                <Register setSelected={setSelected} />
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default AuthPage
