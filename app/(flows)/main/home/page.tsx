import { Header } from "@/components/shared/Header";
import { Card } from "@/components/shared/Card";

export default function HomePage() {
  return (
    <main className="p-6">
      <Header title="홈" />
      <div className="space-y-4">
        <Card>
          <p className="text-sm text-muted-foreground">콘텐츠가 여기에 표시됩니다.</p>
        </Card>
      </div>
    </main>
  );
}
