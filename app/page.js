import VatCalculatorClient from "./vat-calculator/VatCalculatorClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const revalidate = 3600;

export default function Home() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl p-6 sm:p-10">
      <section className="mb-6 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-zinc-100">VAT Calculator Dashboard</h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="bg-black p-4">
            <p className="text-xs text-zinc-500">Precision</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-100">99.9%</p>
          </Card>
          <Card className="bg-black p-4">
            <p className="text-xs text-zinc-500">Response Time</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-100">&lt; 150ms</p>
          </Card>
          <Card className="bg-black p-4">
            <p className="text-xs text-zinc-500">Tax Modes</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-100">Inclusive/Exclusive</p>
          </Card>
          <Card className="bg-black p-4">
            <p className="text-xs text-zinc-500">Use Case</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-100">Business + Freelance</p>
          </Card>
        </div>
      </section>

      <VatCalculatorClient />

      <section className="mb-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Introduction</CardTitle>
          </CardHeader>
          <CardContent>
          <p className="text-zinc-400">
            This VAT calculator helps you instantly calculate net amount, VAT amount, and gross total with a clean,
            dashboard-style workflow. It is designed for invoices, quotations, and tax estimation tasks.
          </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
          <p className="text-zinc-400">
            Enter net amount and VAT rate. The calculator applies the formula `VAT = Net * Rate / 100`, then adds VAT
            to net amount to produce gross value. All values update instantly in real time.
          </p>
          </CardContent>
        </Card>
      </section>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Purpose of the VAT Calculator</CardTitle>
        </CardHeader>
        <CardContent>
        <p className="text-zinc-400">
          The purpose is to reduce manual tax errors, speed up billing decisions, and provide quick calculations for
          accounting operations. It supports daily pricing checks, invoice verification, and planning of tax-inclusive
          budgets.
        </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
        <h2 className="mb-4 text-2xl font-semibold text-zinc-100">FAQ</h2>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-3 text-zinc-400">
            <AccordionItem value="q1">
              <AccordionTrigger>Is this suitable for business invoices?</AccordionTrigger>
              <AccordionContent>
                Yes, you can quickly validate invoice amounts before issuing or approving billing documents.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Can I use different VAT rates?</AccordionTrigger>
              <AccordionContent>Yes, enter any percentage and the output recalculates immediately.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Does this replace professional tax advice?</AccordionTrigger>
              <AccordionContent>
                No, use it for estimation and workflow support; consult tax professionals for compliance decisions.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Who Can Use It</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-400">
              Freelancers, agencies, ecommerce sellers, and finance teams can use this tool for quick validation before
              issuing invoices and pricing products.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Common Scenarios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-400">
              Estimate tax-inclusive prices, reverse-calculate net values, validate supplier invoices, and compare
              pricing models across different VAT rates.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-400">
              Always confirm regional VAT rules, round values consistently, and keep tax calculations documented for
              audits and monthly accounting reconciliation.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
