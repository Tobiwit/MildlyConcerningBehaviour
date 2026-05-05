import { RegisterForm } from "./RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create Account" };

interface Props {
  searchParams: Promise<{ token?: string; email?: string }>;
}

export default async function RegisterPage({ searchParams }: Props) {
  const { token, email } = await searchParams;
  return <RegisterForm inviteToken={token} inviteEmail={email} />;
}
