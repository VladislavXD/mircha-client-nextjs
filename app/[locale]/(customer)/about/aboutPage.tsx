"use client";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Image,
  Link,
  Chip,
} from "@heroui/react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function AboutPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const logoSrc =
    theme === "dark"
      ? "/mirchan-logo-icon-light.svg"
      : "/mirchan-logo-icon-dark.svg";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-content/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary to-secondary rounded-full blur-xl opacity-30 animate-pulse" />
              <Image
                alt="Mirchan"
                className="w-20 h-40 relative z-10"
                radius="full"
                src={logoSrc}
              />
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent mb-6">
            Mirchan
          </h1>

          <p className="text-xl md:text-2xl text-default-500 mb-8 max-w-3xl mx-auto leading-relaxed">
            Анонимная социальная сеть для{" "}
            <span className="text-primary font-semibold">
              свободного самовыражения
            </span>
            . Делитесь мыслями, находите единомышленников, будьте собой.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              as={Link}
              className="text-lg px-12 py-6 font-semibold"
              color="primary"
              href="/"
              size="lg"
              startContent={<span className="text-xl">🚀</span>}
              variant="shadow"
            >
              Открыть ленту
            </Button>
            <Button
              as={Link}
              className="text-lg px-12 py-6 font-semibold border-2"
              href="/auth"
              size="lg"
              startContent={<span className="text-xl">✨</span>}
              variant="bordered"
            >
              Присоединиться
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Что делает нас особенными
          </h2>
          <p className="text-xl text-default-500">
            Инновации в области анонимного общения
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl bg-gradient-to-br from-content/5 to-primary/5 border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-3xl">
                  🌙
                </div>
                <div>
                  <h3 className="text-xl font-bold">Анонимность</h3>
                  <p className="text-default-500">Полная свобода</p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-default-600 leading-relaxed">
                Пишите без страха осуждения. Ваша личность защищена, а голос
                слышен.
              </p>
            </CardBody>
          </Card>

          <Card className="group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl bg-gradient-to-br from-content/5 to-secondary/5 border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/40 flex items-center justify-center text-3xl">
                  😀
                </div>
                <div>
                  <h3 className="text-xl font-bold">Эмодзи</h3>
                  <p className="text-default-500">Выражайте эмоции</p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-default-600 leading-relaxed">
                Встраивайте эмодзи прямо в текст. Делитесь ссылками с красивыми
                превью.
              </p>
            </CardBody>
          </Card>

          <Card className="group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl bg-gradient-to-br from-content/5 to-success/5 border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-success/20 to-success/40 flex items-center justify-center text-3xl">
                  🧩
                </div>
                <div>
                  <h3 className="text-xl font-bold">Персонализация</h3>
                  <p className="text-default-500">Уникальный стиль</p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-default-600 leading-relaxed">
                Рамки, фон, оформление — создайте профиль, который отражает вашу
                индивидуальность.
              </p>
            </CardBody>
          </Card>

          <Card className="group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl bg-gradient-to-br from-content/5 to-warning/5 border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-warning/20 to-warning/40 flex items-center justify-center text-3xl">
                  ⚡
                </div>
                <div>
                  <h3 className="text-xl font-bold">Скорость</h3>
                  <p className="text-default-500">Молниеносно быстро</p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-default-600 leading-relaxed">
                Оптимизированная производительность. Плавная работа на любых
                устройствах.
              </p>
            </CardBody>
          </Card>

          <Card className="group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl bg-gradient-to-br from-content/5 to-danger/5 border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-danger/20 to-danger/40 flex items-center justify-center text-3xl">
                  🔒
                </div>
                <div>
                  <h3 className="text-xl font-bold">Безопасность</h3>
                  <p className="text-default-500">Ваши данные защищены</p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-default-600 leading-relaxed">
                Современное шифрование и минимум собираемых данных. Приватность
                превыше всего.
              </p>
            </CardBody>
          </Card>

          <Card className="group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl bg-gradient-to-br from-content/5 to-primary/5 border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-3xl">
                  🌍
                </div>
                <div>
                  <h3 className="text-xl font-bold">Сообщество</h3>
                  <p className="text-default-500">24/7 активность</p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-default-600 leading-relaxed">
                Живое сообщество единомышленников. Находите тех, кто понимает
                вас.
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Mirchan в цифрах
            </h2>
            <p className="text-xl text-default-500">Почему нам доверяют</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 shadow-xl bg-background/50 backdrop-blur-sm border-0">
              <CardBody>
                <div className="text-6xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                  0
                </div>
                <h3 className="text-xl font-semibold mb-2">Ненужных данных</h3>
                <p className="text-default-500">
                  Мы не собираем лишнюю информацию о вас
                </p>
              </CardBody>
            </Card>

            <Card className="text-center p-8 shadow-xl bg-background/50 backdrop-blur-sm border-0">
              <CardBody>
                <div className="text-6xl font-black bg-gradient-to-r from-success to-primary bg-clip-text text-transparent mb-4">
                  100%
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Фокус на контенте
                </h3>
                <p className="text-default-500">
                  Ваши мысли и идеи — это всё, что имеет значение
                </p>
              </CardBody>
            </Card>

            <Card className="text-center p-8 shadow-xl bg-background/50 backdrop-blur-sm border-0">
              <CardBody>
                <div className="text-6xl font-black bg-gradient-to-r from-secondary to-danger bg-clip-text text-transparent mb-4">
                  24/7
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Активное сообщество
                </h3>
                <p className="text-default-500">
                  Круглосуточная поддержка и общение
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <Card className="p-8 shadow-2xl bg-gradient-to-br from-content/5 to-primary/5 border-0">
          <CardHeader className="text-center pb-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Остались вопросы?
              </h2>
              <p className="text-xl text-default-500">
                Мы всегда готовы помочь
              </p>
            </div>
          </CardHeader>
          <CardBody className="text-center">
            <div className="space-y-6">
              <p className="text-lg text-default-600 leading-relaxed">
                Идеи по улучшению, вопросы о функциональности или сообщения о
                багах — мы ценим каждое обращение от нашего сообщества.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  as={Link}
                  className="text-lg px-8 py-6 font-semibold"
                  color="primary"
                  href="mailto:support@mirchan.app"
                  size="lg"
                  startContent={<span className="text-xl">📧</span>}
                  variant="shadow"
                >
                  support@mirchan.app
                </Button>

                <Chip
                  className="font-semibold"
                  color="success"
                  size="lg"
                  variant="flat"
                >
                  Отвечаем в течение 24 часов
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-divider bg-content/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <Image alt="Mirchan" className="w-12 h-12" src={logoSrc} />
              <div>
                <h3 className="text-xl font-bold">Mirchan</h3>
                <p className="text-default-500">Анонимная соцсеть</p>
              </div>
            </div>

            <div className="flex gap-6">
              <Link
                className="text-default-500 hover:text-foreground transition-colors"
                href="/"
              >
                Главная
              </Link>
              <Link
                className="text-default-500 hover:text-foreground transition-colors"
                href="/auth"
              >
                Войти
              </Link>
              <Link
                className="text-default-500 hover:text-foreground transition-colors"
                href="mailto:support@mirchan.app"
              >
                Поддержка
              </Link>
            </div>
          </div>

          <Divider className="my-8" />

          <div className="text-center">
            <p className="text-default-500">
              © 2025 Mirchan. Все права защищены. Создано с ❤️ для свободного
              общения.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
