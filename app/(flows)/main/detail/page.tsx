import { Header } from "@/components/shared/Header";
import { Card } from "@/components/shared/Card";

export default function DetailPage() {
  return (
    <main className="p-6">
      <Header title="상세" />
      <Card>
        <p className="text-sm text-muted-foreground">상세 정보가 여기에 표시됩니다.</p>
      </Card>
    </main>
  );
}
