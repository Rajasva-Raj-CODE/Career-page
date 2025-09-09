import { Suspense } from "react";
import Careers from "./career-page/_components/Careers";
import CareerLoading from "./career-page/_components/CareerLoading";

export default function Home() {
  return (
    <Suspense fallback={<CareerLoading />}>
      <Careers />
    </Suspense>
  );
}
