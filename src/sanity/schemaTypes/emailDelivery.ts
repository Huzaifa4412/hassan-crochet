import { defineField, defineType } from "sanity";
import { Mail, ShieldCheck } from "lucide-react";

export const emailDispatch = defineType({
  name: "emailDispatch", title: "Email delivery receipts", type: "document", icon: Mail, readOnly: true,
  description: "Delivery coordination only. Customer names, addresses, designs and previews are not stored in this document.",
  fields: [
    defineField({ name: "kind", type: "string", title: "Request type" }),
    defineField({ name: "customerId", type: "string", title: "Customer Resend message ID" }),
    defineField({ name: "merchantId", type: "string", title: "Shop Resend message ID" }),
    defineField({ name: "rateLimitApplied", type: "boolean", title: "Sending limits checked" }),
    defineField({ name: "leaseUntil", type: "datetime", title: "Sending lock expires" }),
    defineField({ name: "leaseOwner", type: "string", title: "Sending lock identifier", hidden: true }),
  ],
  preview: {
    select: { customerId: "customerId", merchantId: "merchantId", created: "_createdAt" },
    prepare({ customerId, merchantId, created }) {
      return { title: customerId && merchantId ? "Both email copies accepted" : "Email delivery pending", subtitle: created };
    },
  },
});

export const emailRateLimit = defineType({
  name: "emailRateLimit", title: "Email rate limit counters", type: "document", icon: ShieldCheck, readOnly: true,
  description: "Hashed system counters. No readable email address or IP address is stored.",
  fields: [
    defineField({ name: "count", type: "number", title: "Requests in this window" }),
    defineField({ name: "expiresAt", type: "datetime", title: "Window cleanup threshold" }),
  ],
});
