import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login to AcademyFind | Student & Institute Dashboard",
  description: "Access your AcademyFind account to shortlist top coaching institutes, manage your profile, write reviews, and book strategy calls.",
  alternates: {
    canonical: "https://www.academyfind.com/login",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Login | AcademyFind",
    description: "Access your AcademyFind dashboard.",
    url: "https://www.academyfind.com/login",
    siteName: "AcademyFind",
    type: "website",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login page par extra JSON-LD ki zaroorat nahi hoti, 
  // standard WebPage metadata is enough for Auth pages.
  return <>{children}</>;
}