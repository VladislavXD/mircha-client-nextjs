// app/[locale]/auth/page.tsx
import type { Metadata } from "next";
import AuthPage from "./AuthPage";
interface Props {
  params: { locale: string };
}

export async function generateMetadata(): Promise<Metadata> {

  
  const titles = {
    ru: "Вход в аккаунт",
    en: "Sign In",
  };
  
  const descriptions = {
    ru: "Войдите в свой аккаунт Mirchan для доступа к анонимному общению, форумам и обмену контентом",
    en: "Sign in to your Mirchan account to access anonymous communication, forums and content sharing",
  };

  const title = 'Авторизация';
  const description = 'Введите свои учетные данные для доступа к вашему аккаунту';

  return {
    title,
    description,
    robots: {
      index: false, 
      follow: true,
    },
    openGraph: {
      title: `${title} | Mirchan`,
      description,
      type: "website",
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