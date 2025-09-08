import { Suspense } from "react";
import Careers from "./_components/Careers";


export default function CareersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Careers/>
    </Suspense>
  );
}
