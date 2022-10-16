import Stripe from "stripe";
import config from "config";

export const stripe = new Stripe(config.get("stripe.apiKey"), {
    apiVersion: '2022-08-01'
});