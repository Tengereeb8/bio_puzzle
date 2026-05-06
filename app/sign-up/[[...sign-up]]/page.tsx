import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
      <SignUp />
    </div>
  );
}
