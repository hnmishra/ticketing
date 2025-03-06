import Stripe from "stripe"

export const stripe = new Stripe(process.env.STIPE_KEY!, {
  apiVersion: "2025-02-24.acacia",
});