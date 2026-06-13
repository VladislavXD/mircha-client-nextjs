import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";

type Props = {};

const NotAuthenticated = (props: Props) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center w-full justify-center min-h-[60vh] p-8 space-y-6">
      <div className="relative">
        <FaUser
          className="text-gray-300 dark:text-gray-700"
          size={80}
          strokeWidth={1.5}
        />

        <div className="absolute -bottom-1 -right-1 bg-gray-200 dark:bg-gray-800 rounded-full p-1.5">
          <svg
            className="text-gray-500"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
          >
            <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
          Вы не авторизированы
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Авторизуйтесь для доступа
        </p>
      </div>

      <Button color="primary" size="lg" onClick={() => router.push("/auth")}>
        Войти
      </Button>
    </div>
  );
};

export default NotAuthenticated;
