"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardBody } from "@/components/ui/Card";
import { FieldGroup, Select, TextArea, TextInput } from "@/components/ui/Field";
import { customers, getVehiclesForCustomer } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";

interface DraftLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

let lineItemSeq = 0;
function newLineItem(): DraftLineItem {
  lineItemSeq += 1;
  return { id: `draft_${lineItemSeq}`, description: "", quantity: 1, unitPrice: 0 };
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const [customerId, setCustomerId] = useState("");
  const [vatRate, setVatRate] = useState(20);
  const [lineItems, setLineItems] = useState<DraftLineItem[]>([newLineItem()]);
  const [submitting, setSubmitting] = useState(false);

  const vehicles = useMemo(
    () => (customerId ? getVehiclesForCustomer(customerId) : []),
    [customerId]
  );

  const subtotal = lineItems.reduce(
    (sum, li) => sum + li.quantity * li.unitPrice,
    0
  );
  const vat = subtotal * (vatRate / 100);
  const total = subtotal + vat;

  function updateLineItem(id: string, patch: Partial<DraftLineItem>) {
    setLineItems((items) =>
      items.map((li) => (li.id === id ? { ...li, ...patch } : li))
    );
  }

  function addLineItem() {
    setLineItems((items) => [...items, newLineItem()]);
  }

  function removeLineItem(id: string) {
    setLineItems((items) =>
      items.length > 1 ? items.filter((li) => li.id !== id) : items
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    router.push("/invoices");
  }

  return (
    <>
      <TopBar title="Create Invoice" subtitle="Raise a new invoice for a customer" />
      <main className="flex-1 space-y-4 overflow-y-auto p-6">
        <Link
          href="/invoices"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={15} /> Back to invoices
        </Link>

        <Card className="max-w-3xl">
          <CardBody>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FieldGroup label="Customer" htmlFor="customer" required>
                  <Select
                    id="customer"
                    name="customer"
                    required
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                  >
                    <option value="" disabled>
                      Select a customer
                    </option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </FieldGroup>

                <FieldGroup label="Vehicle" htmlFor="vehicle" required>
                  <Select
                    id="vehicle"
                    name="vehicle"
                    required
                    disabled={!customerId}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      {customerId ? "Select a vehicle" : "Select a customer first"}
                    </option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.registration} · {v.make} {v.model}
                      </option>
                    ))}
                  </Select>
                </FieldGroup>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FieldGroup label="Invoice Date" htmlFor="invoiceDate" required>
                  <TextInput id="invoiceDate" name="invoiceDate" type="date" required />
                </FieldGroup>

                <FieldGroup label="Due Date" htmlFor="dueDate" required>
                  <TextInput id="dueDate" name="dueDate" type="date" required />
                </FieldGroup>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">
                    Line Items
                  </label>
                  <button
                    type="button"
                    onClick={addLineItem}
                    className="flex items-center gap-1 text-xs font-medium text-accent-600 hover:text-accent-700"
                  >
                    <Plus size={14} /> Add line
                  </button>
                </div>
                <div className="space-y-3">
                  {lineItems.map((li) => (
                    <div
                      key={li.id}
                      className="grid grid-cols-12 items-end gap-2 rounded-lg border border-slate-100 p-3"
                    >
                      <div className="col-span-12 sm:col-span-6">
                        <TextInput
                          aria-label="Description"
                          placeholder="Description"
                          value={li.description}
                          onChange={(e) =>
                            updateLineItem(li.id, { description: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <TextInput
                          aria-label="Quantity"
                          type="number"
                          min="1"
                          step="1"
                          value={li.quantity}
                          onChange={(e) =>
                            updateLineItem(li.id, {
                              quantity: Number(e.target.value) || 1,
                            })
                          }
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <TextInput
                          aria-label="Unit price"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Unit price"
                          value={li.unitPrice}
                          onChange={(e) =>
                            updateLineItem(li.id, {
                              unitPrice: Number(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeLineItem(li.id)}
                          disabled={lineItems.length === 1}
                          className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FieldGroup label="VAT Rate (%)" htmlFor="vatRate">
                  <TextInput
                    id="vatRate"
                    name="vatRate"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={vatRate}
                    onChange={(e) => setVatRate(Number(e.target.value) || 0)}
                  />
                </FieldGroup>
                <div className="rounded-lg bg-slate-50 p-3 text-sm">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>VAT</span>
                    <span>{formatCurrency(vat)}</span>
                  </div>
                  <div className="mt-1 flex justify-between border-t border-slate-200 pt-1 font-semibold text-slate-900">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              <FieldGroup label="Notes" htmlFor="notes">
                <TextArea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Payment terms, thank you note, etc."
                />
              </FieldGroup>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <Link
                  href="/invoices"
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-accent-600/30 hover:bg-accent-700 disabled:opacity-60"
                >
                  {submitting ? "Creating..." : "Create Invoice"}
                </button>
              </div>
            </form>
          </CardBody>
        </Card>
      </main>
    </>
  );
}
