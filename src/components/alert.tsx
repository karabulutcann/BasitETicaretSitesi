import {  CheckCircle2, AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AlertDestructive({
  errHeader,
  errDescription,
}: {
  errHeader: string;
  errDescription: string;
}) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{errHeader}</AlertTitle>
      <AlertDescription>{errDescription}</AlertDescription>
    </Alert>
  );
}

export function AlertSuccess({
  successHeader,
  successDescription,
}: {
  successHeader: string;
  successDescription: string;
}) {
  return (
    <Alert variant="default" className="my-4 border-green-500 text-green-500 [&>svg]:text-green-500">
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>{successHeader}</AlertTitle>
      <AlertDescription>{successDescription}</AlertDescription>
    </Alert>
  );
}
