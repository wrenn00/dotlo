import { Header } from "@/components/shared/Header";
import { Button } from "@/components/shared/Button";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Header title="회원가입" subtitle="새 계정을 만드세요" />
        <Button className="w-full">회원가입</Button>
      </div>
    </main>
  );
}
