import RegisterComponent from "./Register";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an Account | Join AcademyFind Today",
  description: "Join AcademyFind to discover, compare, and connect with India's best coaching institutes, schools, and hostels. Sign up for free today.",
  alternates: {
    canonical: "https://academyfind.com/register",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Sign Up for AcademyFind",
    description: "Create your free account to find the best educational institutes in India.",
    url: "https://academyfind.com/register",
    siteName: "AcademyFind",
    type: "website",
  },
};


export default function RegisterPage() { // Component ka naam RegisterPage hona better hai
  return (
    <RegisterComponent />
  );
}