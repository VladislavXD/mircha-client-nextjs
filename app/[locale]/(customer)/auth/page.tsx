// app/[locale]/auth/page.tsx
import type { Metadata } from "next";
import AuthPage from "./AuthPage";
interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    ru: "Вход в аккаунт",
    en: "Sign In",
  };
  
  const descriptions = {
    ru: "Войдите в свой аккаунт Mirchan для доступа к анонимному общению, форумам и обмену контентом",
    en: "Sign in to your Mirchan account to access anonymous communication, forums and content sharing",
  };

  const title = titles[locale as keyof typeof titles] || titles.ru;
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.ru;

  return {
    title,
    description,
    robots: {
      index: false, // Страницы входа обычно не индексируют
      follow: true,
    },
    openGraph: {
      title: `${title} | Mirchan`,
      description,
      type: "website",
      locale: locale === "ru" ? "ru_RU" : "en_US",
      images: [
        {
          url: "/images/mirchanLogo.jpg",
          width: 1200,
          height: 630,
          alt: "Mirchan",
        },
      ],
    },
    twitter: {
      card: "summary",
      title: `${title} | Mirchan`,
      description,
      images: ["/images/mirchanLogo.jpg"],
    },
    alternates: {
      canonical: `/auth`,
      languages: {
        'ru': '/ru/auth',
        'en': '/en/auth',
      },
    },
  };
}

export default async function AuthenticationPage() {
  // Ваш компонент страницы авторизации
  return <AuthPage  />;
}