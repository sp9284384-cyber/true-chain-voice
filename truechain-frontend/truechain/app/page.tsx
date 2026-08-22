import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Hero3D from "@/components/landing/Hero3D";
import HowItWorks from "@/components/landing/HowItWorks";
import WhyTrust from "@/components/landing/WhyTrust";
import { ArrowRight, LinkChain } from "@/components/shared/icons";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <section className="container-page bg-grid-fade bg-grid pt-14 sm:pt-20">
          <div className="grid items-center gap-12 sm:grid-cols-2 sm:gap-8">
            <div className="order-2 sm:order-1">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-xs text-text-muted">
                <LinkChain className="h-3.5 w-3.5 text-signal-teal" />
                Tamper-evident reporting
              </div>
              <h1 className="font-display text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl">
                Report without revealing your identity.
              </h1>
              <p className="mt-5 max-w-md text-lg text-text-muted">
                Submit harassment, corruption, or misconduct reports with no
                name, no email, and no account — verified as tamper-free by
                a public hash chain anyone can check.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/report" className="btn-primary">
                  Submit a report
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/verify" className="btn-secondary">
                  Verify chain integrity
                </Link>
              </div>
            </div>

            <div className="order-1 sm:order-2">
              <Hero3D />
            </div>
          </div>
        </section>

        <HowItWorks />
        <WhyTrust />
      </main>

      <Footer />
    </div>
  );
}
