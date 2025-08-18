import { Fragment } from "react";
import { Hero } from "./sections/hero";
import { Features } from "./sections/features";
import { HowItWorks } from "./sections/how-it-works";
import { CallToActions } from "./sections/call-to-actions";

export default async function HomePage() {
  return (
    <Fragment>
      <Hero />
      <Features />
      <HowItWorks />
      <CallToActions />
    </Fragment>
  );
}
