"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const logoSrc = "/mrchLogo_light.svg";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          {/* Logo with Glow */}
          <div className="flex justify-center mb-12 relative h-32 items-center">
            {/* Glow backdrop layers */}
            <div className="absolute w-40 h-40 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute w-32 h-32 bg-gradient-to-br from-secondary/15 to-transparent rounded-full blur-3xl -z-20" />
            
            {/* Logo */}
            <div className="relative z-10 group">
              <img
                alt="Mirchan"
                className="w-20 h-20 drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
                src={logoSrc}
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Mirchan
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Анонимная социальная сеть для{" "}
            <span className="text-foreground font-semibold">
              свободного самовыражения
            </span>
            . Делитесь мыслями, находите единомышленников, будьте собой.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button asChild size="lg" className="px-8">
              <Link href="/">Открыть ленту</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link href="/auth">Присоединиться</Link>
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
          <p className="text-lg text-muted-foreground">
            Инновации в области анонимного общения
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: "🌙",
              title: "Анонимность",
              subtitle: "Полная свобода",
              desc: "Пишите без страха осуждения. Ваша личность защищена, а голос слышен.",
              color: "from-blue-500/10 to-blue-500/5",
            },
            {
              icon: "😀",
              title: "Эмодзи",
              subtitle: "Выражайте эмоции",
              desc: "Встраивайте эмодзи прямо в текст. Делитесь ссылками с красивыми превью.",
              color: "from-yellow-500/10 to-yellow-500/5",
            },
            {
              icon: "🧩",
              title: "Персонализация",
              subtitle: "Уникальный стиль",
              desc: "Рамки, фон, оформление — создайте профиль, который отражает вашу индивидуальность.",
              color: "from-green-500/10 to-green-500/5",
            },
            {
              icon: "⚡",
              title: "Скорость",
              subtitle: "Молниеносно быстро",
              desc: "Оптимизированная производительность. Плавная работа на любых устройствах.",
              color: "from-orange-500/10 to-orange-500/5",
            },
            {
              icon: "🔒",
              title: "Безопасность",
              subtitle: "Ваши данные защищены",
              desc: "Современное шифрование и минимум собираемых данных. Приватность превыше всего.",
              color: "from-red-500/10 to-red-500/5",
            },
            {
              icon: "🌍",
              title: "Сообщество",
              subtitle: "24/7 активность",
              desc: "Живое сообщество единомышленников. Находите тех, кто понимает вас.",
              color: "from-purple-500/10 to-purple-500/5",
            },
          ].map((feature, idx) => (
            <Card
              key={idx}
              className={`group hover:shadow-lg transition-all duration-300 bg-gradient-to-br ${feature.color} border-border/50 hover:border-border`}
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-3xl flex-shrink-0">{feature.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.subtitle}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Mirchan в цифрах
            </h2>
            <p className="text-lg text-muted-foreground">
              Почему нам доверяют
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                number: "0",
                title: "Ненужных данных",
                desc: "Мы не собираем лишнюю информацию о вас",
              },
              {
                number: "100%",
                title: "Фокус на контенте",
                desc: "Ваши мысли и идеи — это всё, что имеет значение",
              },
              {
                number: "24/7",
                title: "Активное сообщество",
                desc: "Круглосуточная поддержка и общение",
              },
            ].map((stat, idx) => (
              <Card
                key={idx}
                className="text-center p-8 bg-gradient-to-br from-muted/50 to-background border-border/50"
              >
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
                  {stat.number}
                </div>
                <h3 className="font-semibold mb-2">{stat.title}</h3>
                <p className="text-sm text-muted-foreground">{stat.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <Card className="p-8 bg-gradient-to-br from-muted/50 to-muted/30 border-border/50">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Остались вопросы?
            </h2>
            <p className="text-muted-foreground mb-8">
              Мы всегда готовы помочь
            </p>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              Идеи по улучшению, вопросы о функциональности или сообщения о
              багах — мы ценим каждое обращение от нашего сообщества.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg">
                <a href="mailto:support@mirchan.app">
                  📧 support@mirchan.app
                </a>
              </Button>
              <Badge variant="secondary" className="px-3 py-1">
                Отвечаем в течение 24 часов
              </Badge>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
            <div className="flex items-center gap-3">
              <img
                alt="Mirchan"
                className="w-10 h-10"
                src={logoSrc}
              />
              <div>
                <h3 className="font-bold">Mirchan</h3>
                <p className="text-xs text-muted-foreground">Анонимная соцсеть</p>
              </div>
            </div>

            <div className="flex gap-6 text-sm">
              <Link
                className="text-muted-foreground hover:text-foreground transition-colors"
                href="/"
              >
                Главная
              </Link>
              <Link
                className="text-muted-foreground hover:text-foreground transition-colors"
                href="/auth"
              >
                Войти
              </Link>
              <a
                className="text-muted-foreground hover:text-foreground transition-colors"
                href="mailto:support@mirchan.app"
              >
                Поддержка
              </a>
            </div>
          </div>

          <Separator />

          <div className="text-center mt-8">
            <p className="text-xs text-muted-foreground">
              © 2025 Mirchan. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
