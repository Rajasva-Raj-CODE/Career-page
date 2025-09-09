import { Suspense } from "react";
import Careers from "./_components/Careers";
import CareerLoading from "./_components/CareerLoading";


export default function Home() {
  return (
    <Suspense fallback={<CareerLoading />}>
      <Careers />
    </Suspense>
  );
}
