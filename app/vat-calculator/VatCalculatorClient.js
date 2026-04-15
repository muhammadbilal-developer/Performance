"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function VatCalculatorClient() {
  const [amount, setAmount] = useState("100");
  const [rate, setRate] = useState("20");
  const [mode, setMode] = useState("include");

  const values = useMemo(() => {
    const inputAmount = Number(amount) || 0;
    const vatRate = Number(rate) || 0;
    if (mode === "include") {
      const vatAmount = (inputAmount * vatRate) / 100;
      const totalAmount = inputAmount + vatAmount;
      return { vatAmount, totalAmount };
    }
    const vatAmount = (inputAmount * vatRate) / (100 + vatRate);
    const totalAmount = inputAmount - vatAmount;
    return { vatAmount, totalAmount };
  }, [amount, rate, mode]);

  return (
    <Card className="mb-10 w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-2 shadow-none">
      <CardContent className="space-y-6 p-6">
        <label className="flex flex-col gap-2">
          <span className="text-base font-medium text-zinc-300">Amount</span>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
            className="h-12 rounded-xl border-zinc-700 bg-black text-xl text-zinc-100"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-base font-medium text-zinc-300">VAT rate %</span>
          <Input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            min="0"
            step="0.01"
            className="h-12 rounded-xl border-zinc-700 bg-black text-xl text-zinc-100"
          />
        </label>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setMode("include")}
            className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left ${
              mode === "include"
                ? "border-zinc-500 bg-zinc-900 text-zinc-100"
                : "border-zinc-700 bg-black text-zinc-400"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 rounded-full border ${
                mode === "include" ? "border-green-500 bg-green-500" : "border-zinc-600 bg-black"
              }`}
            />
            <span className="text-base">Include VAT</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("exclude")}
            className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left ${
              mode === "exclude"
                ? "border-zinc-500 bg-zinc-900 text-zinc-100"
                : "border-zinc-700 bg-black text-zinc-400"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 rounded-full border ${
                mode === "exclude" ? "border-green-500 bg-green-500" : "border-zinc-600 bg-black"
              }`}
            />
            <span className="text-base">Exclude VAT</span>
          </button>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-black p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-base text-zinc-400">Amount of VAT:</p>
            <p className="text-2xl font-semibold text-zinc-100">{values.vatAmount.toFixed(2)} ¤</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-base text-zinc-400">Net amount:</p>
            <p className="text-2xl font-semibold text-zinc-100">{values.totalAmount.toFixed(2)} ¤</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
