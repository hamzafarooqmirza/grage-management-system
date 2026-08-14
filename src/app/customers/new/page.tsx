"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardBody } from "@/components/ui/Card";
import { FieldGroup, TextInput } from "@/components/ui/Field";

export default function AddCustomerPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    router.push("/customers");
  }

  return (
    <>
      <TopBar title="Add Customer" subtitle="Create a new customer record" />
      <main className="flex-1 space-y-4 overflow-y-auto p-6">
        <Link
          href="/customers"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={15} /> Back to customers
        </Link>

        <Card className="max-w-2xl">
          <CardBody>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <FieldGroup label="Full Name" htmlFor="fullName" required>
                <TextInput
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="James Whitfield"
                />
              </FieldGroup>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FieldGroup label="Email" htmlFor="email" required>
                  <TextInput
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="james@example.com"
                  />
                </FieldGroup>

                <FieldGroup label="Phone Number" htmlFor="phone" required>
                  <TextInput
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="07700 900123"
                  />
                </FieldGroup>
              </div>

              <FieldGroup label="Address Line" htmlFor="addressLine" required>
                <TextInput
                  id="addressLine"
                  name="addressLine"
                  required
                  placeholder="14 Elm Grove"
                />
              </FieldGroup>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FieldGroup label="City" htmlFor="city" required>
                  <TextInput
                    id="city"
                    name="city"
                    required
                    placeholder="Manchester"
                  />
                </FieldGroup>

                <FieldGroup label="Post-Code" htmlFor="postCode" required>
                  <TextInput
                    id="postCode"
                    name="postCode"
                    required
                    placeholder="M14 5TR"
                  />
                </FieldGroup>
              </div>

              <FieldGroup
                label="Vehicle Registration"
                htmlFor="vehicleRegistration"
              >
                <TextInput
                  id="vehicleRegistration"
                  name="vehicleRegistration"
                  placeholder="LM19 XYZ"
                  className="uppercase"
                />
              </FieldGroup>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <Link
                  href="/customers"
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-accent-600/30 hover:bg-accent-700 disabled:opacity-60"
                >
                  {submitting ? "Adding..." : "Add Customer"}
                </button>
              </div>
            </form>
          </CardBody>
        </Card>
      </main>
    </>
  );
}
