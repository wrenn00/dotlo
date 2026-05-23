import { Button as ShadcnButton } from "@/components/ui/button";

export type ButtonProps = React.ComponentProps<typeof ShadcnButton>;

export function Button(props: ButtonProps) {
  return <ShadcnButton {...props} />;
}
