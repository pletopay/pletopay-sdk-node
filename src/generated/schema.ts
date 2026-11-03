/* eslint-disable */
/* prettier-ignore */
// Generated from spec/public.v1.yaml by scripts/generate.mjs. Do not edit by hand.

export interface paths {
    "/api/v1/customers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List customers
         * @description List your customers. Filter by `email` to find a customer you created earlier.
         */
        get: operations["listCustomers"];
        put?: never;
        /**
         * Create a customer
         * @description Create a customer so you can issue dedicated virtual accounts, invoices and subscriptions to them, and see their payments together. Every field is optional. An email must be unique among your customers in this mode (`409 customer_exists`).
         */
        post: operations["createCustomer"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/customers/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve a customer
         * @description Retrieve a customer by id (`cus_…`).
         */
        get: operations["getCustomer"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update a customer
         * @description Update a customer’s email, name or phone. `metadata` is merged into the existing metadata. Changing the email to one another customer uses returns `409 customer_exists`. Set a metadata key to `""` to delete it; the merged metadata may have at most 50 keys (`400 metadata_too_large`).
         */
        patch: operations["updateCustomer"];
        trace?: never;
    };
    "/api/v1/payments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List payments
         * @description List payments. Filter by `status`, `customer`, `reference`, `virtual_account`, amount received (`amount[gte]`, `amount[lte]`, in kobo) and creation time. Add `expand[]=customer` to embed the customer object.
         */
        get: operations["listPayments"];
        put?: never;
        /**
         * Create a bank-transfer payment
         * @description Create a bank-transfer payment. Pletopay opens a dynamic (single-use) virtual account for it and returns the account in `bank_transfer`: show the account number, bank and amount to your customer.
         *
         *     With `amount_rule: exact` (the default) transfers of any other amount are rejected. With `any`, whatever arrives is accepted and `amount` may be omitted.
         *
         *     The account expires with the payment: `expires_in` (seconds) or `expires_at`, between 5 minutes and 3 hours (the limit for one-time accounts; `400 expiry_out_of_range` carries `details.min_seconds` / `max_seconds`); the default is your organization’s setting (30 minutes unless changed).
         *
         *     The payment becomes `succeeded` only when the credit is confirmed. Never treat a redirect or client-side callback as proof of payment: listen for `payment.succeeded` or retrieve the payment.
         *
         *     `reference` must be unique among your payments in this mode (`409 duplicate_reference`). Send an `Idempotency-Key` so a retried request can’t create a second payment.
         */
        post: operations["createPayment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/payments/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve (verify) a payment
         * @description Retrieve a payment by id (`pay_…`). This is the authoritative way to verify a payment server-side before you deliver value: check `status` is `succeeded` and `amount_received` is what you expect.
         */
        get: operations["getPayment"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/payments/reference/{reference}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve (verify) a payment by your reference
         * @description Retrieve a payment by the `reference` you gave it. Useful when you stored your order id but not the Pletopay payment id.
         */
        get: operations["getPaymentByReference"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/virtual-accounts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List virtual accounts
         * @description List virtual accounts. Filter by `type`, `status`, `customer` or `account_number`.
         */
        get: operations["listVirtualAccounts"];
        put?: never;
        /**
         * Create a virtual account
         * @description Create a virtual account (a real NUBAN that routes into your balance).
         *
         *     **Dedicated** (`type: dedicated`, needs `customer_id`): a permanent account for one customer. Every transfer into it creates a `succeeded` payment with `source: dedicated_virtual_account`, whatever the amount. Close it when you no longer want to receive money through it.
         *
         *     **Dynamic** (`type: dynamic`, needs `amount` and `reference`): a single-use account for one exact amount. This is the same as creating a payment with `POST /api/v1/payments`; the response is the account, and the payment id is in `payment`.
         */
        post: operations["createVirtualAccount"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/virtual-accounts/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve a virtual account
         * @description Retrieve a virtual account by id (`va_…`).
         */
        get: operations["getVirtualAccount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/virtual-accounts/reference/{reference}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve a dynamic virtual account by your reference
         * @description Retrieve a **dynamic** virtual account by the `reference` you gave when creating it (the same reference as its payment). Dedicated accounts have no reference: retrieve them by id, or list them with `customer`. An unknown reference returns `404 resource_missing`.
         */
        get: operations["getVirtualAccountByReference"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/virtual-accounts/{id}/close": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Close a dedicated virtual account
         * @description Close a dedicated virtual account so it stops receiving money for you. Dynamic accounts can’t be closed this way (`400 invalid_operation`): they close with their payment. Closing an already closed account returns it unchanged.
         */
        post: operations["closeVirtualAccount"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/subaccounts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List subaccounts
         * @description List your subaccounts.
         */
        get: operations["listSubaccounts"];
        put?: never;
        /**
         * Create a subaccount (a seller/vendor on your platform) with a verified payout account
         * @description Create a subaccount: a seller, vendor or branch on your platform with its own balance and payout account. The payout account is verified by name enquiry (`400 account_not_resolved` if it can’t be resolved). Payments share their net amount with subaccounts through split rules.
         */
        post: operations["createSubaccount"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/subaccounts/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve a subaccount
         * @description Retrieve a subaccount by id (`sub_…`).
         */
        get: operations["getSubaccount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update a subaccount
         * @description Update a subaccount’s name, email, status or metadata. Changing the payout account (`bank_code` with `account_number`) re-runs name enquiry, and the new account is used only after a cooldown (`settlement_account.usable_from`) to protect against account takeover.
         */
        patch: operations["updateSubaccount"];
        trace?: never;
    };
    "/api/v1/subaccounts/{id}/balance": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * A subaccount's balances (from the ledger)
         * @description A subaccount’s pending, available and settling balances, read from the ledger.
         */
        get: operations["getSubaccountBalance"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/split-rules": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List split rules
         * @description List your split rules.
         */
        get: operations["listSplitRules"];
        put?: never;
        /**
         * Create a split rule
         * @description Create a split rule that shares each payment’s **net amount** (after fees) with one or more subaccounts. The rest stays in your balance.
         *
         *     `percentage` shares are basis points (2500 = 25%); `flat` shares are kobo, capped at the net amount. Pass the rule id as `split` when you create a payment, checkout session, payment link, invoice or subscription. The split is frozen on each payment when it is created.
         */
        post: operations["createSplitRule"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/split-rules/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve a split rule
         * @description Retrieve a split rule by id (`spl_…`).
         */
        get: operations["getSplitRule"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Activate or deactivate a split rule
         * @description Activate or deactivate a split rule. Deactivated rules can’t be used for new payments; payments already created keep their frozen split.
         */
        patch: operations["updateSplitRule"];
        trace?: never;
    };
    "/api/v1/transfers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List transfers
         * @description List transfers. Filter by `status` and creation time.
         */
        get: operations["listTransfers"];
        put?: never;
        /**
         * Send money from your available balance
         * @description Send money from your available balance to any Nigerian bank account. **`Idempotency-Key` is required**: if the request times out, retry with the same key and you will get the original transfer, never a second one.
         *
         *     Resolve the account first with `POST /api/v1/transfers/name-enquiry`. The amount plus fees (`total_debit`) is reserved from your available balance immediately (`400 insufficient_funds` otherwise). The minimum transfer is ₦10.00 (`400 amount_below_minimum`) and `narration` is limited to 50 characters.
         *
         *     A transfer whose outcome isn’t known yet stays `processing`; it is never reported `failed` until it is confirmed. Listen for `transfer.succeeded` / `transfer.failed`. A failed transfer releases the reserved funds.
         *
         *     Money-out can be refused by your risk limits (`403 risk_limit_exceeded`), an operator hold (`403 funds_on_hold`), live-mode verification (`403 compliance_verification_required`) or transfers not being enabled for your account (`403 transfers_disabled`).
         */
        post: operations["createTransfer"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/transfers/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve a transfer
         * @description Retrieve a transfer by id (`trf_…`).
         */
        get: operations["getTransfer"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/transfers/reference/{reference}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve a transfer by your reference
         * @description Retrieve a transfer by the `reference` you gave when sending it. References are unique per mode, so this is a safe way to check a transfer after a timeout when you never received its id. An unknown reference returns `404 resource_missing`.
         */
        get: operations["getTransferByReference"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/transfers/name-enquiry": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Resolve a bank account name before sending
         * @description Look up the account name for a bank code and account number (NIP name enquiry). Show the name to the person sending money before they confirm. An account that can’t be resolved returns `400 account_not_resolved`. In live mode, lookups need an approved business verification and count toward the money-movement rate limit.
         */
        post: operations["resolveAccount"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/banks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List supported banks
         * @description List the banks you can send transfers to, with the `code` to use as `bank_code`. The list is cached for an hour.
         */
        get: operations["listBanks"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/settlements": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List settlements (payouts of your available balance to your bank account)
         * @description List settlements: payouts of your available balance (or a subaccount’s) to the settlement account you set in the dashboard, on your schedule or on demand. Filter by `status` or `subaccount`.
         */
        get: operations["listSettlements"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/settlements/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve a settlement
         * @description Retrieve a settlement by id (`stl_…`), including its fees and the payout transfer’s status.
         */
        get: operations["getSettlement"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/settlements/{id}/items": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Ledger movements covered by a settlement
         * @description Every movement of your available balance up to the settlement’s cutoff that this settlement accounts for. Use it to reconcile a payout against the payments and transfers behind it.
         */
        get: operations["listSettlementItems"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/refunds": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List refunds
         * @description List refunds. Filter by `payment` to see the refunds of one payment.
         */
        get: operations["listRefunds"];
        put?: never;
        /**
         * Refund a payment (fully or partially)
         * @description Refund a payment, fully or partially, by bank transfer from your available balance. **`Idempotency-Key` is required.**
         *
         *     Without `amount`, the whole refundable amount is refunded. Only `succeeded` or `partially_refunded` payments can be refunded (`409 payment_not_refundable`).
         *
         *     **Destination.** When the sender’s full account details are known, the refund always goes back to that account: omit `destination` (a different one returns `400 refund_destination_mismatch`). When the sender isn’t known, pass `destination` (`400 refund_destination_required` otherwise); it is verified by name enquiry. In live mode a custom destination also needs outbound transfers enabled (`403 transfers_disabled`).
         *
         *     The payment becomes `partially_refunded` or `refunded` only once the refund has actually been paid out (`refund.succeeded`). Without a `reference`, one is derived from the `Idempotency-Key`, so a retried request can’t create a second refund.
         */
        post: operations["createRefund"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/refunds/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve a refund
         * @description Retrieve a refund by id (`re_…`).
         */
        get: operations["getRefund"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/refunds/reference/{reference}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve a refund by its reference
         * @description Retrieve a refund by its `reference` (unique per mode). A refund created without one is given a generated reference, returned in its `reference` field. An unknown reference returns `404 resource_missing`.
         */
        get: operations["getRefundByReference"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/checkout/sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List checkout sessions
         * @description List checkout sessions. Filter by `status` or by the `payment_link` that started them.
         */
        get: operations["listCheckoutSessions"];
        put?: never;
        /**
         * Create a hosted checkout session
         * @description Create a checkout session, then either redirect your customer to its `url` (hosted checkout) or hand its `token` to your front end and open it in the Pletopay popup with the browser SDK and your publishable key. Pletopay’s page shows the bank-transfer details (the payment is created when the customer opens it), waits for the transfer and sends the customer to `success_url` (hosted) or calls your `onSuccess` callback (popup). The session expires after `expires_in` seconds (default 1 hour, at most 3 hours: one-time bank accounts are limited to 3 hours) and completes when its payment succeeds (`checkout.session.completed`). `reference` is optional; when given it must be unique per mode (`409 duplicate_reference`), and the session can then be retrieved with `GET /api/v1/checkout/sessions/reference/{reference}`. Neither the redirect nor the callback is proof of payment: confirm with the webhook or by retrieving the session.
         */
        post: operations["createCheckoutSession"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/checkout/sessions/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve a checkout session
         * @description Retrieve a checkout session by id (`cs_…`).
         */
        get: operations["getCheckoutSession"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/checkout/sessions/reference/{reference}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve a checkout session by your reference
         * @description Retrieve a checkout session by the `reference` you gave when creating it (unique per mode). An unknown reference returns `404 resource_missing`.
         */
        get: operations["getCheckoutSessionByReference"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/checkout/sessions/{id}/expire": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Expire an open checkout session
         * @description Expire an open checkout session so the customer can no longer pay through it. A session that is already complete or expired returns `409`.
         */
        post: operations["expireCheckoutSession"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/payment-links": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List payment links
         * @description List payment links. Filter by `status` (`active` / `inactive`).
         */
        get: operations["listPaymentLinks"];
        put?: never;
        /**
         * Create a payment link
         * @description Create a reusable payment link: a hosted page you can share anywhere. Each visit starts its own checkout session. Set a fixed `amount`, or leave it out and set `min_amount` / `max_amount` to let the customer choose. `max_uses` and `expires_at` stop the link automatically.
         */
        post: operations["createPaymentLink"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/payment-links/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve a payment link
         * @description Retrieve a payment link by id (`plink_…`).
         */
        get: operations["getPaymentLink"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update or deactivate a payment link
         * @description Rename a payment link, change its description, or deactivate it (`active: false`) so it stops accepting payments.
         */
        patch: operations["updatePaymentLink"];
        trace?: never;
    };
    "/api/v1/invoices": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List invoices
         * @description List invoices. Filter by `status`, `customer` or the `subscription` that issued them.
         */
        get: operations["listInvoices"];
        put?: never;
        /**
         * Create a draft invoice
         * @description Create a draft invoice for a customer with line items and optional taxes (basis points, 750 = 7.5%). Totals are computed for you. A draft can be edited; finalize it to make it payable.
         */
        post: operations["createInvoice"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/invoices/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve an invoice
         * @description Retrieve an invoice by id (`inv_…`).
         */
        get: operations["getInvoice"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update a draft invoice
         * @description Change a draft invoice’s customer, items, taxes, due date, memo or metadata. Only drafts can be changed (`409 invoice_not_draft`).
         */
        patch: operations["updateInvoice"];
        trace?: never;
    };
    "/api/v1/invoices/{id}/finalize": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Finalize an invoice
         * @description Finalize a draft invoice: it gets its number, the amounts are frozen, and `hosted_invoice_url` becomes a payable page to send to your customer. A zero total or a past due date can’t be finalized.
         */
        post: operations["finalizeInvoice"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/invoices/{id}/void": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Void an invoice
         * @description Void an open or uncollectible invoice so it can no longer be paid. Invoices in any other status return `409 invoice_not_open`.
         */
        post: operations["voidInvoice"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/invoices/{id}/mark-uncollectible": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark an invoice uncollectible (it can still be paid)
         * @description Mark an open invoice uncollectible for your records. The customer can still pay it.
         */
        post: operations["markInvoiceUncollectible"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/risk-events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List risk events (blocked and flagged activity)
         * @description List risk events: money movements blocked by your risk limits and payments flagged for review (high value, customer velocity, blocked customers). Filter by `review_status`.
         */
        get: operations["listRiskEvents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/risk-limits": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Your effective risk limits (kobo; 0 = no limit)
         * @description Your effective risk limits in this mode, in kobo (0 = no limit). Transfers and refunds over a limit are refused with `403 risk_limit_exceeded`; received payments over `high_value_payment` are flagged, never refused.
         */
        get: operations["getRiskLimits"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/customers/{id}/risk-status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Set a customer's risk status
         * @description Set a customer’s risk status. `blocked` customers can’t be issued new payments or accounts (`409 customer_blocked`); `elevated` is informational.
         */
        post: operations["setCustomerRiskStatus"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/plans": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List plans
         * @description List your plans.
         */
        get: operations["listPlans"];
        put?: never;
        /**
         * Create a plan
         * @description Create a plan: an amount billed every `interval_count` × `interval` (for example every 3 months). Subscribe customers to it with `POST /api/v1/subscriptions`.
         */
        post: operations["createPlan"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/plans/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve a plan
         * @description Retrieve a plan by id (`plan_…`).
         */
        get: operations["getPlan"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update or deactivate a plan
         * @description Rename a plan or deactivate it. Inactive plans take no new subscriptions; existing subscriptions continue.
         */
        patch: operations["updatePlan"];
        trace?: never;
    };
    "/api/v1/subscriptions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List subscriptions
         * @description List subscriptions. Filter by `status` or `customer`.
         */
        get: operations["listSubscriptions"];
        put?: never;
        /**
         * Subscribe a customer to a plan
         * @description Subscribe a customer to a plan. The first period’s invoice is issued at `start_date` (default now) and each later one at the end of the period, due after `days_until_due` days.
         *
         *     Nothing is ever debited automatically; Nigerian bank transfers are push payments. With `collection_method: invoice` the customer pays each period through its hosted invoice page. With `dedicated_account`, the customer also gets a dedicated virtual account and an exact transfer into it pays the open invoice.
         *
         *     A customer can have one live subscription per plan (`409 subscription_exists`).
         */
        post: operations["createSubscription"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/subscriptions/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve a subscription
         * @description Retrieve a subscription by id (`sbs_…`).
         */
        get: operations["getSubscription"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/subscriptions/{id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Cancel a subscription (now, or at the end of the current period)
         * @description Cancel a subscription now, or at the end of the current period with `at_period_end: true`. Canceling an already canceled subscription returns `409 subscription_canceled`.
         */
        post: operations["cancelSubscription"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/reports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List reports
         * @description List reports. Filter by `type` or `status`.
         */
        get: operations["listReports"];
        put?: never;
        /**
         * Generate a CSV report
         * @description Generate a CSV report for a period of up to 366 days (`period_end` is exclusive). Reports run in the background: poll the report or listen for `report.ready`, then download it. Amounts in the CSV are exact decimal naira and times are UTC. The file is available until the report’s `expires_at`. At most two reports generate at once per mode (`429 reports_in_progress`).
         */
        post: operations["createReport"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/reports/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve a report
         * @description Retrieve a report by id (`rpt_…`).
         */
        get: operations["getReport"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/reports/{id}/download": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Download a finished report (CSV)
         * @description Download a finished report as CSV. The `X-Content-SHA256` response header carries the file’s hash (it matches the report’s `sha256`). A report still generating returns `409 report_not_ready`; an expired file returns `409 report_expired`.
         */
        get: operations["downloadReport"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/statement": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Balance statement: opening, credits, debits, closing per balance
         * @description Opening balance, credits, debits and closing balance for each of your balances over a period, computed from the ledger.
         */
        get: operations["getStatement"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/webhook-endpoints": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List webhook endpoints
         * @description List your webhook endpoints with their delivery health.
         */
        get: operations["listWebhookEndpoints"];
        put?: never;
        /**
         * Register a webhook endpoint. The signing secret is returned only in this response.
         * @description Register a publicly reachable endpoint to receive events (https is required for live mode; private network addresses are refused). Subscribe to specific `enabled_events` or `*` for all. The signing secret (`whsec_…`) is returned **only in this response**: store it to verify `X-PletoPay-Signature`. You can have up to 16 endpoints per mode (`400 webhook_endpoint_limit_reached`).
         */
        post: operations["createWebhookEndpoint"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/webhook-endpoints/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve a webhook endpoint
         * @description Retrieve a webhook endpoint by id (`we_…`).
         */
        get: operations["getWebhookEndpoint"];
        put?: never;
        post?: never;
        /**
         * Delete a webhook endpoint (deliveries stop; history is kept)
         * @description Delete a webhook endpoint. Deliveries to it stop; its delivery history is kept.
         */
        delete: operations["deleteWebhookEndpoint"];
        options?: never;
        head?: never;
        /**
         * Update a webhook endpoint (re-enabling resets its health)
         * @description Change an endpoint’s URL, events or description, or disable and re-enable it. Re-enabling an endpoint that was auto-disabled after repeated failures resets its health.
         */
        patch: operations["updateWebhookEndpoint"];
        trace?: never;
    };
    "/api/v1/webhook-endpoints/{id}/rotate-secret": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Rotate the signing secret
         * @description Replace the endpoint’s signing secret. The new secret is returned only in this response, and deliveries are signed with it from now on.
         */
        post: operations["rotateWebhookSecret"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/webhook-endpoints/{id}/test": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Send a signed webhook.test event to this endpoint only
         * @description Send a signed `webhook.test` event to this endpoint only, to check your signature verification and connectivity. The endpoint must be enabled (`409 endpoint_disabled`). Test sends are limited per business (`429 rate_limited`, see `Retry-After`).
         */
        post: operations["testWebhookEndpoint"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/webhook-endpoints/{id}/deliveries": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Deliveries to this endpoint
         * @description Delivery attempts to this endpoint, with response status, error and timing. Filter by `status`.
         */
        get: operations["listEndpointDeliveries"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List events
         * @description List events, the same objects delivered to your webhooks. Filter by `type` or by `resource_id` (e.g. a payment id) to see everything that happened to one object. Use it to catch up after downtime.
         */
        get: operations["listEvents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/events/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve an event
         * @description Retrieve an event by id (`evt_…`).
         */
        get: operations["getEvent"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/events/{id}/deliveries": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Delivery history for an event
         * @description Every delivery of this event to your endpoints.
         */
        get: operations["listEventDeliveries"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/events/{id}/replay": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Re-deliver an event
         * @description Deliver an event again, to every endpoint subscribed to it or to one `endpoint`. The payload and `X-PletoPay-Event-ID` are unchanged, so your de-duplication still applies. Replays are limited per business (`429 rate_limited`, see `Retry-After`).
         */
        post: operations["replayEvent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/balance": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve your balances
         * @description Your balances in this mode, computed from the double-entry ledger:
         *
         *     - `available`: can be sent as transfers, refunds or settlements.
         *     - `pending`: received but not yet available.
         *     - `held`: on hold.
         *     - `unapplied`: received money under review.
         *     - `settling`: reserved by an open settlement.
         *     - `total`: the sum of the above. `settled_total`: the lifetime amount paid out by completed settlements.
         */
        get: operations["getBalance"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/transactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List ledger transactions
         * @description Every ledger journal that moved your balances, with its signed effect per balance (credits to you are positive) and the object that caused it. Filter by journal `type` or by `source`. Use it for reconciliation.
         */
        get: operations["listTransactions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/sandbox/simulate-transfer": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Simulate a customer bank transfer (test mode only)
         * @description **Test mode only** (`403 test_mode_only` with a live key). Simulate a transfer into one of your test virtual accounts, as a customer would make it.
         *
         *     The transfer then flows through the same pipeline as live money: the payment moves to `succeeded` and webhooks are sent. A wrong amount into an exact-amount account is refused (`400 simulation_rejected`), as a real transfer would be. An account that is not `active` (for example a one-time account that already received its payment) is refused before anything is sent (`409 virtual_account_not_active`). A `202` only means the simulation was accepted; watch the payment or its events for the outcome.
         */
        post: operations["simulateTransfer"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export interface webhooks {
    "payment.created": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * payment.created
         * @description A payment was created. Its account details may still be pending.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "payment.created",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *           "object": "payment",
                     *           "livemode": false,
                     *           "reference": "ORDER-12345",
                     *           "amount": 5000000,
                     *           "amount_received": 0,
                     *           "fee": 0,
                     *           "stamp_duty": 0,
                     *           "net_amount": 0,
                     *           "amount_refunded": 0,
                     *           "split": null,
                     *           "split_amount": 0,
                     *           "currency": "NGN",
                     *           "status": "created",
                     *           "payment_method": "bank_transfer",
                     *           "amount_rule": "exact",
                     *           "source": "api",
                     *           "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "bank_transfer": null,
                     *           "description": "Order #12345",
                     *           "metadata": {
                     *             "order_id": "12345"
                     *           },
                     *           "failure_reason": null,
                     *           "review_reason": null,
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "expires_at": "2026-09-24T18:30:00.000Z",
                     *           "succeeded_at": null
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_payment_created"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "payment.pending": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * payment.pending
         * @description The payment’s virtual account is ready: the customer can now transfer.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "payment.pending",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *           "object": "payment",
                     *           "livemode": false,
                     *           "reference": "ORDER-12345",
                     *           "amount": 5000000,
                     *           "amount_received": 0,
                     *           "fee": 0,
                     *           "stamp_duty": 0,
                     *           "net_amount": 0,
                     *           "amount_refunded": 0,
                     *           "split": null,
                     *           "split_amount": 0,
                     *           "currency": "NGN",
                     *           "status": "pending",
                     *           "payment_method": "bank_transfer",
                     *           "amount_rule": "exact",
                     *           "source": "api",
                     *           "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "bank_transfer": {
                     *             "account_number": "9000002140",
                     *             "account_name": "Ada Stores Ltd",
                     *             "bank_name": "Example Bank",
                     *             "bank_code": "090629",
                     *             "virtual_account": "va_01J8Z5X7Q9K2M4N6P8R0S2T4V8",
                     *             "expires_at": "2026-09-24T18:30:00.000Z"
                     *           },
                     *           "description": "Order #12345",
                     *           "metadata": {
                     *             "order_id": "12345"
                     *           },
                     *           "failure_reason": null,
                     *           "review_reason": null,
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "expires_at": "2026-09-24T18:30:00.000Z",
                     *           "succeeded_at": null
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_payment_pending"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "payment.succeeded": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * payment.succeeded
         * @description The customer’s transfer was confirmed. Fulfil the order (once, keyed by your reference).
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "payment.succeeded",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *           "object": "payment",
                     *           "livemode": false,
                     *           "reference": "ORDER-12345",
                     *           "amount": 5000000,
                     *           "amount_received": 5000000,
                     *           "fee": 50000,
                     *           "stamp_duty": 0,
                     *           "net_amount": 4950000,
                     *           "amount_refunded": 0,
                     *           "split": null,
                     *           "split_amount": 0,
                     *           "currency": "NGN",
                     *           "status": "succeeded",
                     *           "payment_method": "bank_transfer",
                     *           "amount_rule": "exact",
                     *           "source": "api",
                     *           "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "bank_transfer": {
                     *             "account_number": "9000002140",
                     *             "account_name": "Ada Stores Ltd",
                     *             "bank_name": "Example Bank",
                     *             "bank_code": "090629",
                     *             "virtual_account": "va_01J8Z5X7Q9K2M4N6P8R0S2T4V8",
                     *             "expires_at": "2026-09-24T18:30:00.000Z"
                     *           },
                     *           "description": "Order #12345",
                     *           "metadata": {
                     *             "order_id": "12345"
                     *           },
                     *           "failure_reason": null,
                     *           "review_reason": null,
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "expires_at": "2026-09-24T18:30:00.000Z",
                     *           "succeeded_at": "2026-09-24T18:04:12.000Z"
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_payment_succeeded"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "payment.failed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * payment.failed
         * @description The payment can no longer be paid: for example its virtual account could not be created, or it failed review.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "payment.failed",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *           "object": "payment",
                     *           "livemode": false,
                     *           "reference": "ORDER-12345",
                     *           "amount": 5000000,
                     *           "amount_received": 0,
                     *           "fee": 0,
                     *           "stamp_duty": 0,
                     *           "net_amount": 0,
                     *           "amount_refunded": 0,
                     *           "split": null,
                     *           "split_amount": 0,
                     *           "currency": "NGN",
                     *           "status": "failed",
                     *           "payment_method": "bank_transfer",
                     *           "amount_rule": "exact",
                     *           "source": "api",
                     *           "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "bank_transfer": {
                     *             "account_number": "9000002140",
                     *             "account_name": "Ada Stores Ltd",
                     *             "bank_name": "Example Bank",
                     *             "bank_code": "090629",
                     *             "virtual_account": "va_01J8Z5X7Q9K2M4N6P8R0S2T4V8",
                     *             "expires_at": "2026-09-24T18:30:00.000Z"
                     *           },
                     *           "description": "Order #12345",
                     *           "metadata": {
                     *             "order_id": "12345"
                     *           },
                     *           "failure_reason": null,
                     *           "review_reason": null,
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "expires_at": "2026-09-24T18:30:00.000Z",
                     *           "succeeded_at": null
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_payment_failed"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "payment.expired": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * payment.expired
         * @description The payment expired before any money arrived.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "payment.expired",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *           "object": "payment",
                     *           "livemode": false,
                     *           "reference": "ORDER-12345",
                     *           "amount": 5000000,
                     *           "amount_received": 0,
                     *           "fee": 0,
                     *           "stamp_duty": 0,
                     *           "net_amount": 0,
                     *           "amount_refunded": 0,
                     *           "split": null,
                     *           "split_amount": 0,
                     *           "currency": "NGN",
                     *           "status": "expired",
                     *           "payment_method": "bank_transfer",
                     *           "amount_rule": "exact",
                     *           "source": "api",
                     *           "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "bank_transfer": {
                     *             "account_number": "9000002140",
                     *             "account_name": "Ada Stores Ltd",
                     *             "bank_name": "Example Bank",
                     *             "bank_code": "090629",
                     *             "virtual_account": "va_01J8Z5X7Q9K2M4N6P8R0S2T4V8",
                     *             "expires_at": "2026-09-24T18:30:00.000Z"
                     *           },
                     *           "description": "Order #12345",
                     *           "metadata": {
                     *             "order_id": "12345"
                     *           },
                     *           "failure_reason": null,
                     *           "review_reason": null,
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "expires_at": "2026-09-24T18:30:00.000Z",
                     *           "succeeded_at": null
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_payment_expired"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "payment.under_review": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * payment.under_review
         * @description Money arrived but needs review (the wrong amount, or it arrived after the payment expired). It is held in your unapplied balance until reviewed; it is never silently accepted or dropped.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "payment.under_review",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *           "object": "payment",
                     *           "livemode": false,
                     *           "reference": "ORDER-12345",
                     *           "amount": 5000000,
                     *           "amount_received": 0,
                     *           "fee": 0,
                     *           "stamp_duty": 0,
                     *           "net_amount": 0,
                     *           "amount_refunded": 0,
                     *           "split": null,
                     *           "split_amount": 0,
                     *           "currency": "NGN",
                     *           "status": "under_review",
                     *           "payment_method": "bank_transfer",
                     *           "amount_rule": "exact",
                     *           "source": "api",
                     *           "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "bank_transfer": {
                     *             "account_number": "9000002140",
                     *             "account_name": "Ada Stores Ltd",
                     *             "bank_name": "Example Bank",
                     *             "bank_code": "090629",
                     *             "virtual_account": "va_01J8Z5X7Q9K2M4N6P8R0S2T4V8",
                     *             "expires_at": "2026-09-24T18:30:00.000Z"
                     *           },
                     *           "description": "Order #12345",
                     *           "metadata": {
                     *             "order_id": "12345"
                     *           },
                     *           "failure_reason": null,
                     *           "review_reason": null,
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "expires_at": "2026-09-24T18:30:00.000Z",
                     *           "succeeded_at": null
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_payment_under_review"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "payment.reversed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * payment.reversed
         * @description A succeeded payment was reversed.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "payment.reversed",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *           "object": "payment",
                     *           "livemode": false,
                     *           "reference": "ORDER-12345",
                     *           "amount": 5000000,
                     *           "amount_received": 0,
                     *           "fee": 0,
                     *           "stamp_duty": 0,
                     *           "net_amount": 0,
                     *           "amount_refunded": 0,
                     *           "split": null,
                     *           "split_amount": 0,
                     *           "currency": "NGN",
                     *           "status": "reversed",
                     *           "payment_method": "bank_transfer",
                     *           "amount_rule": "exact",
                     *           "source": "api",
                     *           "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "bank_transfer": {
                     *             "account_number": "9000002140",
                     *             "account_name": "Ada Stores Ltd",
                     *             "bank_name": "Example Bank",
                     *             "bank_code": "090629",
                     *             "virtual_account": "va_01J8Z5X7Q9K2M4N6P8R0S2T4V8",
                     *             "expires_at": "2026-09-24T18:30:00.000Z"
                     *           },
                     *           "description": "Order #12345",
                     *           "metadata": {
                     *             "order_id": "12345"
                     *           },
                     *           "failure_reason": null,
                     *           "review_reason": null,
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "expires_at": "2026-09-24T18:30:00.000Z",
                     *           "succeeded_at": null
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_payment_reversed"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "payment.partially_refunded": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * payment.partially_refunded
         * @description A refund of part of the payment was paid out.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "payment.partially_refunded",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *           "object": "payment",
                     *           "livemode": false,
                     *           "reference": "ORDER-12345",
                     *           "amount": 5000000,
                     *           "amount_received": 0,
                     *           "fee": 0,
                     *           "stamp_duty": 0,
                     *           "net_amount": 0,
                     *           "amount_refunded": 0,
                     *           "split": null,
                     *           "split_amount": 0,
                     *           "currency": "NGN",
                     *           "status": "partially_refunded",
                     *           "payment_method": "bank_transfer",
                     *           "amount_rule": "exact",
                     *           "source": "api",
                     *           "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "bank_transfer": {
                     *             "account_number": "9000002140",
                     *             "account_name": "Ada Stores Ltd",
                     *             "bank_name": "Example Bank",
                     *             "bank_code": "090629",
                     *             "virtual_account": "va_01J8Z5X7Q9K2M4N6P8R0S2T4V8",
                     *             "expires_at": "2026-09-24T18:30:00.000Z"
                     *           },
                     *           "description": "Order #12345",
                     *           "metadata": {
                     *             "order_id": "12345"
                     *           },
                     *           "failure_reason": null,
                     *           "review_reason": null,
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "expires_at": "2026-09-24T18:30:00.000Z",
                     *           "succeeded_at": null
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_payment_partially_refunded"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "payment.refunded": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * payment.refunded
         * @description The payment was refunded in full.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "payment.refunded",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *           "object": "payment",
                     *           "livemode": false,
                     *           "reference": "ORDER-12345",
                     *           "amount": 5000000,
                     *           "amount_received": 0,
                     *           "fee": 0,
                     *           "stamp_duty": 0,
                     *           "net_amount": 0,
                     *           "amount_refunded": 0,
                     *           "split": null,
                     *           "split_amount": 0,
                     *           "currency": "NGN",
                     *           "status": "refunded",
                     *           "payment_method": "bank_transfer",
                     *           "amount_rule": "exact",
                     *           "source": "api",
                     *           "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "bank_transfer": {
                     *             "account_number": "9000002140",
                     *             "account_name": "Ada Stores Ltd",
                     *             "bank_name": "Example Bank",
                     *             "bank_code": "090629",
                     *             "virtual_account": "va_01J8Z5X7Q9K2M4N6P8R0S2T4V8",
                     *             "expires_at": "2026-09-24T18:30:00.000Z"
                     *           },
                     *           "description": "Order #12345",
                     *           "metadata": {
                     *             "order_id": "12345"
                     *           },
                     *           "failure_reason": null,
                     *           "review_reason": null,
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "expires_at": "2026-09-24T18:30:00.000Z",
                     *           "succeeded_at": null
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_payment_refunded"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "virtual_account.created": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * virtual_account.created
         * @description A virtual account became active.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "virtual_account.created",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "va_01J8Z5X7Q9K2M4N6P8R0S2T4V8",
                     *           "object": "virtual_account",
                     *           "livemode": false,
                     *           "type": "dedicated",
                     *           "status": "active",
                     *           "account_number": "9000002140",
                     *           "account_name": "Ada Stores Ltd",
                     *           "bank_name": "Example Bank",
                     *           "bank_code": "090629",
                     *           "currency": "NGN",
                     *           "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "payment": null,
                     *           "expected_amount": null,
                     *           "amount_rule": "any",
                     *           "single_use": false,
                     *           "expires_at": null,
                     *           "closed_at": null,
                     *           "metadata": {
                     *             "plan": "wallet"
                     *           },
                     *           "created_at": "2026-09-24T18:00:00.000Z"
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_virtual_account_created"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "virtual_account.updated": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * virtual_account.updated
         * @description A virtual account changed status.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "virtual_account.updated",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "va_01J8Z5X7Q9K2M4N6P8R0S2T4V8",
                     *           "object": "virtual_account",
                     *           "livemode": false,
                     *           "type": "dedicated",
                     *           "status": "active",
                     *           "account_number": "9000002140",
                     *           "account_name": "Ada Stores Ltd",
                     *           "bank_name": "Example Bank",
                     *           "bank_code": "090629",
                     *           "currency": "NGN",
                     *           "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "payment": null,
                     *           "expected_amount": null,
                     *           "amount_rule": "any",
                     *           "single_use": false,
                     *           "expires_at": null,
                     *           "closed_at": null,
                     *           "metadata": {
                     *             "plan": "wallet"
                     *           },
                     *           "created_at": "2026-09-24T18:00:00.000Z"
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_virtual_account_updated"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "virtual_account.closed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * virtual_account.closed
         * @description A virtual account was closed.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "virtual_account.closed",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "va_01J8Z5X7Q9K2M4N6P8R0S2T4V8",
                     *           "object": "virtual_account",
                     *           "livemode": false,
                     *           "type": "dedicated",
                     *           "status": "active",
                     *           "account_number": "9000002140",
                     *           "account_name": "Ada Stores Ltd",
                     *           "bank_name": "Example Bank",
                     *           "bank_code": "090629",
                     *           "currency": "NGN",
                     *           "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "payment": null,
                     *           "expected_amount": null,
                     *           "amount_rule": "any",
                     *           "single_use": false,
                     *           "expires_at": null,
                     *           "closed_at": null,
                     *           "metadata": {
                     *             "plan": "wallet"
                     *           },
                     *           "created_at": "2026-09-24T18:00:00.000Z"
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_virtual_account_closed"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "transfer.created": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * transfer.created
         * @description A transfer was created and its funds reserved.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "transfer.created",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "trf_01J8Z5X7Q9K2M4N6P8R0S2T4W0",
                     *           "object": "transfer",
                     *           "livemode": false,
                     *           "reference": "PAYOUT-2026-0001",
                     *           "amount": 2500000,
                     *           "fee": 1500,
                     *           "total_debit": 2501500,
                     *           "currency": "NGN",
                     *           "status": "pending",
                     *           "beneficiary": {
                     *             "bank_code": "058",
                     *             "bank_name": "string",
                     *             "account_number": "0123456789",
                     *             "account_name": "ADA VENDOR ENTERPRISES"
                     *           },
                     *           "narration": "Vendor payout September",
                     *           "session_id": null,
                     *           "failure_reason": null,
                     *           "metadata": {
                     *             "vendor_id": "v_204"
                     *           },
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "completed_at": null
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_transfer_created"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "transfer.processing": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * transfer.processing
         * @description A transfer was sent for processing; the outcome is not yet known.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "transfer.processing",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "trf_01J8Z5X7Q9K2M4N6P8R0S2T4W0",
                     *           "object": "transfer",
                     *           "livemode": false,
                     *           "reference": "PAYOUT-2026-0001",
                     *           "amount": 2500000,
                     *           "fee": 1500,
                     *           "total_debit": 2501500,
                     *           "currency": "NGN",
                     *           "status": "processing",
                     *           "beneficiary": {
                     *             "bank_code": "058",
                     *             "bank_name": "string",
                     *             "account_number": "0123456789",
                     *             "account_name": "ADA VENDOR ENTERPRISES"
                     *           },
                     *           "narration": "Vendor payout September",
                     *           "session_id": null,
                     *           "failure_reason": null,
                     *           "metadata": {
                     *             "vendor_id": "v_204"
                     *           },
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "completed_at": null
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_transfer_processing"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "transfer.succeeded": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * transfer.succeeded
         * @description The transfer was confirmed as received by the beneficiary.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "transfer.succeeded",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "trf_01J8Z5X7Q9K2M4N6P8R0S2T4W0",
                     *           "object": "transfer",
                     *           "livemode": false,
                     *           "reference": "PAYOUT-2026-0001",
                     *           "amount": 2500000,
                     *           "fee": 1500,
                     *           "total_debit": 2501500,
                     *           "currency": "NGN",
                     *           "status": "processing",
                     *           "beneficiary": {
                     *             "bank_code": "058",
                     *             "bank_name": "string",
                     *             "account_number": "0123456789",
                     *             "account_name": "ADA VENDOR ENTERPRISES"
                     *           },
                     *           "narration": "Vendor payout September",
                     *           "session_id": null,
                     *           "failure_reason": null,
                     *           "metadata": {
                     *             "vendor_id": "v_204"
                     *           },
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "completed_at": null
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_transfer_succeeded"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "transfer.failed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * transfer.failed
         * @description The transfer was confirmed as failed. The reserved funds were released.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "transfer.failed",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "trf_01J8Z5X7Q9K2M4N6P8R0S2T4W0",
                     *           "object": "transfer",
                     *           "livemode": false,
                     *           "reference": "PAYOUT-2026-0001",
                     *           "amount": 2500000,
                     *           "fee": 1500,
                     *           "total_debit": 2501500,
                     *           "currency": "NGN",
                     *           "status": "processing",
                     *           "beneficiary": {
                     *             "bank_code": "058",
                     *             "bank_name": "string",
                     *             "account_number": "0123456789",
                     *             "account_name": "ADA VENDOR ENTERPRISES"
                     *           },
                     *           "narration": "Vendor payout September",
                     *           "session_id": null,
                     *           "failure_reason": null,
                     *           "metadata": {
                     *             "vendor_id": "v_204"
                     *           },
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "completed_at": null
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_transfer_failed"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "transfer.reversed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * transfer.reversed
         * @description A succeeded transfer was reversed.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "transfer.reversed",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "trf_01J8Z5X7Q9K2M4N6P8R0S2T4W0",
                     *           "object": "transfer",
                     *           "livemode": false,
                     *           "reference": "PAYOUT-2026-0001",
                     *           "amount": 2500000,
                     *           "fee": 1500,
                     *           "total_debit": 2501500,
                     *           "currency": "NGN",
                     *           "status": "processing",
                     *           "beneficiary": {
                     *             "bank_code": "058",
                     *             "bank_name": "string",
                     *             "account_number": "0123456789",
                     *             "account_name": "ADA VENDOR ENTERPRISES"
                     *           },
                     *           "narration": "Vendor payout September",
                     *           "session_id": null,
                     *           "failure_reason": null,
                     *           "metadata": {
                     *             "vendor_id": "v_204"
                     *           },
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "completed_at": null
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_transfer_reversed"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "settlement.created": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * settlement.created
         * @description A settlement of your available balance was opened.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "settlement.created",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "stl_01J8Z5X7Q9K2M4N6P8R0S2T4WC",
                     *           "object": "settlement",
                     *           "livemode": false,
                     *           "subaccount": null,
                     *           "status": "pending",
                     *           "trigger": "scheduled",
                     *           "amount": 31480000,
                     *           "fee": 0,
                     *           "transfer_fee": 1500,
                     *           "transfer_fee_vat": 113,
                     *           "stamp_duty": 5000,
                     *           "total_deducted": 31486613,
                     *           "reserve_retained": 0,
                     *           "currency": "NGN",
                     *           "settlement_account": {
                     *             "id": "sta_01J8Z5X7Q9K2M4N6P8R0S2T4WD",
                     *             "bank_code": "058",
                     *             "bank_name": "string",
                     *             "account_number_last4": "4321",
                     *             "account_name": "ADA STORES LTD"
                     *           },
                     *           "transfer": {
                     *             "status": "succeeded",
                     *             "session_id": "090629260924180412000000000001"
                     *           },
                     *           "failure_reason": null,
                     *           "cutoff_at": "2026-09-24T18:00:00.000Z",
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "completed_at": "2026-09-24T18:04:12.000Z"
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_settlement_created"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "settlement.completed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * settlement.completed
         * @description A settlement was paid into your settlement account.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "settlement.completed",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "stl_01J8Z5X7Q9K2M4N6P8R0S2T4WC",
                     *           "object": "settlement",
                     *           "livemode": false,
                     *           "subaccount": null,
                     *           "status": "completed",
                     *           "trigger": "scheduled",
                     *           "amount": 31480000,
                     *           "fee": 0,
                     *           "transfer_fee": 1500,
                     *           "transfer_fee_vat": 113,
                     *           "stamp_duty": 5000,
                     *           "total_deducted": 31486613,
                     *           "reserve_retained": 0,
                     *           "currency": "NGN",
                     *           "settlement_account": {
                     *             "id": "sta_01J8Z5X7Q9K2M4N6P8R0S2T4WD",
                     *             "bank_code": "058",
                     *             "bank_name": "string",
                     *             "account_number_last4": "4321",
                     *             "account_name": "ADA STORES LTD"
                     *           },
                     *           "transfer": {
                     *             "status": "succeeded",
                     *             "session_id": "090629260924180412000000000001"
                     *           },
                     *           "failure_reason": null,
                     *           "cutoff_at": "2026-09-24T18:00:00.000Z",
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "completed_at": "2026-09-24T18:04:12.000Z"
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_settlement_completed"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "settlement.failed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * settlement.failed
         * @description A settlement payout failed. The funds were returned to your available balance.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "settlement.failed",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "stl_01J8Z5X7Q9K2M4N6P8R0S2T4WC",
                     *           "object": "settlement",
                     *           "livemode": false,
                     *           "subaccount": null,
                     *           "status": "completed",
                     *           "trigger": "scheduled",
                     *           "amount": 31480000,
                     *           "fee": 0,
                     *           "transfer_fee": 1500,
                     *           "transfer_fee_vat": 113,
                     *           "stamp_duty": 5000,
                     *           "total_deducted": 31486613,
                     *           "reserve_retained": 0,
                     *           "currency": "NGN",
                     *           "settlement_account": {
                     *             "id": "sta_01J8Z5X7Q9K2M4N6P8R0S2T4WD",
                     *             "bank_code": "058",
                     *             "bank_name": "string",
                     *             "account_number_last4": "4321",
                     *             "account_name": "ADA STORES LTD"
                     *           },
                     *           "transfer": {
                     *             "status": "succeeded",
                     *             "session_id": "090629260924180412000000000001"
                     *           },
                     *           "failure_reason": null,
                     *           "cutoff_at": "2026-09-24T18:00:00.000Z",
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "completed_at": "2026-09-24T18:04:12.000Z"
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_settlement_failed"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "refund.created": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * refund.created
         * @description A refund was created and its funds reserved.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "refund.created",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "re_01J8Z5X7Q9K2M4N6P8R0S2T4W1",
                     *           "object": "refund",
                     *           "livemode": false,
                     *           "payment": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *           "reference": "RFND-12345",
                     *           "amount": 1000000,
                     *           "fee": 1500,
                     *           "currency": "NGN",
                     *           "reason": "Customer returned the item",
                     *           "status": "pending",
                     *           "destination": {
                     *             "bank_code": "058",
                     *             "bank_name": "string",
                     *             "account_number_last4": "6789",
                     *             "account_name": "CHIDI OKEKE"
                     *           },
                     *           "transfer": {
                     *             "status": "processing",
                     *             "session_id": null
                     *           },
                     *           "failure_reason": null,
                     *           "metadata": {},
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "completed_at": null
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_refund_created"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "refund.succeeded": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * refund.succeeded
         * @description A refund was paid out to the customer.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "refund.succeeded",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "re_01J8Z5X7Q9K2M4N6P8R0S2T4W1",
                     *           "object": "refund",
                     *           "livemode": false,
                     *           "payment": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *           "reference": "RFND-12345",
                     *           "amount": 1000000,
                     *           "fee": 1500,
                     *           "currency": "NGN",
                     *           "reason": "Customer returned the item",
                     *           "status": "processing",
                     *           "destination": {
                     *             "bank_code": "058",
                     *             "bank_name": "string",
                     *             "account_number_last4": "6789",
                     *             "account_name": "CHIDI OKEKE"
                     *           },
                     *           "transfer": {
                     *             "status": "processing",
                     *             "session_id": null
                     *           },
                     *           "failure_reason": null,
                     *           "metadata": {},
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "completed_at": null
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_refund_succeeded"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "refund.failed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * refund.failed
         * @description A refund payout failed. The funds were released.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "refund.failed",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "re_01J8Z5X7Q9K2M4N6P8R0S2T4W1",
                     *           "object": "refund",
                     *           "livemode": false,
                     *           "payment": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *           "reference": "RFND-12345",
                     *           "amount": 1000000,
                     *           "fee": 1500,
                     *           "currency": "NGN",
                     *           "reason": "Customer returned the item",
                     *           "status": "processing",
                     *           "destination": {
                     *             "bank_code": "058",
                     *             "bank_name": "string",
                     *             "account_number_last4": "6789",
                     *             "account_name": "CHIDI OKEKE"
                     *           },
                     *           "transfer": {
                     *             "status": "processing",
                     *             "session_id": null
                     *           },
                     *           "failure_reason": null,
                     *           "metadata": {},
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "completed_at": null
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_refund_failed"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "checkout.session.completed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * checkout.session.completed
         * @description The checkout session’s payment succeeded.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "checkout.session.completed",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "cs_01J8Z5X7Q9K2M4N6P8R0S2T4W3",
                     *           "object": "checkout_session",
                     *           "livemode": false,
                     *           "status": "complete",
                     *           "url": "https://checkout.pletopay.com/c/u5Qm2x9Lk3Rt8Wv1Yz4Ab7Cd0Ef6Gh2J",
                     *           "amount": 5000000,
                     *           "currency": "NGN",
                     *           "reference": "ORDER-12345",
                     *           "description": "Order #12345",
                     *           "customer": null,
                     *           "customer_email": "customer@example.com",
                     *           "payment": null,
                     *           "payment_link": null,
                     *           "invoice": null,
                     *           "split": null,
                     *           "payment_method_types": [
                     *             "bank_transfer"
                     *           ],
                     *           "success_url": "https://example.com/orders/12345/thanks",
                     *           "cancel_url": "https://example.com/cart",
                     *           "metadata": {
                     *             "order_id": "12345"
                     *           },
                     *           "expires_at": "2026-09-24T19:00:00.000Z",
                     *           "completed_at": null,
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "token": "u5Qm2x9Lk3Rt8Wv1Yz4Ab7Cd0Ef6Gh2J"
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_checkout_session_completed"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "checkout.session.expired": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * checkout.session.expired
         * @description The checkout session expired unpaid, or you expired it.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "checkout.session.expired",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "cs_01J8Z5X7Q9K2M4N6P8R0S2T4W3",
                     *           "object": "checkout_session",
                     *           "livemode": false,
                     *           "status": "open",
                     *           "url": "https://checkout.pletopay.com/c/u5Qm2x9Lk3Rt8Wv1Yz4Ab7Cd0Ef6Gh2J",
                     *           "amount": 5000000,
                     *           "currency": "NGN",
                     *           "reference": "ORDER-12345",
                     *           "description": "Order #12345",
                     *           "customer": null,
                     *           "customer_email": "customer@example.com",
                     *           "payment": null,
                     *           "payment_link": null,
                     *           "invoice": null,
                     *           "split": null,
                     *           "payment_method_types": [
                     *             "bank_transfer"
                     *           ],
                     *           "success_url": "https://example.com/orders/12345/thanks",
                     *           "cancel_url": "https://example.com/cart",
                     *           "metadata": {
                     *             "order_id": "12345"
                     *           },
                     *           "expires_at": "2026-09-24T19:00:00.000Z",
                     *           "completed_at": null,
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "token": "u5Qm2x9Lk3Rt8Wv1Yz4Ab7Cd0Ef6Gh2J"
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_checkout_session_expired"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "invoice.created": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * invoice.created
         * @description A draft invoice was created.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "invoice.created",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "inv_01J8Z5X7Q9K2M4N6P8R0S2T4W5",
                     *           "object": "invoice",
                     *           "livemode": false,
                     *           "number": "INV-000042",
                     *           "status": "draft",
                     *           "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "currency": "NGN",
                     *           "items": [
                     *             {
                     *               "description": "Website design",
                     *               "quantity": 1,
                     *               "unit_amount": 15000000,
                     *               "amount": 15000000
                     *             },
                     *             {
                     *               "description": "Hosting (12 months)",
                     *               "quantity": 1,
                     *               "unit_amount": 3000000,
                     *               "amount": 3000000
                     *             }
                     *           ],
                     *           "taxes": [
                     *             {
                     *               "name": "VAT",
                     *               "bps": 750,
                     *               "amount": 1350000
                     *             }
                     *           ],
                     *           "subtotal": 18000000,
                     *           "tax_amount": 1350000,
                     *           "total": 19350000,
                     *           "amount_paid": 0,
                     *           "amount_due": 19350000,
                     *           "memo": "Thank you for your business.",
                     *           "due_date": "2026-10-15T00:00:00.000Z",
                     *           "hosted_invoice_url": "https://checkout.pletopay.com/i/inv_tok_example",
                     *           "payment": null,
                     *           "split": null,
                     *           "subscription": null,
                     *           "period_start": null,
                     *           "period_end": null,
                     *           "metadata": {},
                     *           "finalized_at": "2026-09-24T18:04:12.000Z",
                     *           "paid_at": null,
                     *           "voided_at": null,
                     *           "created_at": "2026-09-24T18:00:00.000Z"
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_invoice_created"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "invoice.finalized": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * invoice.finalized
         * @description An invoice was finalized and can now be paid.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "invoice.finalized",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "inv_01J8Z5X7Q9K2M4N6P8R0S2T4W5",
                     *           "object": "invoice",
                     *           "livemode": false,
                     *           "number": "INV-000042",
                     *           "status": "open",
                     *           "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "currency": "NGN",
                     *           "items": [
                     *             {
                     *               "description": "Website design",
                     *               "quantity": 1,
                     *               "unit_amount": 15000000,
                     *               "amount": 15000000
                     *             },
                     *             {
                     *               "description": "Hosting (12 months)",
                     *               "quantity": 1,
                     *               "unit_amount": 3000000,
                     *               "amount": 3000000
                     *             }
                     *           ],
                     *           "taxes": [
                     *             {
                     *               "name": "VAT",
                     *               "bps": 750,
                     *               "amount": 1350000
                     *             }
                     *           ],
                     *           "subtotal": 18000000,
                     *           "tax_amount": 1350000,
                     *           "total": 19350000,
                     *           "amount_paid": 0,
                     *           "amount_due": 19350000,
                     *           "memo": "Thank you for your business.",
                     *           "due_date": "2026-10-15T00:00:00.000Z",
                     *           "hosted_invoice_url": "https://checkout.pletopay.com/i/inv_tok_example",
                     *           "payment": null,
                     *           "split": null,
                     *           "subscription": null,
                     *           "period_start": null,
                     *           "period_end": null,
                     *           "metadata": {},
                     *           "finalized_at": "2026-09-24T18:04:12.000Z",
                     *           "paid_at": null,
                     *           "voided_at": null,
                     *           "created_at": "2026-09-24T18:00:00.000Z"
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_invoice_finalized"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "invoice.paid": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * invoice.paid
         * @description An invoice was paid in full.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "invoice.paid",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "inv_01J8Z5X7Q9K2M4N6P8R0S2T4W5",
                     *           "object": "invoice",
                     *           "livemode": false,
                     *           "number": "INV-000042",
                     *           "status": "open",
                     *           "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "currency": "NGN",
                     *           "items": [
                     *             {
                     *               "description": "Website design",
                     *               "quantity": 1,
                     *               "unit_amount": 15000000,
                     *               "amount": 15000000
                     *             },
                     *             {
                     *               "description": "Hosting (12 months)",
                     *               "quantity": 1,
                     *               "unit_amount": 3000000,
                     *               "amount": 3000000
                     *             }
                     *           ],
                     *           "taxes": [
                     *             {
                     *               "name": "VAT",
                     *               "bps": 750,
                     *               "amount": 1350000
                     *             }
                     *           ],
                     *           "subtotal": 18000000,
                     *           "tax_amount": 1350000,
                     *           "total": 19350000,
                     *           "amount_paid": 0,
                     *           "amount_due": 19350000,
                     *           "memo": "Thank you for your business.",
                     *           "due_date": "2026-10-15T00:00:00.000Z",
                     *           "hosted_invoice_url": "https://checkout.pletopay.com/i/inv_tok_example",
                     *           "payment": null,
                     *           "split": null,
                     *           "subscription": null,
                     *           "period_start": null,
                     *           "period_end": null,
                     *           "metadata": {},
                     *           "finalized_at": "2026-09-24T18:04:12.000Z",
                     *           "paid_at": null,
                     *           "voided_at": null,
                     *           "created_at": "2026-09-24T18:00:00.000Z"
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_invoice_paid"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "invoice.voided": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * invoice.voided
         * @description An invoice was voided.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "invoice.voided",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "inv_01J8Z5X7Q9K2M4N6P8R0S2T4W5",
                     *           "object": "invoice",
                     *           "livemode": false,
                     *           "number": "INV-000042",
                     *           "status": "void",
                     *           "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "currency": "NGN",
                     *           "items": [
                     *             {
                     *               "description": "Website design",
                     *               "quantity": 1,
                     *               "unit_amount": 15000000,
                     *               "amount": 15000000
                     *             },
                     *             {
                     *               "description": "Hosting (12 months)",
                     *               "quantity": 1,
                     *               "unit_amount": 3000000,
                     *               "amount": 3000000
                     *             }
                     *           ],
                     *           "taxes": [
                     *             {
                     *               "name": "VAT",
                     *               "bps": 750,
                     *               "amount": 1350000
                     *             }
                     *           ],
                     *           "subtotal": 18000000,
                     *           "tax_amount": 1350000,
                     *           "total": 19350000,
                     *           "amount_paid": 0,
                     *           "amount_due": 19350000,
                     *           "memo": "Thank you for your business.",
                     *           "due_date": "2026-10-15T00:00:00.000Z",
                     *           "hosted_invoice_url": "https://checkout.pletopay.com/i/inv_tok_example",
                     *           "payment": null,
                     *           "split": null,
                     *           "subscription": null,
                     *           "period_start": null,
                     *           "period_end": null,
                     *           "metadata": {},
                     *           "finalized_at": "2026-09-24T18:04:12.000Z",
                     *           "paid_at": null,
                     *           "voided_at": null,
                     *           "created_at": "2026-09-24T18:00:00.000Z"
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_invoice_voided"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "invoice.marked_uncollectible": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * invoice.marked_uncollectible
         * @description An invoice was marked uncollectible.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "invoice.marked_uncollectible",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "inv_01J8Z5X7Q9K2M4N6P8R0S2T4W5",
                     *           "object": "invoice",
                     *           "livemode": false,
                     *           "number": "INV-000042",
                     *           "status": "uncollectible",
                     *           "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "currency": "NGN",
                     *           "items": [
                     *             {
                     *               "description": "Website design",
                     *               "quantity": 1,
                     *               "unit_amount": 15000000,
                     *               "amount": 15000000
                     *             },
                     *             {
                     *               "description": "Hosting (12 months)",
                     *               "quantity": 1,
                     *               "unit_amount": 3000000,
                     *               "amount": 3000000
                     *             }
                     *           ],
                     *           "taxes": [
                     *             {
                     *               "name": "VAT",
                     *               "bps": 750,
                     *               "amount": 1350000
                     *             }
                     *           ],
                     *           "subtotal": 18000000,
                     *           "tax_amount": 1350000,
                     *           "total": 19350000,
                     *           "amount_paid": 0,
                     *           "amount_due": 19350000,
                     *           "memo": "Thank you for your business.",
                     *           "due_date": "2026-10-15T00:00:00.000Z",
                     *           "hosted_invoice_url": "https://checkout.pletopay.com/i/inv_tok_example",
                     *           "payment": null,
                     *           "split": null,
                     *           "subscription": null,
                     *           "period_start": null,
                     *           "period_end": null,
                     *           "metadata": {},
                     *           "finalized_at": "2026-09-24T18:04:12.000Z",
                     *           "paid_at": null,
                     *           "voided_at": null,
                     *           "created_at": "2026-09-24T18:00:00.000Z"
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_invoice_marked_uncollectible"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "subscription.created": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * subscription.created
         * @description A customer subscribed to a plan.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "subscription.created",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "sbs_01J8Z5X7Q9K2M4N6P8R0S2T4W7",
                     *           "object": "subscription",
                     *           "livemode": false,
                     *           "status": "active",
                     *           "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "plan": "plan_01J8Z5X7Q9K2M4N6P8R0S2T4VA",
                     *           "collection_method": "invoice",
                     *           "dedicated_account": null,
                     *           "days_until_due": 7,
                     *           "current_period_start": "2026-09-24T18:00:00.000Z",
                     *           "current_period_end": "2026-10-24T18:00:00.000Z",
                     *           "next_invoice_at": "2026-10-24T18:00:00.000Z",
                     *           "latest_invoice": "inv_01J8Z5X7Q9K2M4N6P8R0S2T4W5",
                     *           "cancel_at_period_end": false,
                     *           "canceled_at": null,
                     *           "cancel_reason": null,
                     *           "metadata": {},
                     *           "created_at": "2026-09-24T18:00:00.000Z"
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_subscription_created"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "subscription.updated": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * subscription.updated
         * @description A subscription changed status or its cancellation settings.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "subscription.updated",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "sbs_01J8Z5X7Q9K2M4N6P8R0S2T4W7",
                     *           "object": "subscription",
                     *           "livemode": false,
                     *           "status": "active",
                     *           "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "plan": "plan_01J8Z5X7Q9K2M4N6P8R0S2T4VA",
                     *           "collection_method": "invoice",
                     *           "dedicated_account": null,
                     *           "days_until_due": 7,
                     *           "current_period_start": "2026-09-24T18:00:00.000Z",
                     *           "current_period_end": "2026-10-24T18:00:00.000Z",
                     *           "next_invoice_at": "2026-10-24T18:00:00.000Z",
                     *           "latest_invoice": "inv_01J8Z5X7Q9K2M4N6P8R0S2T4W5",
                     *           "cancel_at_period_end": false,
                     *           "canceled_at": null,
                     *           "cancel_reason": null,
                     *           "metadata": {},
                     *           "created_at": "2026-09-24T18:00:00.000Z"
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_subscription_updated"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "subscription.past_due": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * subscription.past_due
         * @description A subscription’s invoice passed its due date unpaid.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "subscription.past_due",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "sbs_01J8Z5X7Q9K2M4N6P8R0S2T4W7",
                     *           "object": "subscription",
                     *           "livemode": false,
                     *           "status": "active",
                     *           "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "plan": "plan_01J8Z5X7Q9K2M4N6P8R0S2T4VA",
                     *           "collection_method": "invoice",
                     *           "dedicated_account": null,
                     *           "days_until_due": 7,
                     *           "current_period_start": "2026-09-24T18:00:00.000Z",
                     *           "current_period_end": "2026-10-24T18:00:00.000Z",
                     *           "next_invoice_at": "2026-10-24T18:00:00.000Z",
                     *           "latest_invoice": "inv_01J8Z5X7Q9K2M4N6P8R0S2T4W5",
                     *           "cancel_at_period_end": false,
                     *           "canceled_at": null,
                     *           "cancel_reason": null,
                     *           "metadata": {},
                     *           "created_at": "2026-09-24T18:00:00.000Z"
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_subscription_past_due"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "subscription.canceled": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * subscription.canceled
         * @description A subscription was canceled.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "subscription.canceled",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "sbs_01J8Z5X7Q9K2M4N6P8R0S2T4W7",
                     *           "object": "subscription",
                     *           "livemode": false,
                     *           "status": "active",
                     *           "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "plan": "plan_01J8Z5X7Q9K2M4N6P8R0S2T4VA",
                     *           "collection_method": "invoice",
                     *           "dedicated_account": null,
                     *           "days_until_due": 7,
                     *           "current_period_start": "2026-09-24T18:00:00.000Z",
                     *           "current_period_end": "2026-10-24T18:00:00.000Z",
                     *           "next_invoice_at": "2026-10-24T18:00:00.000Z",
                     *           "latest_invoice": "inv_01J8Z5X7Q9K2M4N6P8R0S2T4W5",
                     *           "cancel_at_period_end": false,
                     *           "canceled_at": null,
                     *           "cancel_reason": null,
                     *           "metadata": {},
                     *           "created_at": "2026-09-24T18:00:00.000Z"
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_subscription_canceled"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "report.ready": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * report.ready
         * @description A report finished and can be downloaded.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "report.ready",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "rpt_01J8Z5X7Q9K2M4N6P8R0S2T4W8",
                     *           "object": "report",
                     *           "livemode": false,
                     *           "type": "payments",
                     *           "status": "succeeded",
                     *           "period_start": "2026-09-01T00:00:00.000Z",
                     *           "period_end": "2026-10-01T00:00:00.000Z",
                     *           "format": "csv",
                     *           "row_count": 1284,
                     *           "size_bytes": 402118,
                     *           "sha256": "9f2b5c0d7e1a4b3c8d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c",
                     *           "download_url": "/api/v1/reports/rpt_01J8Z5X7Q9K2M4N6P8R0S2T4W8/download",
                     *           "error": null,
                     *           "expires_at": "2026-10-24T18:00:00.000Z",
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "completed_at": "2026-09-24T18:04:12.000Z"
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_report_ready"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "report.failed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * report.failed
         * @description A report could not be generated.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "report.failed",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "rpt_01J8Z5X7Q9K2M4N6P8R0S2T4W8",
                     *           "object": "report",
                     *           "livemode": false,
                     *           "type": "payments",
                     *           "status": "succeeded",
                     *           "period_start": "2026-09-01T00:00:00.000Z",
                     *           "period_end": "2026-10-01T00:00:00.000Z",
                     *           "format": "csv",
                     *           "row_count": 1284,
                     *           "size_bytes": 402118,
                     *           "sha256": "9f2b5c0d7e1a4b3c8d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c",
                     *           "download_url": "/api/v1/reports/rpt_01J8Z5X7Q9K2M4N6P8R0S2T4W8/download",
                     *           "error": null,
                     *           "expires_at": "2026-10-24T18:00:00.000Z",
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "completed_at": "2026-09-24T18:04:12.000Z"
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_report_failed"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "risk.event_flagged": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * risk.event_flagged
         * @description Activity was flagged or blocked by your risk rules.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "risk.event_flagged",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "id": "rsk_01J8Z5X7Q9K2M4N6P8R0S2T4W6",
                     *           "object": "risk_event",
                     *           "livemode": false,
                     *           "type": "high_value_payment",
                     *           "severity": "medium",
                     *           "action": "flagged",
                     *           "rule": "high_value_payment",
                     *           "subject": {
                     *             "type": "payment",
                     *             "id": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6"
                     *           },
                     *           "amount": 250000000,
                     *           "score": 62,
                     *           "reasons": [
                     *             "amount at or above the high-value threshold"
                     *           ],
                     *           "review_status": "open",
                     *           "review_note": null,
                     *           "reviewed_at": null,
                     *           "created_at": "2026-09-24T18:00:00.000Z"
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_risk_event_flagged"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "webhook.test": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * webhook.test
         * @description A test event you sent with the test endpoint.
         *
         *     Verify `X-PletoPay-Signature` against the raw body, de-duplicate on `X-PletoPay-Event-ID`, and respond 2xx within 10 seconds.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>`. Reject timestamps older than 5 minutes. */
                    "X-PletoPay-Signature": string;
                    /** @description The same `t` as in the signature (unix seconds). */
                    "X-PletoPay-Timestamp": string;
                    /** @description The event id (`evt_…`). De-duplicate on it: delivery is at least once. */
                    "X-PletoPay-Event-ID": string;
                    /** @description The event type, e.g. `payment.succeeded`. */
                    "X-PletoPay-Event-Type": string;
                    /** @description The delivery (`whd_…`); the same across retries of one delivery. */
                    "X-PletoPay-Delivery-ID": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *       "object": "event",
                     *       "type": "webhook.test",
                     *       "api_version": "2026-09-24",
                     *       "livemode": false,
                     *       "created_at": "2026-09-24T18:04:12.000Z",
                     *       "data": {
                     *         "object": {
                     *           "object": "webhook_test",
                     *           "endpoint": "we_01J8Z5X7Q9K2M4N6P8R0S2T4VB",
                     *           "message": "This is a test event from Pletopay."
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Event_webhook_test"];
                };
            };
            responses: {
                /** @description Acknowledged. Any 2xx stops retries; anything else is retried. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export interface components {
    schemas: {
        DateRangeFilter: {
            /** Format: date-time */
            gt?: string;
            /** Format: date-time */
            gte?: string;
            /** Format: date-time */
            lt?: string;
            /** Format: date-time */
            lte?: string;
        };
        CreateCustomerDto: {
            /** @example customer@example.com */
            email?: string;
            /** @example Chidi Okeke */
            name?: string;
            /** @example +2348012345678 */
            phone?: string;
            /** @description Your own identifier for this customer */
            external_id?: string;
            metadata?: {
                [key: string]: string;
            };
        };
        UpdateCustomerDto: {
            email?: string;
            name?: string;
            phone?: string;
            /** @description Merged into existing metadata */
            metadata?: {
                [key: string]: string;
            };
        };
        PaymentCustomerDto: {
            /** @description Existing customer id (cus_…) */
            id?: string;
            /** @description Creates or reuses the customer with this email */
            email?: string;
            name?: string;
            phone?: string;
        };
        CreatePaymentDto: {
            /**
             * @description Amount in minor units (kobo). ₦50,000.00 = 5000000. Required when amount_rule is exact.
             * @example 5000000
             */
            amount?: number;
            /**
             * @example NGN
             * @enum {string}
             */
            currency: "NGN";
            /**
             * @description Your unique reference for this payment (e.g. order id)
             * @example ORDER-12345
             */
            reference: string;
            /**
             * @description exact: transfers of any other amount are rejected. any: accept whatever is sent.
             * @default exact
             * @enum {string}
             */
            amount_rule?: "exact" | "any";
            customer?: components["schemas"]["PaymentCustomerDto"];
            description?: string;
            /**
             * @example {
             *       "order_id": "123"
             *     }
             */
            metadata?: {
                [key: string]: string;
            };
            /** @description Split rule id (spl_…) to share the net amount with subaccounts */
            split?: string;
            /**
             * @description Seconds until the payment (and its account) expires: 300 to 10800 (one-time accounts last up to 3 hours)
             * @example 1800
             */
            expires_in?: number;
            /**
             * Format: date-time
             * @description Absolute expiry, alternative to expires_in: 5 minutes to 3 hours from now
             */
            expires_at?: string;
        };
        AmountRangeFilter: {
            gte?: number;
            lte?: number;
        };
        CreateVirtualAccountDto: {
            /**
             * @description dedicated: permanent account for a customer. dynamic: single-use account bound to one payment.
             * @enum {string}
             */
            type: "dedicated" | "dynamic";
            /** @description Customer id (cus_…). Required for dedicated accounts. */
            customer_id?: string;
            /**
             * @description Dynamic only: amount in kobo
             * @example 5000000
             */
            amount?: number;
            /**
             * @description Dynamic only
             * @enum {string}
             */
            currency?: "NGN";
            /**
             * @description Dynamic only: your unique payment reference
             * @example ORDER-12345
             */
            reference?: string;
            /**
             * Format: date-time
             * @description Dynamic only
             */
            expires_at?: string;
            metadata?: {
                [key: string]: string;
            };
        };
        CloseVirtualAccountDto: {
            /** @example Customer offboarded */
            reason: string;
        };
        CreateSubaccountDto: {
            /** @example Mama Ngozi Kitchen */
            name: string;
            email?: string;
            /**
             * @description Payout bank code
             * @example 058
             */
            bank_code: string;
            /**
             * @description Payout account (verified by name enquiry)
             * @example 0123456789
             */
            account_number: string;
            metadata?: {
                [key: string]: string;
            };
        };
        UpdateSubaccountDto: {
            name?: string;
            email?: string;
            /** @enum {string} */
            status?: "active" | "inactive";
            /** @description Change the payout account (a cooldown applies before it is used) */
            bank_code?: string;
            account_number?: string;
            metadata?: {
                [key: string]: string;
            };
        };
        SplitAllocationDto: {
            /** @description Subaccount id (sub_…) */
            subaccount: string;
            /**
             * @description percentage: basis points of the net amount (2500 = 25%). flat: amount in kobo.
             * @example 2500
             */
            share: number;
        };
        CreateSplitRuleDto: {
            /** @example Marketplace 80/20 */
            name: string;
            /** @enum {string} */
            type: "percentage" | "flat";
            allocations: components["schemas"]["SplitAllocationDto"][];
            metadata?: {
                [key: string]: string;
            };
        };
        UpdateSplitRuleDto: {
            /** @description Deactivated rules cannot be used for new payments; existing payments keep their frozen split. */
            active: boolean;
        };
        BeneficiaryDto: {
            /**
             * @description Bank code from GET /api/v1/banks
             * @example 058
             */
            bank_code: string;
            /**
             * @description 10-digit NUBAN account number
             * @example 0123456789
             */
            account_number: string;
        };
        CreateTransferDto: {
            /**
             * @description Amount in kobo
             * @example 2500000
             */
            amount: number;
            /** @enum {string} */
            currency: "NGN";
            /** @example PAYOUT-2026-0001 */
            reference: string;
            /**
             * @description Shown on the recipient's statement (at most 50 characters)
             * @example Vendor payout September
             */
            narration: string;
            beneficiary: components["schemas"]["BeneficiaryDto"];
            metadata?: {
                [key: string]: string;
            };
        };
        NameEnquiryDto: {
            /** @example 058 */
            bank_code: string;
            /** @example 0123456789 */
            account_number: string;
        };
        RefundDestinationDto: {
            /** @example 058 */
            bank_code: string;
            /** @example 0123456789 */
            account_number: string;
        };
        CreateRefundDto: {
            /** @description The original payment (pay_…) */
            payment: string;
            /** @description Amount in kobo; defaults to the full refundable amount (partial refunds allowed) */
            amount?: number;
            /** @example Customer returned the item */
            reason: string;
            /** @description Your unique refund reference */
            reference?: string;
            /** @description Where to send the money. Defaults to the original sender when their full account details are known. */
            destination?: components["schemas"]["RefundDestinationDto"];
            metadata?: {
                [key: string]: string;
            };
        };
        CreateCheckoutSessionDto: {
            /**
             * @description Amount in kobo
             * @example 5000000
             */
            amount: number;
            /** @enum {string} */
            currency: "NGN";
            /** @description Your reference for this session, unique per mode (409 duplicate_reference if reused) */
            reference?: string;
            /** @description Shown to the customer */
            description?: string;
            /** @description Existing customer (cus_…) */
            customer?: string;
            customer_email?: string;
            /** @description Where the customer is sent after paying */
            success_url?: string;
            /** @description Where the customer goes if they cancel */
            cancel_url?: string;
            /** @description Seconds until the session expires (default 3600, at most 10800: one-time accounts last up to 3 hours) */
            expires_in?: number;
            /** @description Split rule applied to the payment (spl_…) */
            split?: string;
            metadata?: {
                [key: string]: string;
            };
        };
        CreatePaymentLinkDto: {
            /** @example Donation */
            name: string;
            description?: string;
            /** @description Fixed amount in kobo. Omit and set min/max to let the customer choose. */
            amount?: number;
            min_amount?: number;
            max_amount?: number;
            /** @description Stop accepting payments after this many */
            max_uses?: number;
            success_url?: string;
            cancel_url?: string;
            /** @description Split rule (spl_…) */
            split?: string;
            /** Format: date-time */
            expires_at?: string;
            metadata?: {
                [key: string]: string;
            };
        };
        UpdatePaymentLinkDto: {
            active?: boolean;
            name?: string;
            description?: string;
        };
        InvoiceItemDto: {
            /** @example Website design */
            description: string;
            /** @example 1 */
            quantity: number;
            /**
             * @description Unit price in kobo
             * @example 15000000
             */
            unit_amount: number;
        };
        InvoiceTaxDto: {
            /** @example VAT */
            name: string;
            /**
             * @description Rate in basis points (750 = 7.5%)
             * @example 750
             */
            bps: number;
        };
        CreateInvoiceDto: {
            /** @description Customer (cus_…) */
            customer: string;
            items: components["schemas"]["InvoiceItemDto"][];
            taxes?: components["schemas"]["InvoiceTaxDto"][];
            /** Format: date-time */
            due_date: string;
            memo?: string;
            /** @description Split rule (spl_…) */
            split?: string;
            metadata?: {
                [key: string]: string;
            };
        };
        UpdateInvoiceDto: {
            customer?: string;
            items?: components["schemas"]["InvoiceItemDto"][];
            taxes?: components["schemas"]["InvoiceTaxDto"][];
            /** Format: date-time */
            due_date?: string;
            memo?: string;
            metadata?: {
                [key: string]: string;
            };
        };
        CustomerRiskDto: {
            /**
             * @description blocked: no new payments or accounts for this customer
             * @enum {string}
             */
            status: "normal" | "elevated" | "blocked";
            reason?: string;
        };
        CreatePlanDto: {
            /** @example Pro monthly */
            name: string;
            description?: string;
            /**
             * @description Amount per period in kobo
             * @example 500000
             */
            amount: number;
            /** @enum {string} */
            interval: "day" | "week" | "month" | "year";
            /**
             * @description Bill every N intervals (e.g. 3 months)
             * @default 1
             */
            interval_count?: number;
            metadata?: {
                [key: string]: string;
            };
        };
        UpdatePlanDto: {
            /** @description Inactive plans take no new subscriptions; existing ones continue */
            active?: boolean;
            name?: string;
            description?: string;
        };
        CreateSubscriptionDto: {
            /** @description Customer (cus_…) */
            customer: string;
            /** @description Plan (plan_…) */
            plan: string;
            /**
             * @description invoice: each period is paid through its hosted invoice page. dedicated_account: an exact transfer into the customer's dedicated account also pays it. Nothing is ever debited automatically.
             * @enum {string}
             */
            collection_method: "invoice" | "dedicated_account";
            /** @default 7 */
            days_until_due?: number;
            /**
             * Format: date-time
             * @description Defaults to now; the first invoice is issued at this time
             */
            start_date?: string;
            /** @description Split rule (spl_…) applied to each payment */
            split?: string;
            metadata?: {
                [key: string]: string;
            };
        };
        CancelSubscriptionDto: {
            /**
             * @description Cancel when the current period ends instead of now
             * @default false
             */
            at_period_end?: boolean;
            reason?: string;
        };
        CreateReportDto: {
            /** @enum {string} */
            type: "payments" | "transfers" | "refunds" | "settlements" | "balance_statement" | "customers" | "invoices" | "subscriptions";
            /** Format: date-time */
            period_start: string;
            /**
             * Format: date-time
             * @description Exclusive; at most 366 days after period_start
             */
            period_end: string;
        };
        CreateWebhookEndpointDto: {
            /** @example https://example.com/webhooks/pletopay */
            url: string;
            /**
             * @example [
             *       "payment.succeeded",
             *       "payment.failed"
             *     ]
             */
            enabled_events: ("*" | "payment.created" | "payment.pending" | "payment.succeeded" | "payment.failed" | "payment.expired" | "payment.under_review" | "payment.reversed" | "payment.partially_refunded" | "payment.refunded" | "virtual_account.created" | "virtual_account.updated" | "virtual_account.closed" | "transfer.created" | "transfer.processing" | "transfer.succeeded" | "transfer.failed" | "transfer.reversed" | "settlement.created" | "settlement.completed" | "settlement.failed" | "refund.created" | "refund.succeeded" | "refund.failed" | "checkout.session.completed" | "checkout.session.expired" | "invoice.created" | "invoice.finalized" | "invoice.paid" | "invoice.voided" | "invoice.marked_uncollectible" | "subscription.created" | "subscription.updated" | "subscription.past_due" | "subscription.canceled" | "report.ready" | "report.failed" | "risk.event_flagged" | "webhook.test")[];
            description?: string;
        };
        UpdateWebhookEndpointDto: {
            url?: string;
            enabled_events?: ("*" | "payment.created" | "payment.pending" | "payment.succeeded" | "payment.failed" | "payment.expired" | "payment.under_review" | "payment.reversed" | "payment.partially_refunded" | "payment.refunded" | "virtual_account.created" | "virtual_account.updated" | "virtual_account.closed" | "transfer.created" | "transfer.processing" | "transfer.succeeded" | "transfer.failed" | "transfer.reversed" | "settlement.created" | "settlement.completed" | "settlement.failed" | "refund.created" | "refund.succeeded" | "refund.failed" | "checkout.session.completed" | "checkout.session.expired" | "invoice.created" | "invoice.finalized" | "invoice.paid" | "invoice.voided" | "invoice.marked_uncollectible" | "subscription.created" | "subscription.updated" | "subscription.past_due" | "subscription.canceled" | "report.ready" | "report.failed" | "risk.event_flagged" | "webhook.test")[];
            description?: string;
            /** @enum {string} */
            status?: "enabled" | "disabled";
        };
        ReplayEventDto: {
            /** @description Only replay to this endpoint (we_…) */
            endpoint?: string;
        };
        SimulateTransferDto: {
            /**
             * @description Your virtual account number that should receive the transfer
             * @example 9000002140
             */
            account_number: string;
            /**
             * @description Amount in kobo
             * @example 5000000
             */
            amount: number;
        };
        /** @description Every error response. Program against `error.type` and `error.code`; `message` is for humans and may change. */
        Error: {
            /** @constant */
            status: false;
            /**
             * @description Human-readable explanation
             * @example Invalid request
             */
            message: string;
            error: {
                /** @enum {string} */
                type: "invalid_request" | "authentication_error" | "permission_error" | "not_found" | "conflict" | "idempotency_error" | "rate_limit_error" | "api_error";
                /**
                 * @description Stable machine-readable code (the error catalogue lists every code)
                 * @example parameter_invalid
                 */
                code: string;
                /** @description The request field the error is about, when there is one */
                param?: string;
                details?: Record<string, never>;
            };
            /** @example req_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            request_id: string;
        };
        /** @description Someone who pays you. Customers own dedicated accounts, invoices and subscriptions. */
        Customer: {
            /** @example cus_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "customer";
            livemode: boolean;
            /** Format: email */
            email: string | null;
            name: string | null;
            phone: string | null;
            external_id: string | null;
            /**
             * @description blocked customers cannot be issued new payments or accounts
             * @enum {string}
             */
            risk_status: "normal" | "elevated" | "blocked";
            metadata: {
                [key: string]: string;
            };
            /** Format: date-time */
            created_at: string;
            /** Format: date-time */
            updated_at: string;
        };
        /** @description What to show your customer: the account to transfer to, at which bank, until when. */
        BankTransferInstructions: {
            /** @example 9000002140 */
            account_number: string;
            /**
             * @description Account name; payers see it prefixed by the business short name (e.g. "IPC/Ada Stores Ltd")
             * @example Ada Stores Ltd
             */
            account_name: string;
            /** @example Example Bank */
            bank_name: string;
            /** @example 090629 */
            bank_code: string;
            /** @example va_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            virtual_account: string;
            /** Format: date-time */
            expires_at: string | null;
        };
        /**
         * @description A request for money by bank transfer. `status` moves `created` → `pending` (account issued) → `succeeded` when the credit is confirmed, or to `expired`, `failed` or `under_review`.
         * @example {
         *       "id": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
         *       "object": "payment",
         *       "livemode": false,
         *       "reference": "ORDER-123",
         *       "amount": 5000000,
         *       "amount_received": 0,
         *       "fee": 0,
         *       "stamp_duty": 0,
         *       "net_amount": 0,
         *       "amount_refunded": 0,
         *       "split": null,
         *       "split_amount": 0,
         *       "currency": "NGN",
         *       "status": "pending",
         *       "payment_method": "bank_transfer",
         *       "amount_rule": "exact",
         *       "source": "api",
         *       "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
         *       "bank_transfer": {
         *         "account_number": "9000002140",
         *         "account_name": "Ada Stores Ltd",
         *         "bank_name": "Example Bank",
         *         "bank_code": "090629",
         *         "virtual_account": "va_01J8Z5X7Q9K2M4N6P8R0S2T4V8",
         *         "expires_at": "2026-09-24T18:30:00.000Z"
         *       },
         *       "description": null,
         *       "metadata": {
         *         "order_id": "123"
         *       },
         *       "failure_reason": null,
         *       "review_reason": null,
         *       "created_at": "2026-09-24T18:00:00.000Z",
         *       "expires_at": "2026-09-24T18:30:00.000Z",
         *       "succeeded_at": null
         *     }
         */
        Payment: {
            /** @example pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "payment";
            livemode: boolean;
            /** @example ORDER-12345 */
            reference: string;
            /** @description Expected amount in minor units; null when amount_rule is any */
            amount: number | null;
            /** @description Minor units (kobo for NGN) */
            amount_received: number;
            /** @description Minor units (kobo for NGN) */
            fee: number;
            /** @description Minor units (kobo for NGN) */
            stamp_duty: number;
            /** @description Minor units (kobo for NGN) */
            net_amount: number;
            /** @description Total of successful refunds against this payment */
            amount_refunded: number;
            /** @description Split rule (spl_…) applied to this payment */
            split: string | null;
            /** @description Part of net_amount allocated to subaccounts by the split rule */
            split_amount: number;
            /** @enum {string} */
            currency: "NGN";
            /**
             * @description partially_refunded / refunded are set only once a refund has actually been paid out.
             * @enum {string}
             */
            status: "created" | "pending" | "processing" | "succeeded" | "under_review" | "failed" | "expired" | "reversed" | "partially_refunded" | "refunded";
            /** @constant */
            payment_method: "bank_transfer";
            /** @enum {string} */
            amount_rule: "exact" | "any";
            /** @enum {string} */
            source: "api" | "dedicated_virtual_account";
            /** @description Customer id, or the full object with expand[]=customer */
            customer: null | string | components["schemas"]["Customer"];
            bank_transfer: null | components["schemas"]["BankTransferInstructions"];
            description: string | null;
            metadata: {
                [key: string]: string;
            };
            failure_reason: string | null;
            review_reason: string | null;
            /** Format: date-time */
            created_at: string;
            /** Format: date-time */
            expires_at: string | null;
            /** Format: date-time */
            succeeded_at: string | null;
        };
        /** @description A bank account number that routes transfers into your balance: `dedicated` (one customer, permanent) or `dynamic` (one payment). */
        VirtualAccount: {
            /** @example va_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "virtual_account";
            livemode: boolean;
            /** @enum {string} */
            type: "dedicated" | "dynamic";
            /** @enum {string} */
            status: "requested" | "active" | "blocked" | "expired" | "consumed" | "closed" | "failed";
            account_number: string | null;
            account_name: string;
            bank_name: string;
            bank_code: string;
            /** @enum {string} */
            currency: "NGN";
            customer: null | string;
            payment: null | string;
            expected_amount: number | null;
            /** @enum {string} */
            amount_rule: "exact" | "any";
            single_use: boolean;
            /** Format: date-time */
            expires_at: string | null;
            /** Format: date-time */
            closed_at: string | null;
            metadata: {
                [key: string]: string;
            };
            /** Format: date-time */
            created_at: string;
        };
        /** @description Money sent from your available balance to a bank account. */
        Transfer: {
            /** @example trf_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "transfer";
            livemode: boolean;
            reference: string;
            /** @description Minor units (kobo for NGN) */
            amount: number;
            /** @description Fees charged to you for this transfer (transfer fee, stamp duty, platform fee) */
            fee: number;
            /** @description amount + fee, debited from your available balance */
            total_debit: number;
            /** @enum {string} */
            currency: "NGN";
            /**
             * @description A transfer whose outcome is unknown stays processing until confirmed — never failed.
             * @enum {string}
             */
            status: "pending" | "processing" | "succeeded" | "failed" | "reversed";
            beneficiary: {
                bank_code: string;
                /** @description Bank name for display (null if the list of banks is unavailable) */
                bank_name: string | null;
                account_number: string;
                account_name: string | null;
            };
            narration: string;
            session_id: string | null;
            failure_reason: string | null;
            metadata: {
                [key: string]: string;
            };
            /** Format: date-time */
            created_at: string;
            /** Format: date-time */
            completed_at: string | null;
        };
        /** @description Money returned for a payment by bank transfer. */
        Refund: {
            /** @example re_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "refund";
            livemode: boolean;
            /**
             * @description The original payment being refunded
             * @example pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6
             */
            payment: string;
            reference: string;
            /** @description Minor units (kobo for NGN) */
            amount: number;
            /** @description Transfer costs charged to you for paying this refund out */
            fee: number;
            /** @enum {string} */
            currency: "NGN";
            reason: string;
            /**
             * @description When a refund succeeds, the payment becomes partially_refunded or refunded.
             * @enum {string}
             */
            status: "pending" | "processing" | "succeeded" | "failed";
            destination: {
                bank_code: string;
                /** @description Bank name for display (null if the list of banks is unavailable) */
                bank_name: string | null;
                account_number_last4: string;
                account_name: string | null;
            };
            transfer: null | {
                /** @enum {string} */
                status: "pending" | "processing" | "succeeded" | "failed" | "reversed";
                session_id: string | null;
            };
            failure_reason: string | null;
            metadata: {
                [key: string]: string;
            };
            /** Format: date-time */
            created_at: string;
            /** Format: date-time */
            completed_at: string | null;
        };
        /** @description A seller or vendor on your platform with its own balance and payout account. */
        Subaccount: {
            /** @example sub_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "subaccount";
            livemode: boolean;
            name: string;
            email: string | null;
            /** @enum {string} */
            status: "active" | "inactive";
            settlement_account: null | {
                bank_code: string;
                bank_name: string | null;
                account_number_last4: string;
                account_name: string;
                /** Format: date-time */
                usable_from: string;
            };
            metadata: {
                [key: string]: string;
            };
            /** Format: date-time */
            created_at: string;
        };
        /** @description A subaccount’s balances, in kobo. */
        SubaccountBalance: {
            /** @constant */
            object: "subaccount_balance";
            /** @example sub_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            subaccount: string;
            livemode: boolean;
            /** @enum {string} */
            currency: "NGN";
            /** @description Minor units (kobo for NGN) */
            pending: number;
            /** @description Minor units (kobo for NGN) */
            available: number;
            /** @description Minor units (kobo for NGN) */
            settling: number;
            /** @description Minor units (kobo for NGN) */
            total: number;
            /** @description Minor units (kobo for NGN) */
            settled_total: number;
        };
        /** @description How a payment’s net amount is shared with subaccounts. */
        SplitRule: {
            /** @example spl_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "split_rule";
            livemode: boolean;
            name: string;
            /**
             * @description percentage: share in basis points of the net amount; flat: share in kobo (capped at the net amount)
             * @enum {string}
             */
            type: "percentage" | "flat";
            active: boolean;
            allocations: {
                /** @example sub_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
                subaccount: string;
                share: number;
            }[];
            metadata: {
                [key: string]: string;
            };
            /** Format: date-time */
            created_at: string;
        };
        /** @description A hosted payment page for one payment. */
        CheckoutSession: {
            /** @example cs_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "checkout_session";
            livemode: boolean;
            /** @enum {string} */
            status: "open" | "complete" | "expired";
            /**
             * Format: uri
             * @description Hosted page to redirect your customer to
             */
            url: string;
            /** @description Session token for the browser SDK (`pletopay.checkout({ session: token })`); it is also the last segment of `url`. Pass it to your front end; never the secret key. */
            token?: string;
            /** @description Minor units (kobo for NGN) */
            amount: number;
            /** @enum {string} */
            currency: "NGN";
            reference: string | null;
            description: string | null;
            customer: null | string;
            customer_email: string | null;
            /** @description Created when the customer opens the page */
            payment: null | string;
            payment_link: null | string;
            invoice: null | string;
            split: null | string;
            payment_method_types: "bank_transfer"[];
            success_url: string | null;
            cancel_url: string | null;
            metadata: {
                [key: string]: string;
            };
            /** Format: date-time */
            expires_at: string;
            /** Format: date-time */
            completed_at: string | null;
            /** Format: date-time */
            created_at: string;
        };
        /** @description A reusable hosted payment page. */
        PaymentLink: {
            /** @example plink_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "payment_link";
            livemode: boolean;
            active: boolean;
            /** Format: uri */
            url: string;
            name: string;
            description: string | null;
            /** @description Fixed amount; null when the customer chooses */
            amount: number | null;
            min_amount: number | null;
            max_amount: number | null;
            /** @enum {string} */
            currency: "NGN";
            max_uses: number | null;
            /** @description Completed payments */
            uses: number;
            split: null | string;
            success_url: string | null;
            cancel_url: string | null;
            /** Format: date-time */
            expires_at: string | null;
            metadata: {
                [key: string]: string;
            };
            /** Format: date-time */
            created_at: string;
        };
        /** @description One line of an invoice. */
        InvoiceItem: {
            description: string;
            quantity: number;
            /** @description Minor units (kobo for NGN) */
            unit_amount: number;
            /** @description Minor units (kobo for NGN) */
            amount: number;
        };
        /** @description A tax applied to an invoice subtotal. */
        InvoiceTax: {
            name: string;
            /** @description Rate in basis points (750 = 7.5%) */
            bps: number;
            /** @description Minor units (kobo for NGN) */
            amount: number;
        };
        /** @description An itemised bill with a hosted payment page. */
        Invoice: {
            /** @example inv_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "invoice";
            livemode: boolean;
            /** @description Assigned at finalization, e.g. INV-000042 */
            number: string | null;
            /** @enum {string} */
            status: "draft" | "open" | "paid" | "void" | "uncollectible";
            /** @example cus_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            customer: string;
            /** @enum {string} */
            currency: "NGN";
            items: components["schemas"]["InvoiceItem"][];
            taxes: components["schemas"]["InvoiceTax"][];
            /** @description Minor units (kobo for NGN) */
            subtotal: number;
            /** @description Minor units (kobo for NGN) */
            tax_amount: number;
            /** @description Minor units (kobo for NGN) */
            total: number;
            /** @description Minor units (kobo for NGN) */
            amount_paid: number;
            /** @description Minor units (kobo for NGN) */
            amount_due: number;
            memo: string | null;
            /** Format: date-time */
            due_date: string;
            /**
             * Format: uri
             * @description Customer payment page (after finalization)
             */
            hosted_invoice_url: string | null;
            payment: null | string;
            split: null | string;
            /** @description Set when issued by a subscription */
            subscription: null | string;
            /** Format: date-time */
            period_start: string | null;
            /** Format: date-time */
            period_end: string | null;
            metadata: {
                [key: string]: string;
            };
            /** Format: date-time */
            finalized_at: string | null;
            /** Format: date-time */
            paid_at: string | null;
            /** Format: date-time */
            voided_at: string | null;
            /** Format: date-time */
            created_at: string;
        };
        /** @description Activity your risk rules blocked or flagged. */
        RiskEvent: {
            /** @example rsk_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "risk_event";
            livemode: boolean;
            /** @enum {string} */
            type: "amount_limit" | "daily_amount_limit" | "daily_count_limit" | "frequency_limit" | "high_value_payment" | "customer_velocity" | "blocked_customer" | "restricted_merchant" | "payout_account_changed" | "manual_flag";
            /** @enum {string} */
            severity: "low" | "medium" | "high";
            /**
             * @description blocked: the request was refused; flagged: allowed, queued for review
             * @enum {string}
             */
            action: "allowed" | "flagged" | "blocked";
            rule: string | null;
            subject: {
                type: string;
                id: string | null;
            };
            amount: number | null;
            /** @description Transaction risk score 0–100 (placeholder model) */
            score: number | null;
            reasons: string[];
            /** @enum {string} */
            review_status: "open" | "cleared" | "confirmed";
            review_note: string | null;
            /** Format: date-time */
            reviewed_at: string | null;
            /** Format: date-time */
            created_at: string;
        };
        /** @description Your effective risk limits in kobo; 0 means no limit. */
        RiskLimits: {
            /** @constant */
            object: "risk_limits";
            livemode: boolean;
            /** @description Largest single transfer or refund (kobo); 0 = no limit */
            max_transfer_amount: number;
            daily_outbound_amount: number;
            daily_outbound_count: number;
            outbound_per_minute: number;
            /** @description Received payments at or above this are flagged (never refused) */
            high_value_payment: number;
            customer_payments_per_hour: number;
        };
        /** @description A recurring price for subscriptions. */
        Plan: {
            /** @example plan_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "plan";
            livemode: boolean;
            name: string;
            description: string | null;
            /** @description Minor units (kobo for NGN) */
            amount: number;
            /** @enum {string} */
            currency: "NGN";
            /** @enum {string} */
            interval: "day" | "week" | "month" | "year";
            interval_count: number;
            active: boolean;
            metadata: {
                [key: string]: string;
            };
            /** Format: date-time */
            created_at: string;
        };
        /** @description A customer’s subscription to a plan, billed by invoice each period. */
        Subscription: {
            /** @example sbs_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "subscription";
            livemode: boolean;
            /** @enum {string} */
            status: "active" | "past_due" | "canceled";
            /** @example cus_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            customer: string;
            /** @example plan_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            plan: string;
            /**
             * @description Neither is an automatic debit.
             * @enum {string}
             */
            collection_method: "invoice" | "dedicated_account";
            dedicated_account: null | {
                /** @example va_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
                virtual_account: string;
                account_number: string | null;
            };
            days_until_due: number;
            /** Format: date-time */
            current_period_start: string;
            /** Format: date-time */
            current_period_end: string;
            /** Format: date-time */
            next_invoice_at: string | null;
            latest_invoice: null | string;
            cancel_at_period_end: boolean;
            /** Format: date-time */
            canceled_at: string | null;
            cancel_reason: string | null;
            metadata: {
                [key: string]: string;
            };
            /** Format: date-time */
            created_at: string;
        };
        /** @description A CSV export generated in the background. */
        Report: {
            /** @example rpt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "report";
            livemode: boolean;
            /** @enum {string} */
            type: "payments" | "transfers" | "refunds" | "settlements" | "balance_statement" | "customers" | "invoices" | "subscriptions";
            /** @enum {string} */
            status: "pending" | "running" | "succeeded" | "failed";
            /** Format: date-time */
            period_start: string;
            /** Format: date-time */
            period_end: string;
            /** @constant */
            format: "csv";
            row_count: number | null;
            size_bytes: number | null;
            sha256: string | null;
            download_url: string | null;
            error: string | null;
            /** Format: date-time */
            expires_at: string | null;
            /** Format: date-time */
            created_at: string;
            /** Format: date-time */
            completed_at: string | null;
        };
        /** @description Opening, credits, debits and closing per balance over a period. */
        Statement: {
            /** @constant */
            object: "statement";
            livemode: boolean;
            /** @enum {string} */
            currency: "NGN";
            /** Format: date-time */
            period_start: string;
            /** Format: date-time */
            period_end: string;
            balances: {
                /** @enum {string} */
                balance: "available" | "pending" | "held" | "unapplied" | "settling";
                opening: number;
                credits: number;
                debits: number;
                closing: number;
            }[];
        };
        /** @description The result of a name enquiry. */
        AccountResolution: {
            /** @constant */
            object: "account_resolution";
            bank_code: string;
            account_number: string;
            account_name: string;
        };
        /** @description A bank you can send transfers to. */
        Bank: {
            /** @constant */
            object: "bank";
            code: string;
            name: string;
        };
        /** @description Your balances in kobo, computed from the ledger. */
        Balance: {
            /** @constant */
            object: "balance";
            livemode: boolean;
            /** @enum {string} */
            currency: "NGN";
            /** @description Minor units (kobo for NGN) */
            available: number;
            /** @description Minor units (kobo for NGN) */
            pending: number;
            /** @description Minor units (kobo for NGN) */
            held: number;
            /** @description Minor units (kobo for NGN) */
            unapplied: number;
            /** @description Minor units (kobo for NGN) */
            settling: number;
            /** @description Minor units (kobo for NGN) */
            total: number;
            /** @description Lifetime amount paid out by completed settlements */
            settled_total: number;
        };
        /** @description A ledger journal and its signed effect on your balances. */
        LedgerTransaction: {
            /** @example jrn_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "ledger_transaction";
            livemode: boolean;
            type: string;
            description: string;
            /** @enum {string} */
            currency: "NGN";
            /** @description Signed net effect on your balances (minor units) */
            net_amount: number;
            /** @description Signed change per balance: available, pending, held, unapplied, settling */
            balance_changes: {
                [key: string]: number;
            };
            source: null | {
                object: string;
                id: string;
            };
            /** Format: date-time */
            created_at: string;
        };
        /** @description A URL that receives signed events. */
        WebhookEndpoint: {
            /** @example we_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "webhook_endpoint";
            livemode: boolean;
            /** Format: uri */
            url: string;
            description: string | null;
            enabled_events: string[];
            /** @enum {string} */
            status: "enabled" | "disabled" | "auto_disabled";
            /** @description Signing secret. Returned only on create and rotate. */
            secret?: string;
            health: {
                consecutive_failures: number;
                /** Format: date-time */
                last_success_at: string | null;
                /** Format: date-time */
                last_failure_at: string | null;
                /** Format: date-time */
                disabled_at: string | null;
            };
            stats?: null | {
                /** Format: date-time */
                last_delivery_at: string | null;
                deliveries_7d: number;
                /** @description 0–1 over the last 7 days; null when nothing was delivered */
                success_rate_7d: number | null;
            };
            /** Format: date-time */
            created_at: string;
        };
        /** @description Confirmation that an object was deleted. */
        DeletedObject: {
            id: string;
            object: string;
            /** @constant */
            deleted: true;
        };
        /** @description The data of a `webhook.test` event. */
        WebhookTest: {
            /** @constant */
            object: "webhook_test";
            /** @example we_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            endpoint: string;
            message: string;
        };
        /** @description Something that happened in your account. The same object is delivered to your webhook endpoints. */
        Event: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @example payment.succeeded */
            type: string;
            /** @example 2026-09-24 */
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                /** @description The resource (payment, virtual_account, transfer) at the time of the event */
                object: Record<string, never>;
            };
        };
        /** @description One delivery of an event to an endpoint, with its retry state. */
        WebhookDelivery: {
            /** @example whd_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "webhook_delivery";
            livemode: boolean;
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            event: string;
            /** @example we_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            endpoint: string;
            /** @enum {string} */
            status: "pending" | "succeeded" | "failed" | "dead";
            attempts: number;
            response_status: number | null;
            error: string | null;
            duration_ms: number | null;
            /** Format: date-time */
            last_attempt_at: string | null;
            /** Format: date-time */
            next_attempt_at: string | null;
            replay_of: null | string;
            /** Format: date-time */
            created_at: string;
        };
        /** @description Acknowledgement that a simulated transfer was accepted. */
        SimulatedTransfer: {
            /** @constant */
            object: "simulated_transfer";
            /** @constant */
            status: "accepted";
            account_number: string;
            /** @description Minor units (kobo for NGN) */
            amount: number;
        };
        /** @description A payout of available balance to a settlement account. */
        Settlement: {
            /** @example stl_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "settlement";
            livemode: boolean;
            /** @description The subaccount paid by this settlement (sub_…), or null for your own balance */
            subaccount: string | null;
            /** @enum {string} */
            status: "pending" | "processing" | "completed" | "failed";
            /** @enum {string} */
            trigger: "scheduled" | "manual";
            /** @description Sent to your settlement account */
            amount: number;
            /** @description Platform settlement fee */
            fee: number;
            /** @description Transfer fee (when passed through) */
            transfer_fee: number;
            /** @description 7.5% VAT on the transfer fee (when passed through) */
            transfer_fee_vat: number;
            /** @description Minor units (kobo for NGN) */
            stamp_duty: number;
            /** @description Taken from your available balance: amount + fees */
            total_deducted: number;
            /** @description Kept available by your reserve setting */
            reserve_retained: number;
            /** @enum {string} */
            currency: "NGN";
            settlement_account: {
                /** @example sta_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
                id: string;
                bank_code: string;
                /** @description Bank name for display (null if the list of banks is unavailable) */
                bank_name: string | null;
                account_number_last4: string;
                account_name: string;
            };
            transfer: null | {
                /** @enum {string} */
                status: "pending" | "processing" | "succeeded" | "failed" | "reversed";
                session_id: string | null;
            };
            failure_reason: string | null;
            /** Format: date-time */
            cutoff_at: string;
            /** Format: date-time */
            created_at: string;
            /** Format: date-time */
            completed_at: string | null;
        };
        /** @description A ledger movement a settlement accounts for. */
        SettlementItem: {
            /** @constant */
            object: "settlement_item";
            /** @description Ledger transaction id (jrn_…) */
            ledger_transaction: string;
            type: string;
            source: null | {
                object: string;
                id: string;
            };
            /** @description Signed change to your available balance */
            available_delta: number;
            /** Format: date-time */
            posted_at: string;
        };
        Event_payment_created: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "payment.created";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Payment"];
            };
        };
        Event_payment_pending: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "payment.pending";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Payment"];
            };
        };
        Event_payment_succeeded: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "payment.succeeded";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Payment"];
            };
        };
        Event_payment_failed: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "payment.failed";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Payment"];
            };
        };
        Event_payment_expired: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "payment.expired";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Payment"];
            };
        };
        Event_payment_under_review: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "payment.under_review";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Payment"];
            };
        };
        Event_payment_reversed: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "payment.reversed";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Payment"];
            };
        };
        Event_payment_partially_refunded: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "payment.partially_refunded";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Payment"];
            };
        };
        Event_payment_refunded: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "payment.refunded";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Payment"];
            };
        };
        Event_virtual_account_created: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "virtual_account.created";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["VirtualAccount"];
            };
        };
        Event_virtual_account_updated: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "virtual_account.updated";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["VirtualAccount"];
            };
        };
        Event_virtual_account_closed: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "virtual_account.closed";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["VirtualAccount"];
            };
        };
        Event_transfer_created: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "transfer.created";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Transfer"];
            };
        };
        Event_transfer_processing: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "transfer.processing";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Transfer"];
            };
        };
        Event_transfer_succeeded: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "transfer.succeeded";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Transfer"];
            };
        };
        Event_transfer_failed: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "transfer.failed";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Transfer"];
            };
        };
        Event_transfer_reversed: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "transfer.reversed";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Transfer"];
            };
        };
        Event_settlement_created: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "settlement.created";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Settlement"];
            };
        };
        Event_settlement_completed: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "settlement.completed";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Settlement"];
            };
        };
        Event_settlement_failed: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "settlement.failed";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Settlement"];
            };
        };
        Event_refund_created: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "refund.created";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Refund"];
            };
        };
        Event_refund_succeeded: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "refund.succeeded";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Refund"];
            };
        };
        Event_refund_failed: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "refund.failed";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Refund"];
            };
        };
        Event_checkout_session_completed: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "checkout.session.completed";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["CheckoutSession"];
            };
        };
        Event_checkout_session_expired: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "checkout.session.expired";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["CheckoutSession"];
            };
        };
        Event_invoice_created: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "invoice.created";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Invoice"];
            };
        };
        Event_invoice_finalized: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "invoice.finalized";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Invoice"];
            };
        };
        Event_invoice_paid: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "invoice.paid";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Invoice"];
            };
        };
        Event_invoice_voided: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "invoice.voided";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Invoice"];
            };
        };
        Event_invoice_marked_uncollectible: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "invoice.marked_uncollectible";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Invoice"];
            };
        };
        Event_subscription_created: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "subscription.created";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Subscription"];
            };
        };
        Event_subscription_updated: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "subscription.updated";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Subscription"];
            };
        };
        Event_subscription_past_due: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "subscription.past_due";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Subscription"];
            };
        };
        Event_subscription_canceled: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "subscription.canceled";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Subscription"];
            };
        };
        Event_report_ready: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "report.ready";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Report"];
            };
        };
        Event_report_failed: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "report.failed";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["Report"];
            };
        };
        Event_risk_event_flagged: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "risk.event_flagged";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["RiskEvent"];
            };
        };
        Event_webhook_test: {
            /** @example evt_01J8Z5X7Q9K2M4N6P8R0S2T4V6 */
            id: string;
            /** @constant */
            object: "event";
            /** @constant */
            type: "webhook.test";
            api_version: string;
            livemode: boolean;
            /** Format: date-time */
            created_at: string;
            data: {
                object: components["schemas"]["WebhookTest"];
            };
        };
        ListMeta: {
            /** @description More results exist after this page */
            has_more: boolean;
            /** @description Pass as `starting_after` to fetch the next page (null on the last page) */
            next_cursor: string | null;
            url: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    listCustomers: {
        parameters: {
            query?: {
                /** @description Number of objects to return */
                limit?: number;
                /** @description Cursor: return objects created before this object id (older) */
                starting_after?: string;
                /** @description Cursor: return objects created after this object id (newer) */
                ending_before?: string;
                /** @description Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z */
                created?: components["schemas"]["DateRangeFilter"];
                /** @description Only the customer with this email. */
                email?: string;
            };
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A page of customers, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Customers retrieved",
                     *       "data": [
                     *         {
                     *           "id": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "object": "customer",
                     *           "livemode": false,
                     *           "email": "customer@example.com",
                     *           "name": "Chidi Okeke",
                     *           "phone": "+2348012345678",
                     *           "external_id": "user_8841",
                     *           "risk_status": "normal",
                     *           "metadata": {
                     *             "signup_channel": "web"
                     *           },
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "updated_at": "2026-09-24T18:00:00.000Z"
                     *         }
                     *       ],
                     *       "meta": {
                     *         "has_more": false,
                     *         "next_cursor": null,
                     *         "url": "/api/v1/customers"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Customer"][];
                        meta: components["schemas"]["ListMeta"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    createCustomer: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
                /** @description A unique key for this request (1–255 printable ASCII characters). A retry with the same key and body returns the original response, with `Idempotent-Replayed: true`, instead of acting twice. Keys expire after 24 hours. */
                "Idempotency-Key"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "email": "customer@example.com",
                 *       "name": "Chidi Okeke",
                 *       "phone": "+2348012345678",
                 *       "external_id": "user_8841",
                 *       "metadata": {
                 *         "signup_channel": "web"
                 *       }
                 *     }
                 */
                "application/json": components["schemas"]["CreateCustomerDto"];
            };
        };
        responses: {
            /** @description The new customer. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Customer created",
                     *       "data": {
                     *         "id": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *         "object": "customer",
                     *         "livemode": false,
                     *         "email": "customer@example.com",
                     *         "name": "Chidi Okeke",
                     *         "phone": "+2348012345678",
                     *         "external_id": "user_8841",
                     *         "risk_status": "normal",
                     *         "metadata": {
                     *           "signup_channel": "web"
                     *         },
                     *         "created_at": "2026-09-24T18:00:00.000Z",
                     *         "updated_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Customer"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /**
             * @description Conflict (duplicate reference, invalid state, request in progress)
             *
             *     A request with this Idempotency-Key is still in progress
             */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "A payment with reference ORDER-12345 already exists",
                     *       "error": {
                     *         "type": "conflict",
                     *         "code": "duplicate_reference",
                     *         "param": "reference"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Idempotency-Key reused with a different request */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "This Idempotency-Key was used with a different request",
                     *       "error": {
                     *         "type": "idempotency_error",
                     *         "code": "idempotency_key_reused",
                     *         "param": "Idempotency-Key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getCustomer: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The customer id (`cus_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The customer. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Customer retrieved",
                     *       "data": {
                     *         "id": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *         "object": "customer",
                     *         "livemode": false,
                     *         "email": "customer@example.com",
                     *         "name": "Chidi Okeke",
                     *         "phone": "+2348012345678",
                     *         "external_id": "user_8841",
                     *         "risk_status": "normal",
                     *         "metadata": {
                     *           "signup_channel": "web"
                     *         },
                     *         "created_at": "2026-09-24T18:00:00.000Z",
                     *         "updated_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Customer"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    updateCustomer: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
                /** @description A unique key for this request (1–255 printable ASCII characters). A retry with the same key and body returns the original response, with `Idempotent-Replayed: true`, instead of acting twice. Keys expire after 24 hours. */
                "Idempotency-Key"?: string;
            };
            path: {
                /** @description The customer id (`cus_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "name": "Chidi E. Okeke",
                 *       "metadata": {
                 *         "tier": "gold"
                 *       }
                 *     }
                 */
                "application/json": components["schemas"]["UpdateCustomerDto"];
            };
        };
        responses: {
            /** @description The updated customer. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Customer updated",
                     *       "data": {
                     *         "id": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *         "object": "customer",
                     *         "livemode": false,
                     *         "email": "customer@example.com",
                     *         "name": "Chidi Okeke",
                     *         "phone": "+2348012345678",
                     *         "external_id": "user_8841",
                     *         "risk_status": "normal",
                     *         "metadata": {
                     *           "signup_channel": "web"
                     *         },
                     *         "created_at": "2026-09-24T18:00:00.000Z",
                     *         "updated_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Customer"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /**
             * @description Conflict (duplicate reference, invalid state, request in progress)
             *
             *     A request with this Idempotency-Key is still in progress
             */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "A payment with reference ORDER-12345 already exists",
                     *       "error": {
                     *         "type": "conflict",
                     *         "code": "duplicate_reference",
                     *         "param": "reference"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Idempotency-Key reused with a different request */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "This Idempotency-Key was used with a different request",
                     *       "error": {
                     *         "type": "idempotency_error",
                     *         "code": "idempotency_key_reused",
                     *         "param": "Idempotency-Key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listPayments: {
        parameters: {
            query?: {
                /** @description Number of objects to return */
                limit?: number;
                /** @description Cursor: return objects created before this object id (older) */
                starting_after?: string;
                /** @description Cursor: return objects created after this object id (newer) */
                ending_before?: string;
                /** @description Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z */
                created?: components["schemas"]["DateRangeFilter"];
                /** @description Only objects with this status. */
                status?: "created" | "pending" | "processing" | "succeeded" | "under_review" | "failed" | "expired" | "reversed" | "partially_refunded" | "refunded";
                /** @description Only objects of this customer (`cus_…`). */
                customer?: string;
                /** @description Only the payment with this reference. */
                reference?: string;
                /** @description Search: a payment id (pay_…), reference (starts with), account number (starts with) or va_…, customer id (cus_…), email, phone or name (starts with), split rule id (spl_…), or the transfer reference or session id of the transfer that paid it */
                q?: string;
                /** @description Amount received (kobo), e.g. amount[gte]=100000 */
                amount?: components["schemas"]["AmountRangeFilter"];
                /** @description Payments into this virtual account (va_…) */
                virtual_account?: string;
                /** @description Embed related objects instead of their ids. `customer` embeds the customer. */
                "expand[]"?: "customer"[];
            };
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A page of payments, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Payments retrieved",
                     *       "data": [
                     *         {
                     *           "id": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *           "object": "payment",
                     *           "livemode": false,
                     *           "reference": "ORDER-12345",
                     *           "amount": 5000000,
                     *           "amount_received": 0,
                     *           "fee": 0,
                     *           "stamp_duty": 0,
                     *           "net_amount": 0,
                     *           "amount_refunded": 0,
                     *           "split": null,
                     *           "split_amount": 0,
                     *           "currency": "NGN",
                     *           "status": "pending",
                     *           "payment_method": "bank_transfer",
                     *           "amount_rule": "exact",
                     *           "source": "api",
                     *           "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "bank_transfer": {
                     *             "account_number": "9000002140",
                     *             "account_name": "Ada Stores Ltd",
                     *             "bank_name": "Example Bank",
                     *             "bank_code": "090629",
                     *             "virtual_account": "va_01J8Z5X7Q9K2M4N6P8R0S2T4V8",
                     *             "expires_at": "2026-09-24T18:30:00.000Z"
                     *           },
                     *           "description": "Order #12345",
                     *           "metadata": {
                     *             "order_id": "12345"
                     *           },
                     *           "failure_reason": null,
                     *           "review_reason": null,
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "expires_at": "2026-09-24T18:30:00.000Z",
                     *           "succeeded_at": null
                     *         }
                     *       ],
                     *       "meta": {
                     *         "has_more": false,
                     *         "next_cursor": null,
                     *         "url": "/api/v1/payments"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Payment"][];
                        meta: components["schemas"]["ListMeta"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    createPayment: {
        parameters: {
            query?: {
                /** @description Embed related objects instead of their ids. `customer` embeds the customer. */
                "expand[]"?: "customer"[];
            };
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
                /** @description A unique key for this request (1–255 printable ASCII characters). A retry with the same key and body returns the original response, with `Idempotent-Replayed: true`, instead of acting twice. Keys expire after 24 hours. */
                "Idempotency-Key"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "amount": 5000000,
                 *       "currency": "NGN",
                 *       "reference": "ORDER-12345",
                 *       "customer": {
                 *         "email": "customer@example.com",
                 *         "name": "Chidi Okeke"
                 *       },
                 *       "description": "Order #12345",
                 *       "expires_in": 1800,
                 *       "metadata": {
                 *         "order_id": "12345"
                 *       }
                 *     }
                 */
                "application/json": components["schemas"]["CreatePaymentDto"];
            };
        };
        responses: {
            /** @description The new payment, normally `pending` with `bank_transfer` instructions. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Payment created",
                     *       "data": {
                     *         "id": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *         "object": "payment",
                     *         "livemode": false,
                     *         "reference": "ORDER-12345",
                     *         "amount": 5000000,
                     *         "amount_received": 0,
                     *         "fee": 0,
                     *         "stamp_duty": 0,
                     *         "net_amount": 0,
                     *         "amount_refunded": 0,
                     *         "split": null,
                     *         "split_amount": 0,
                     *         "currency": "NGN",
                     *         "status": "pending",
                     *         "payment_method": "bank_transfer",
                     *         "amount_rule": "exact",
                     *         "source": "api",
                     *         "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *         "bank_transfer": {
                     *           "account_number": "9000002140",
                     *           "account_name": "Ada Stores Ltd",
                     *           "bank_name": "Example Bank",
                     *           "bank_code": "090629",
                     *           "virtual_account": "va_01J8Z5X7Q9K2M4N6P8R0S2T4V8",
                     *           "expires_at": "2026-09-24T18:30:00.000Z"
                     *         },
                     *         "description": "Order #12345",
                     *         "metadata": {
                     *           "order_id": "12345"
                     *         },
                     *         "failure_reason": null,
                     *         "review_reason": null,
                     *         "created_at": "2026-09-24T18:00:00.000Z",
                     *         "expires_at": "2026-09-24T18:30:00.000Z",
                     *         "succeeded_at": null
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Payment"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /**
             * @description Conflict (duplicate reference, invalid state, request in progress)
             *
             *     A request with this Idempotency-Key is still in progress
             */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "A payment with reference ORDER-12345 already exists",
                     *       "error": {
                     *         "type": "conflict",
                     *         "code": "duplicate_reference",
                     *         "param": "reference"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Idempotency-Key reused with a different request */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "This Idempotency-Key was used with a different request",
                     *       "error": {
                     *         "type": "idempotency_error",
                     *         "code": "idempotency_key_reused",
                     *         "param": "Idempotency-Key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description The service is temporarily unavailable. Nothing was sent or created; retry later with the same Idempotency-Key */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "The service is temporarily unavailable. Nothing was sent or created; retry shortly.",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "service_unavailable"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getPayment: {
        parameters: {
            query?: {
                /** @description Embed related objects instead of their ids. `customer` embeds the customer. */
                "expand[]"?: "customer"[];
            };
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The payment id (`pay_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The payment. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Payment retrieved",
                     *       "data": {
                     *         "id": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *         "object": "payment",
                     *         "livemode": false,
                     *         "reference": "ORDER-12345",
                     *         "amount": 5000000,
                     *         "amount_received": 0,
                     *         "fee": 0,
                     *         "stamp_duty": 0,
                     *         "net_amount": 0,
                     *         "amount_refunded": 0,
                     *         "split": null,
                     *         "split_amount": 0,
                     *         "currency": "NGN",
                     *         "status": "pending",
                     *         "payment_method": "bank_transfer",
                     *         "amount_rule": "exact",
                     *         "source": "api",
                     *         "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *         "bank_transfer": {
                     *           "account_number": "9000002140",
                     *           "account_name": "Ada Stores Ltd",
                     *           "bank_name": "Example Bank",
                     *           "bank_code": "090629",
                     *           "virtual_account": "va_01J8Z5X7Q9K2M4N6P8R0S2T4V8",
                     *           "expires_at": "2026-09-24T18:30:00.000Z"
                     *         },
                     *         "description": "Order #12345",
                     *         "metadata": {
                     *           "order_id": "12345"
                     *         },
                     *         "failure_reason": null,
                     *         "review_reason": null,
                     *         "created_at": "2026-09-24T18:00:00.000Z",
                     *         "expires_at": "2026-09-24T18:30:00.000Z",
                     *         "succeeded_at": null
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Payment"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getPaymentByReference: {
        parameters: {
            query?: {
                /** @description Embed related objects instead of their ids. `customer` embeds the customer. */
                "expand[]"?: "customer"[];
            };
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The `reference` you gave the payment. */
                reference: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The payment. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Payment retrieved",
                     *       "data": {
                     *         "id": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *         "object": "payment",
                     *         "livemode": false,
                     *         "reference": "ORDER-12345",
                     *         "amount": 5000000,
                     *         "amount_received": 0,
                     *         "fee": 0,
                     *         "stamp_duty": 0,
                     *         "net_amount": 0,
                     *         "amount_refunded": 0,
                     *         "split": null,
                     *         "split_amount": 0,
                     *         "currency": "NGN",
                     *         "status": "pending",
                     *         "payment_method": "bank_transfer",
                     *         "amount_rule": "exact",
                     *         "source": "api",
                     *         "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *         "bank_transfer": {
                     *           "account_number": "9000002140",
                     *           "account_name": "Ada Stores Ltd",
                     *           "bank_name": "Example Bank",
                     *           "bank_code": "090629",
                     *           "virtual_account": "va_01J8Z5X7Q9K2M4N6P8R0S2T4V8",
                     *           "expires_at": "2026-09-24T18:30:00.000Z"
                     *         },
                     *         "description": "Order #12345",
                     *         "metadata": {
                     *           "order_id": "12345"
                     *         },
                     *         "failure_reason": null,
                     *         "review_reason": null,
                     *         "created_at": "2026-09-24T18:00:00.000Z",
                     *         "expires_at": "2026-09-24T18:30:00.000Z",
                     *         "succeeded_at": null
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Payment"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listVirtualAccounts: {
        parameters: {
            query?: {
                /** @description Number of objects to return */
                limit?: number;
                /** @description Cursor: return objects created before this object id (older) */
                starting_after?: string;
                /** @description Cursor: return objects created after this object id (newer) */
                ending_before?: string;
                /** @description Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z */
                created?: components["schemas"]["DateRangeFilter"];
                /** @description Only objects of this type. */
                type?: "dedicated" | "dynamic";
                /** @description Only objects of this customer (`cus_…`). */
                customer?: string;
                /** @description Only objects with this status. */
                status?: "requested" | "active" | "blocked" | "expired" | "consumed" | "closed" | "failed";
                /** @description Only the account with this 10-digit number. */
                account_number?: string;
            };
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A page of virtual accounts, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Virtual accounts retrieved",
                     *       "data": [
                     *         {
                     *           "id": "va_01J8Z5X7Q9K2M4N6P8R0S2T4V8",
                     *           "object": "virtual_account",
                     *           "livemode": false,
                     *           "type": "dedicated",
                     *           "status": "active",
                     *           "account_number": "9000002140",
                     *           "account_name": "Ada Stores Ltd",
                     *           "bank_name": "Example Bank",
                     *           "bank_code": "090629",
                     *           "currency": "NGN",
                     *           "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "payment": null,
                     *           "expected_amount": null,
                     *           "amount_rule": "any",
                     *           "single_use": false,
                     *           "expires_at": null,
                     *           "closed_at": null,
                     *           "metadata": {
                     *             "plan": "wallet"
                     *           },
                     *           "created_at": "2026-09-24T18:00:00.000Z"
                     *         }
                     *       ],
                     *       "meta": {
                     *         "has_more": false,
                     *         "next_cursor": null,
                     *         "url": "/api/v1/virtual-accounts"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["VirtualAccount"][];
                        meta: components["schemas"]["ListMeta"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    createVirtualAccount: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
                /** @description A unique key for this request (1–255 printable ASCII characters). A retry with the same key and body returns the original response, with `Idempotent-Replayed: true`, instead of acting twice. Keys expire after 24 hours. */
                "Idempotency-Key"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "type": "dedicated",
                 *       "customer_id": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                 *       "metadata": {
                 *         "plan": "wallet"
                 *       }
                 *     }
                 */
                "application/json": components["schemas"]["CreateVirtualAccountDto"];
            };
        };
        responses: {
            /** @description The new virtual account. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Virtual account created",
                     *       "data": {
                     *         "id": "va_01J8Z5X7Q9K2M4N6P8R0S2T4V8",
                     *         "object": "virtual_account",
                     *         "livemode": false,
                     *         "type": "dedicated",
                     *         "status": "active",
                     *         "account_number": "9000002140",
                     *         "account_name": "Ada Stores Ltd",
                     *         "bank_name": "Example Bank",
                     *         "bank_code": "090629",
                     *         "currency": "NGN",
                     *         "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *         "payment": null,
                     *         "expected_amount": null,
                     *         "amount_rule": "any",
                     *         "single_use": false,
                     *         "expires_at": null,
                     *         "closed_at": null,
                     *         "metadata": {
                     *           "plan": "wallet"
                     *         },
                     *         "created_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["VirtualAccount"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description A request with this Idempotency-Key is still in progress */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "A payment with reference ORDER-12345 already exists",
                     *       "error": {
                     *         "type": "conflict",
                     *         "code": "duplicate_reference",
                     *         "param": "reference"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Idempotency-Key reused with a different request */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "This Idempotency-Key was used with a different request",
                     *       "error": {
                     *         "type": "idempotency_error",
                     *         "code": "idempotency_key_reused",
                     *         "param": "Idempotency-Key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description The virtual account could not be created. Nothing was created */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "The virtual account could not be created. Nothing was created; check the account details or contact support.",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "virtual_account_creation_failed"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description The service is temporarily unavailable. Nothing was sent or created; retry later with the same Idempotency-Key */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "The service is temporarily unavailable. Nothing was sent or created; retry shortly.",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "service_unavailable"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getVirtualAccount: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The virtual account id (`va_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The virtual account. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Virtual account retrieved",
                     *       "data": {
                     *         "id": "va_01J8Z5X7Q9K2M4N6P8R0S2T4V8",
                     *         "object": "virtual_account",
                     *         "livemode": false,
                     *         "type": "dedicated",
                     *         "status": "active",
                     *         "account_number": "9000002140",
                     *         "account_name": "Ada Stores Ltd",
                     *         "bank_name": "Example Bank",
                     *         "bank_code": "090629",
                     *         "currency": "NGN",
                     *         "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *         "payment": null,
                     *         "expected_amount": null,
                     *         "amount_rule": "any",
                     *         "single_use": false,
                     *         "expires_at": null,
                     *         "closed_at": null,
                     *         "metadata": {
                     *           "plan": "wallet"
                     *         },
                     *         "created_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["VirtualAccount"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getVirtualAccountByReference: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The `reference` you gave the payment. */
                reference: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The virtual account. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Virtual account retrieved",
                     *       "data": {
                     *         "id": "va_01J8Z5X7Q9K2M4N6P8R0S2T4V8",
                     *         "object": "virtual_account",
                     *         "livemode": false,
                     *         "type": "dedicated",
                     *         "status": "active",
                     *         "account_number": "9000002140",
                     *         "account_name": "Ada Stores Ltd",
                     *         "bank_name": "Example Bank",
                     *         "bank_code": "090629",
                     *         "currency": "NGN",
                     *         "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *         "payment": null,
                     *         "expected_amount": null,
                     *         "amount_rule": "any",
                     *         "single_use": false,
                     *         "expires_at": null,
                     *         "closed_at": null,
                     *         "metadata": {
                     *           "plan": "wallet"
                     *         },
                     *         "created_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["VirtualAccount"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    closeVirtualAccount: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
                /** @description A unique key for this request (1–255 printable ASCII characters). A retry with the same key and body returns the original response, with `Idempotent-Replayed: true`, instead of acting twice. Keys expire after 24 hours. */
                "Idempotency-Key"?: string;
            };
            path: {
                /** @description The virtual account id (`va_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "reason": "Customer offboarded"
                 *     }
                 */
                "application/json": components["schemas"]["CloseVirtualAccountDto"];
            };
        };
        responses: {
            /** @description The closed virtual account. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Virtual account closed",
                     *       "data": {
                     *         "id": "va_01J8Z5X7Q9K2M4N6P8R0S2T4V8",
                     *         "object": "virtual_account",
                     *         "livemode": false,
                     *         "type": "dedicated",
                     *         "status": "active",
                     *         "account_number": "9000002140",
                     *         "account_name": "Ada Stores Ltd",
                     *         "bank_name": "Example Bank",
                     *         "bank_code": "090629",
                     *         "currency": "NGN",
                     *         "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *         "payment": null,
                     *         "expected_amount": null,
                     *         "amount_rule": "any",
                     *         "single_use": false,
                     *         "expires_at": null,
                     *         "closed_at": null,
                     *         "metadata": {
                     *           "plan": "wallet"
                     *         },
                     *         "created_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["VirtualAccount"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description A request with this Idempotency-Key is still in progress */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "A payment with reference ORDER-12345 already exists",
                     *       "error": {
                     *         "type": "conflict",
                     *         "code": "duplicate_reference",
                     *         "param": "reference"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Idempotency-Key reused with a different request */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "This Idempotency-Key was used with a different request",
                     *       "error": {
                     *         "type": "idempotency_error",
                     *         "code": "idempotency_key_reused",
                     *         "param": "Idempotency-Key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listSubaccounts: {
        parameters: {
            query?: {
                /** @description Number of objects to return */
                limit?: number;
                /** @description Cursor: return objects created before this object id (older) */
                starting_after?: string;
                /** @description Cursor: return objects created after this object id (newer) */
                ending_before?: string;
                /** @description Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z */
                created?: components["schemas"]["DateRangeFilter"];
            };
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A page of subaccounts, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Subaccounts retrieved",
                     *       "data": [
                     *         {
                     *           "id": "sub_01J8Z5X7Q9K2M4N6P8R0S2T4V9",
                     *           "object": "subaccount",
                     *           "livemode": false,
                     *           "name": "Mama Ngozi Kitchen",
                     *           "email": "payouts@example.com",
                     *           "status": "active",
                     *           "settlement_account": {
                     *             "bank_code": "058",
                     *             "bank_name": "Guaranty Trust Bank",
                     *             "account_number_last4": "6789",
                     *             "account_name": "MAMA NGOZI KITCHEN",
                     *             "usable_from": "2026-09-24T18:00:00.000Z"
                     *           },
                     *           "metadata": {
                     *             "vendor_id": "v_204"
                     *           },
                     *           "created_at": "2026-09-24T18:00:00.000Z"
                     *         }
                     *       ],
                     *       "meta": {
                     *         "has_more": false,
                     *         "next_cursor": null,
                     *         "url": "/api/v1/subaccounts"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Subaccount"][];
                        meta: components["schemas"]["ListMeta"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    createSubaccount: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
                /** @description A unique key for this request (1–255 printable ASCII characters). A retry with the same key and body returns the original response, with `Idempotent-Replayed: true`, instead of acting twice. Keys expire after 24 hours. */
                "Idempotency-Key"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "name": "Mama Ngozi Kitchen",
                 *       "email": "payouts@example.com",
                 *       "bank_code": "058",
                 *       "account_number": "0123456789",
                 *       "metadata": {
                 *         "vendor_id": "v_204"
                 *       }
                 *     }
                 */
                "application/json": components["schemas"]["CreateSubaccountDto"];
            };
        };
        responses: {
            /** @description The new subaccount. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Subaccount created",
                     *       "data": {
                     *         "id": "sub_01J8Z5X7Q9K2M4N6P8R0S2T4V9",
                     *         "object": "subaccount",
                     *         "livemode": false,
                     *         "name": "Mama Ngozi Kitchen",
                     *         "email": "payouts@example.com",
                     *         "status": "active",
                     *         "settlement_account": {
                     *           "bank_code": "058",
                     *           "bank_name": "Guaranty Trust Bank",
                     *           "account_number_last4": "6789",
                     *           "account_name": "MAMA NGOZI KITCHEN",
                     *           "usable_from": "2026-09-24T18:00:00.000Z"
                     *         },
                     *         "metadata": {
                     *           "vendor_id": "v_204"
                     *         },
                     *         "created_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Subaccount"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description A request with this Idempotency-Key is still in progress */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "A payment with reference ORDER-12345 already exists",
                     *       "error": {
                     *         "type": "conflict",
                     *         "code": "duplicate_reference",
                     *         "param": "reference"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Idempotency-Key reused with a different request */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "This Idempotency-Key was used with a different request",
                     *       "error": {
                     *         "type": "idempotency_error",
                     *         "code": "idempotency_key_reused",
                     *         "param": "Idempotency-Key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description The service is temporarily unavailable. Nothing was sent or created; retry later with the same Idempotency-Key */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "The service is temporarily unavailable. Nothing was sent or created; retry shortly.",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "service_unavailable"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getSubaccount: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The subaccount id (`sub_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The subaccount. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Subaccount retrieved",
                     *       "data": {
                     *         "id": "sub_01J8Z5X7Q9K2M4N6P8R0S2T4V9",
                     *         "object": "subaccount",
                     *         "livemode": false,
                     *         "name": "Mama Ngozi Kitchen",
                     *         "email": "payouts@example.com",
                     *         "status": "active",
                     *         "settlement_account": {
                     *           "bank_code": "058",
                     *           "bank_name": "Guaranty Trust Bank",
                     *           "account_number_last4": "6789",
                     *           "account_name": "MAMA NGOZI KITCHEN",
                     *           "usable_from": "2026-09-24T18:00:00.000Z"
                     *         },
                     *         "metadata": {
                     *           "vendor_id": "v_204"
                     *         },
                     *         "created_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Subaccount"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    updateSubaccount: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The subaccount id (`sub_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "status": "inactive"
                 *     }
                 */
                "application/json": components["schemas"]["UpdateSubaccountDto"];
            };
        };
        responses: {
            /** @description The updated subaccount. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Subaccount updated",
                     *       "data": {
                     *         "id": "sub_01J8Z5X7Q9K2M4N6P8R0S2T4V9",
                     *         "object": "subaccount",
                     *         "livemode": false,
                     *         "name": "Mama Ngozi Kitchen",
                     *         "email": "payouts@example.com",
                     *         "status": "active",
                     *         "settlement_account": {
                     *           "bank_code": "058",
                     *           "bank_name": "Guaranty Trust Bank",
                     *           "account_number_last4": "6789",
                     *           "account_name": "MAMA NGOZI KITCHEN",
                     *           "usable_from": "2026-09-24T18:00:00.000Z"
                     *         },
                     *         "metadata": {
                     *           "vendor_id": "v_204"
                     *         },
                     *         "created_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Subaccount"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description The service is temporarily unavailable. Nothing was sent or created; retry later with the same Idempotency-Key */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "The service is temporarily unavailable. Nothing was sent or created; retry shortly.",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "service_unavailable"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getSubaccountBalance: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The subaccount id (`sub_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The subaccount’s balances in kobo. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Subaccount balance retrieved",
                     *       "data": {
                     *         "object": "subaccount_balance",
                     *         "subaccount": "sub_01J8Z5X7Q9K2M4N6P8R0S2T4V9",
                     *         "livemode": false,
                     *         "currency": "NGN",
                     *         "pending": 0,
                     *         "available": 3960000,
                     *         "settling": 0,
                     *         "total": 3960000,
                     *         "settled_total": 12000000
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["SubaccountBalance"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listSplitRules: {
        parameters: {
            query?: {
                /** @description Number of objects to return */
                limit?: number;
                /** @description Cursor: return objects created before this object id (older) */
                starting_after?: string;
                /** @description Cursor: return objects created after this object id (newer) */
                ending_before?: string;
                /** @description Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z */
                created?: components["schemas"]["DateRangeFilter"];
            };
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A page of split rules, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Split rules retrieved",
                     *       "data": [
                     *         {
                     *           "id": "spl_01J8Z5X7Q9K2M4N6P8R0S2T4W2",
                     *           "object": "split_rule",
                     *           "livemode": false,
                     *           "name": "Marketplace 80/20",
                     *           "type": "percentage",
                     *           "active": true,
                     *           "allocations": [
                     *             {
                     *               "subaccount": "sub_01J8Z5X7Q9K2M4N6P8R0S2T4V9",
                     *               "share": 8000
                     *             }
                     *           ],
                     *           "metadata": {},
                     *           "created_at": "2026-09-24T18:00:00.000Z"
                     *         }
                     *       ],
                     *       "meta": {
                     *         "has_more": false,
                     *         "next_cursor": null,
                     *         "url": "/api/v1/split-rules"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["SplitRule"][];
                        meta: components["schemas"]["ListMeta"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    createSplitRule: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
                /** @description A unique key for this request (1–255 printable ASCII characters). A retry with the same key and body returns the original response, with `Idempotent-Replayed: true`, instead of acting twice. Keys expire after 24 hours. */
                "Idempotency-Key"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "name": "Marketplace 80/20",
                 *       "type": "percentage",
                 *       "allocations": [
                 *         {
                 *           "subaccount": "sub_01J8Z5X7Q9K2M4N6P8R0S2T4V9",
                 *           "share": 8000
                 *         }
                 *       ]
                 *     }
                 */
                "application/json": components["schemas"]["CreateSplitRuleDto"];
            };
        };
        responses: {
            /** @description The new split rule. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Split rule created",
                     *       "data": {
                     *         "id": "spl_01J8Z5X7Q9K2M4N6P8R0S2T4W2",
                     *         "object": "split_rule",
                     *         "livemode": false,
                     *         "name": "Marketplace 80/20",
                     *         "type": "percentage",
                     *         "active": true,
                     *         "allocations": [
                     *           {
                     *             "subaccount": "sub_01J8Z5X7Q9K2M4N6P8R0S2T4V9",
                     *             "share": 8000
                     *           }
                     *         ],
                     *         "metadata": {},
                     *         "created_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["SplitRule"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description A request with this Idempotency-Key is still in progress */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "A payment with reference ORDER-12345 already exists",
                     *       "error": {
                     *         "type": "conflict",
                     *         "code": "duplicate_reference",
                     *         "param": "reference"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Idempotency-Key reused with a different request */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "This Idempotency-Key was used with a different request",
                     *       "error": {
                     *         "type": "idempotency_error",
                     *         "code": "idempotency_key_reused",
                     *         "param": "Idempotency-Key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getSplitRule: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The split rule id (`spl_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The split rule. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Split rule retrieved",
                     *       "data": {
                     *         "id": "spl_01J8Z5X7Q9K2M4N6P8R0S2T4W2",
                     *         "object": "split_rule",
                     *         "livemode": false,
                     *         "name": "Marketplace 80/20",
                     *         "type": "percentage",
                     *         "active": true,
                     *         "allocations": [
                     *           {
                     *             "subaccount": "sub_01J8Z5X7Q9K2M4N6P8R0S2T4V9",
                     *             "share": 8000
                     *           }
                     *         ],
                     *         "metadata": {},
                     *         "created_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["SplitRule"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    updateSplitRule: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The split rule id (`spl_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "active": false
                 *     }
                 */
                "application/json": components["schemas"]["UpdateSplitRuleDto"];
            };
        };
        responses: {
            /** @description The updated split rule. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Split rule updated",
                     *       "data": {
                     *         "id": "spl_01J8Z5X7Q9K2M4N6P8R0S2T4W2",
                     *         "object": "split_rule",
                     *         "livemode": false,
                     *         "name": "Marketplace 80/20",
                     *         "type": "percentage",
                     *         "active": true,
                     *         "allocations": [
                     *           {
                     *             "subaccount": "sub_01J8Z5X7Q9K2M4N6P8R0S2T4V9",
                     *             "share": 8000
                     *           }
                     *         ],
                     *         "metadata": {},
                     *         "created_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["SplitRule"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listTransfers: {
        parameters: {
            query?: {
                /** @description Number of objects to return */
                limit?: number;
                /** @description Cursor: return objects created before this object id (older) */
                starting_after?: string;
                /** @description Cursor: return objects created after this object id (newer) */
                ending_before?: string;
                /** @description Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z */
                created?: components["schemas"]["DateRangeFilter"];
                /** @description Only objects with this status. */
                status?: "pending" | "processing" | "succeeded" | "failed" | "reversed";
            };
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A page of transfers, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Transfers retrieved",
                     *       "data": [
                     *         {
                     *           "id": "trf_01J8Z5X7Q9K2M4N6P8R0S2T4W0",
                     *           "object": "transfer",
                     *           "livemode": false,
                     *           "reference": "PAYOUT-2026-0001",
                     *           "amount": 2500000,
                     *           "fee": 1500,
                     *           "total_debit": 2501500,
                     *           "currency": "NGN",
                     *           "status": "processing",
                     *           "beneficiary": {
                     *             "bank_code": "058",
                     *             "bank_name": "string",
                     *             "account_number": "0123456789",
                     *             "account_name": "ADA VENDOR ENTERPRISES"
                     *           },
                     *           "narration": "Vendor payout September",
                     *           "session_id": null,
                     *           "failure_reason": null,
                     *           "metadata": {
                     *             "vendor_id": "v_204"
                     *           },
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "completed_at": null
                     *         }
                     *       ],
                     *       "meta": {
                     *         "has_more": false,
                     *         "next_cursor": null,
                     *         "url": "/api/v1/transfers"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Transfer"][];
                        meta: components["schemas"]["ListMeta"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    createTransfer: {
        parameters: {
            query?: never;
            header: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
                /** @description Required. A unique key for this request (1–255 printable ASCII characters). A retry with the same key and body returns the original response, with `Idempotent-Replayed: true`, instead of acting twice. Keys expire after 24 hours. */
                "Idempotency-Key": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "amount": 2500000,
                 *       "currency": "NGN",
                 *       "reference": "PAYOUT-2026-0001",
                 *       "narration": "Vendor payout September",
                 *       "beneficiary": {
                 *         "bank_code": "058",
                 *         "account_number": "0123456789"
                 *       },
                 *       "metadata": {
                 *         "vendor_id": "v_204"
                 *       }
                 *     }
                 */
                "application/json": components["schemas"]["CreateTransferDto"];
            };
        };
        responses: {
            /** @description The new transfer, `pending` or `processing`. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Transfer created",
                     *       "data": {
                     *         "id": "trf_01J8Z5X7Q9K2M4N6P8R0S2T4W0",
                     *         "object": "transfer",
                     *         "livemode": false,
                     *         "reference": "PAYOUT-2026-0001",
                     *         "amount": 2500000,
                     *         "fee": 1500,
                     *         "total_debit": 2501500,
                     *         "currency": "NGN",
                     *         "status": "processing",
                     *         "beneficiary": {
                     *           "bank_code": "058",
                     *           "bank_name": "string",
                     *           "account_number": "0123456789",
                     *           "account_name": "ADA VENDOR ENTERPRISES"
                     *         },
                     *         "narration": "Vendor payout September",
                     *         "session_id": null,
                     *         "failure_reason": null,
                     *         "metadata": {
                     *           "vendor_id": "v_204"
                     *         },
                     *         "created_at": "2026-09-24T18:00:00.000Z",
                     *         "completed_at": null
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Transfer"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /**
             * @description Conflict (duplicate reference, invalid state, request in progress)
             *
             *     A request with this Idempotency-Key is still in progress
             */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "A payment with reference ORDER-12345 already exists",
                     *       "error": {
                     *         "type": "conflict",
                     *         "code": "duplicate_reference",
                     *         "param": "reference"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Idempotency-Key reused with a different request */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "This Idempotency-Key was used with a different request",
                     *       "error": {
                     *         "type": "idempotency_error",
                     *         "code": "idempotency_key_reused",
                     *         "param": "Idempotency-Key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description The service is temporarily unavailable. Nothing was sent or created; retry later with the same Idempotency-Key */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "The service is temporarily unavailable. Nothing was sent or created; retry shortly.",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "service_unavailable"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getTransfer: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The transfer id (`trf_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The transfer. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Transfer retrieved",
                     *       "data": {
                     *         "id": "trf_01J8Z5X7Q9K2M4N6P8R0S2T4W0",
                     *         "object": "transfer",
                     *         "livemode": false,
                     *         "reference": "PAYOUT-2026-0001",
                     *         "amount": 2500000,
                     *         "fee": 1500,
                     *         "total_debit": 2501500,
                     *         "currency": "NGN",
                     *         "status": "processing",
                     *         "beneficiary": {
                     *           "bank_code": "058",
                     *           "bank_name": "string",
                     *           "account_number": "0123456789",
                     *           "account_name": "ADA VENDOR ENTERPRISES"
                     *         },
                     *         "narration": "Vendor payout September",
                     *         "session_id": null,
                     *         "failure_reason": null,
                     *         "metadata": {
                     *           "vendor_id": "v_204"
                     *         },
                     *         "created_at": "2026-09-24T18:00:00.000Z",
                     *         "completed_at": null
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Transfer"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getTransferByReference: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The `reference` you gave the payment. */
                reference: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The transfer. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Transfer retrieved",
                     *       "data": {
                     *         "id": "trf_01J8Z5X7Q9K2M4N6P8R0S2T4W0",
                     *         "object": "transfer",
                     *         "livemode": false,
                     *         "reference": "PAYOUT-2026-0001",
                     *         "amount": 2500000,
                     *         "fee": 1500,
                     *         "total_debit": 2501500,
                     *         "currency": "NGN",
                     *         "status": "processing",
                     *         "beneficiary": {
                     *           "bank_code": "058",
                     *           "bank_name": "string",
                     *           "account_number": "0123456789",
                     *           "account_name": "ADA VENDOR ENTERPRISES"
                     *         },
                     *         "narration": "Vendor payout September",
                     *         "session_id": null,
                     *         "failure_reason": null,
                     *         "metadata": {
                     *           "vendor_id": "v_204"
                     *         },
                     *         "created_at": "2026-09-24T18:00:00.000Z",
                     *         "completed_at": null
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Transfer"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    resolveAccount: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "bank_code": "058",
                 *       "account_number": "0123456789"
                 *     }
                 */
                "application/json": components["schemas"]["NameEnquiryDto"];
            };
        };
        responses: {
            /** @description The resolved account. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Account resolved",
                     *       "data": {
                     *         "object": "account_resolution",
                     *         "bank_code": "058",
                     *         "account_number": "0123456789",
                     *         "account_name": "ADA VENDOR ENTERPRISES"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["AccountResolution"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description The service is temporarily unavailable. Nothing was sent or created; retry later with the same Idempotency-Key */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "The service is temporarily unavailable. Nothing was sent or created; retry shortly.",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "service_unavailable"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listBanks: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description All supported banks (not paginated). */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Banks retrieved",
                     *       "data": [
                     *         {
                     *           "object": "bank",
                     *           "code": "058",
                     *           "name": "Guaranty Trust Bank"
                     *         }
                     *       ],
                     *       "meta": {
                     *         "has_more": false,
                     *         "next_cursor": null,
                     *         "url": "/api/v1/banks"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Bank"][];
                        meta: components["schemas"]["ListMeta"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description The service is temporarily unavailable. Nothing was sent or created; retry later with the same Idempotency-Key */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "The service is temporarily unavailable. Nothing was sent or created; retry shortly.",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "service_unavailable"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listSettlements: {
        parameters: {
            query?: {
                /** @description Number of objects to return */
                limit?: number;
                /** @description Cursor: return objects created before this object id (older) */
                starting_after?: string;
                /** @description Cursor: return objects created after this object id (newer) */
                ending_before?: string;
                /** @description Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z */
                created?: components["schemas"]["DateRangeFilter"];
                /** @description Only objects with this status. */
                status?: "pending" | "processing" | "completed" | "failed";
                /** @description Only settlements of this subaccount (sub_…) */
                subaccount?: string;
            };
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A page of settlements, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Settlements retrieved",
                     *       "data": [
                     *         {
                     *           "id": "stl_01J8Z5X7Q9K2M4N6P8R0S2T4WC",
                     *           "object": "settlement",
                     *           "livemode": false,
                     *           "subaccount": null,
                     *           "status": "completed",
                     *           "trigger": "scheduled",
                     *           "amount": 31480000,
                     *           "fee": 0,
                     *           "transfer_fee": 1500,
                     *           "transfer_fee_vat": 113,
                     *           "stamp_duty": 5000,
                     *           "total_deducted": 31486613,
                     *           "reserve_retained": 0,
                     *           "currency": "NGN",
                     *           "settlement_account": {
                     *             "id": "sta_01J8Z5X7Q9K2M4N6P8R0S2T4WD",
                     *             "bank_code": "058",
                     *             "bank_name": "string",
                     *             "account_number_last4": "4321",
                     *             "account_name": "ADA STORES LTD"
                     *           },
                     *           "transfer": {
                     *             "status": "succeeded",
                     *             "session_id": "090629260924180412000000000001"
                     *           },
                     *           "failure_reason": null,
                     *           "cutoff_at": "2026-09-24T18:00:00.000Z",
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "completed_at": "2026-09-24T18:04:12.000Z"
                     *         }
                     *       ],
                     *       "meta": {
                     *         "has_more": false,
                     *         "next_cursor": null,
                     *         "url": "/api/v1/settlements"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Settlement"][];
                        meta: components["schemas"]["ListMeta"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getSettlement: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The settlement id (`stl_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The settlement. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Settlement retrieved",
                     *       "data": {
                     *         "id": "stl_01J8Z5X7Q9K2M4N6P8R0S2T4WC",
                     *         "object": "settlement",
                     *         "livemode": false,
                     *         "subaccount": null,
                     *         "status": "completed",
                     *         "trigger": "scheduled",
                     *         "amount": 31480000,
                     *         "fee": 0,
                     *         "transfer_fee": 1500,
                     *         "transfer_fee_vat": 113,
                     *         "stamp_duty": 5000,
                     *         "total_deducted": 31486613,
                     *         "reserve_retained": 0,
                     *         "currency": "NGN",
                     *         "settlement_account": {
                     *           "id": "sta_01J8Z5X7Q9K2M4N6P8R0S2T4WD",
                     *           "bank_code": "058",
                     *           "bank_name": "string",
                     *           "account_number_last4": "4321",
                     *           "account_name": "ADA STORES LTD"
                     *         },
                     *         "transfer": {
                     *           "status": "succeeded",
                     *           "session_id": "090629260924180412000000000001"
                     *         },
                     *         "failure_reason": null,
                     *         "cutoff_at": "2026-09-24T18:00:00.000Z",
                     *         "created_at": "2026-09-24T18:00:00.000Z",
                     *         "completed_at": "2026-09-24T18:04:12.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Settlement"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listSettlementItems: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The settlement id (`stl_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description All items of the settlement (not paginated). */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Settlement items retrieved",
                     *       "data": [
                     *         {
                     *           "object": "settlement_item",
                     *           "ledger_transaction": "jrn_01J8Z5X7Q9K2M4N6P8R0S2T4W9",
                     *           "type": "funds_release",
                     *           "source": {
                     *             "object": "payment",
                     *             "id": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6"
                     *           },
                     *           "available_delta": 4950000,
                     *           "posted_at": "2026-09-24T18:04:12.000Z"
                     *         }
                     *       ],
                     *       "meta": {
                     *         "has_more": false,
                     *         "next_cursor": null,
                     *         "url": "/api/v1/settlements"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["SettlementItem"][];
                        meta: components["schemas"]["ListMeta"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listRefunds: {
        parameters: {
            query?: {
                /** @description Number of objects to return */
                limit?: number;
                /** @description Cursor: return objects created before this object id (older) */
                starting_after?: string;
                /** @description Cursor: return objects created after this object id (newer) */
                ending_before?: string;
                /** @description Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z */
                created?: components["schemas"]["DateRangeFilter"];
                /** @description Only refunds of this payment (pay_…) */
                payment?: string;
            };
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A page of refunds, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Refunds retrieved",
                     *       "data": [
                     *         {
                     *           "id": "re_01J8Z5X7Q9K2M4N6P8R0S2T4W1",
                     *           "object": "refund",
                     *           "livemode": false,
                     *           "payment": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *           "reference": "RFND-12345",
                     *           "amount": 1000000,
                     *           "fee": 1500,
                     *           "currency": "NGN",
                     *           "reason": "Customer returned the item",
                     *           "status": "processing",
                     *           "destination": {
                     *             "bank_code": "058",
                     *             "bank_name": "string",
                     *             "account_number_last4": "6789",
                     *             "account_name": "CHIDI OKEKE"
                     *           },
                     *           "transfer": {
                     *             "status": "processing",
                     *             "session_id": null
                     *           },
                     *           "failure_reason": null,
                     *           "metadata": {},
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "completed_at": null
                     *         }
                     *       ],
                     *       "meta": {
                     *         "has_more": false,
                     *         "next_cursor": null,
                     *         "url": "/api/v1/refunds"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Refund"][];
                        meta: components["schemas"]["ListMeta"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    createRefund: {
        parameters: {
            query?: never;
            header: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
                /** @description Required. A unique key for this request (1–255 printable ASCII characters). A retry with the same key and body returns the original response, with `Idempotent-Replayed: true`, instead of acting twice. Keys expire after 24 hours. */
                "Idempotency-Key": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "payment": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                 *       "amount": 1000000,
                 *       "reason": "Customer returned the item",
                 *       "reference": "RFND-12345"
                 *     }
                 */
                "application/json": components["schemas"]["CreateRefundDto"];
            };
        };
        responses: {
            /** @description The new refund, `pending` or `processing`. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Refund created",
                     *       "data": {
                     *         "id": "re_01J8Z5X7Q9K2M4N6P8R0S2T4W1",
                     *         "object": "refund",
                     *         "livemode": false,
                     *         "payment": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *         "reference": "RFND-12345",
                     *         "amount": 1000000,
                     *         "fee": 1500,
                     *         "currency": "NGN",
                     *         "reason": "Customer returned the item",
                     *         "status": "processing",
                     *         "destination": {
                     *           "bank_code": "058",
                     *           "bank_name": "string",
                     *           "account_number_last4": "6789",
                     *           "account_name": "CHIDI OKEKE"
                     *         },
                     *         "transfer": {
                     *           "status": "processing",
                     *           "session_id": null
                     *         },
                     *         "failure_reason": null,
                     *         "metadata": {},
                     *         "created_at": "2026-09-24T18:00:00.000Z",
                     *         "completed_at": null
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Refund"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /**
             * @description Conflict (duplicate reference, invalid state, request in progress)
             *
             *     A request with this Idempotency-Key is still in progress
             */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "A payment with reference ORDER-12345 already exists",
                     *       "error": {
                     *         "type": "conflict",
                     *         "code": "duplicate_reference",
                     *         "param": "reference"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Idempotency-Key reused with a different request */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "This Idempotency-Key was used with a different request",
                     *       "error": {
                     *         "type": "idempotency_error",
                     *         "code": "idempotency_key_reused",
                     *         "param": "Idempotency-Key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description The service is temporarily unavailable. Nothing was sent or created; retry later with the same Idempotency-Key */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "The service is temporarily unavailable. Nothing was sent or created; retry shortly.",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "service_unavailable"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getRefund: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The refund id (`re_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The refund. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Refund retrieved",
                     *       "data": {
                     *         "id": "re_01J8Z5X7Q9K2M4N6P8R0S2T4W1",
                     *         "object": "refund",
                     *         "livemode": false,
                     *         "payment": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *         "reference": "RFND-12345",
                     *         "amount": 1000000,
                     *         "fee": 1500,
                     *         "currency": "NGN",
                     *         "reason": "Customer returned the item",
                     *         "status": "processing",
                     *         "destination": {
                     *           "bank_code": "058",
                     *           "bank_name": "string",
                     *           "account_number_last4": "6789",
                     *           "account_name": "CHIDI OKEKE"
                     *         },
                     *         "transfer": {
                     *           "status": "processing",
                     *           "session_id": null
                     *         },
                     *         "failure_reason": null,
                     *         "metadata": {},
                     *         "created_at": "2026-09-24T18:00:00.000Z",
                     *         "completed_at": null
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Refund"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getRefundByReference: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The `reference` you gave the payment. */
                reference: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The refund. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Refund retrieved",
                     *       "data": {
                     *         "id": "re_01J8Z5X7Q9K2M4N6P8R0S2T4W1",
                     *         "object": "refund",
                     *         "livemode": false,
                     *         "payment": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *         "reference": "RFND-12345",
                     *         "amount": 1000000,
                     *         "fee": 1500,
                     *         "currency": "NGN",
                     *         "reason": "Customer returned the item",
                     *         "status": "processing",
                     *         "destination": {
                     *           "bank_code": "058",
                     *           "bank_name": "string",
                     *           "account_number_last4": "6789",
                     *           "account_name": "CHIDI OKEKE"
                     *         },
                     *         "transfer": {
                     *           "status": "processing",
                     *           "session_id": null
                     *         },
                     *         "failure_reason": null,
                     *         "metadata": {},
                     *         "created_at": "2026-09-24T18:00:00.000Z",
                     *         "completed_at": null
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Refund"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listCheckoutSessions: {
        parameters: {
            query?: {
                /** @description Number of objects to return */
                limit?: number;
                /** @description Cursor: return objects created before this object id (older) */
                starting_after?: string;
                /** @description Cursor: return objects created after this object id (newer) */
                ending_before?: string;
                /** @description Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z */
                created?: components["schemas"]["DateRangeFilter"];
                /** @description Only objects with this status. */
                status?: "open" | "complete" | "expired";
                /** @description Only sessions started from this payment link (plink_…) */
                payment_link?: string;
            };
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A page of checkout sessions, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Checkout sessions retrieved",
                     *       "data": [
                     *         {
                     *           "id": "cs_01J8Z5X7Q9K2M4N6P8R0S2T4W3",
                     *           "object": "checkout_session",
                     *           "livemode": false,
                     *           "status": "open",
                     *           "url": "https://checkout.pletopay.com/c/u5Qm2x9Lk3Rt8Wv1Yz4Ab7Cd0Ef6Gh2J",
                     *           "amount": 5000000,
                     *           "currency": "NGN",
                     *           "reference": "ORDER-12345",
                     *           "description": "Order #12345",
                     *           "customer": null,
                     *           "customer_email": "customer@example.com",
                     *           "payment": null,
                     *           "payment_link": null,
                     *           "invoice": null,
                     *           "split": null,
                     *           "payment_method_types": [
                     *             "bank_transfer"
                     *           ],
                     *           "success_url": "https://example.com/orders/12345/thanks",
                     *           "cancel_url": "https://example.com/cart",
                     *           "metadata": {
                     *             "order_id": "12345"
                     *           },
                     *           "expires_at": "2026-09-24T19:00:00.000Z",
                     *           "completed_at": null,
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "token": "u5Qm2x9Lk3Rt8Wv1Yz4Ab7Cd0Ef6Gh2J"
                     *         }
                     *       ],
                     *       "meta": {
                     *         "has_more": false,
                     *         "next_cursor": null,
                     *         "url": "/api/v1/checkout/sessions"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["CheckoutSession"][];
                        meta: components["schemas"]["ListMeta"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    createCheckoutSession: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
                /** @description A unique key for this request (1–255 printable ASCII characters). A retry with the same key and body returns the original response, with `Idempotent-Replayed: true`, instead of acting twice. Keys expire after 24 hours. */
                "Idempotency-Key"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "amount": 5000000,
                 *       "currency": "NGN",
                 *       "reference": "ORDER-12345",
                 *       "description": "Order #12345",
                 *       "customer_email": "customer@example.com",
                 *       "success_url": "https://example.com/orders/12345/thanks",
                 *       "cancel_url": "https://example.com/cart",
                 *       "metadata": {
                 *         "order_id": "12345"
                 *       }
                 *     }
                 */
                "application/json": components["schemas"]["CreateCheckoutSessionDto"];
            };
        };
        responses: {
            /** @description The new checkout session, `open`. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Checkout session created",
                     *       "data": {
                     *         "id": "cs_01J8Z5X7Q9K2M4N6P8R0S2T4W3",
                     *         "object": "checkout_session",
                     *         "livemode": false,
                     *         "status": "open",
                     *         "url": "https://checkout.pletopay.com/c/u5Qm2x9Lk3Rt8Wv1Yz4Ab7Cd0Ef6Gh2J",
                     *         "amount": 5000000,
                     *         "currency": "NGN",
                     *         "reference": "ORDER-12345",
                     *         "description": "Order #12345",
                     *         "customer": null,
                     *         "customer_email": "customer@example.com",
                     *         "payment": null,
                     *         "payment_link": null,
                     *         "invoice": null,
                     *         "split": null,
                     *         "payment_method_types": [
                     *           "bank_transfer"
                     *         ],
                     *         "success_url": "https://example.com/orders/12345/thanks",
                     *         "cancel_url": "https://example.com/cart",
                     *         "metadata": {
                     *           "order_id": "12345"
                     *         },
                     *         "expires_at": "2026-09-24T19:00:00.000Z",
                     *         "completed_at": null,
                     *         "created_at": "2026-09-24T18:00:00.000Z",
                     *         "token": "u5Qm2x9Lk3Rt8Wv1Yz4Ab7Cd0Ef6Gh2J"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["CheckoutSession"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description A request with this Idempotency-Key is still in progress */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "A payment with reference ORDER-12345 already exists",
                     *       "error": {
                     *         "type": "conflict",
                     *         "code": "duplicate_reference",
                     *         "param": "reference"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Idempotency-Key reused with a different request */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "This Idempotency-Key was used with a different request",
                     *       "error": {
                     *         "type": "idempotency_error",
                     *         "code": "idempotency_key_reused",
                     *         "param": "Idempotency-Key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getCheckoutSession: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The checkout session id (`cs_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The checkout session. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Checkout session retrieved",
                     *       "data": {
                     *         "id": "cs_01J8Z5X7Q9K2M4N6P8R0S2T4W3",
                     *         "object": "checkout_session",
                     *         "livemode": false,
                     *         "status": "open",
                     *         "url": "https://checkout.pletopay.com/c/u5Qm2x9Lk3Rt8Wv1Yz4Ab7Cd0Ef6Gh2J",
                     *         "amount": 5000000,
                     *         "currency": "NGN",
                     *         "reference": "ORDER-12345",
                     *         "description": "Order #12345",
                     *         "customer": null,
                     *         "customer_email": "customer@example.com",
                     *         "payment": null,
                     *         "payment_link": null,
                     *         "invoice": null,
                     *         "split": null,
                     *         "payment_method_types": [
                     *           "bank_transfer"
                     *         ],
                     *         "success_url": "https://example.com/orders/12345/thanks",
                     *         "cancel_url": "https://example.com/cart",
                     *         "metadata": {
                     *           "order_id": "12345"
                     *         },
                     *         "expires_at": "2026-09-24T19:00:00.000Z",
                     *         "completed_at": null,
                     *         "created_at": "2026-09-24T18:00:00.000Z",
                     *         "token": "u5Qm2x9Lk3Rt8Wv1Yz4Ab7Cd0Ef6Gh2J"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["CheckoutSession"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getCheckoutSessionByReference: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The `reference` you gave the payment. */
                reference: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The checkout session. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Checkout session retrieved",
                     *       "data": {
                     *         "id": "cs_01J8Z5X7Q9K2M4N6P8R0S2T4W3",
                     *         "object": "checkout_session",
                     *         "livemode": false,
                     *         "status": "open",
                     *         "url": "https://checkout.pletopay.com/c/u5Qm2x9Lk3Rt8Wv1Yz4Ab7Cd0Ef6Gh2J",
                     *         "amount": 5000000,
                     *         "currency": "NGN",
                     *         "reference": "ORDER-12345",
                     *         "description": "Order #12345",
                     *         "customer": null,
                     *         "customer_email": "customer@example.com",
                     *         "payment": null,
                     *         "payment_link": null,
                     *         "invoice": null,
                     *         "split": null,
                     *         "payment_method_types": [
                     *           "bank_transfer"
                     *         ],
                     *         "success_url": "https://example.com/orders/12345/thanks",
                     *         "cancel_url": "https://example.com/cart",
                     *         "metadata": {
                     *           "order_id": "12345"
                     *         },
                     *         "expires_at": "2026-09-24T19:00:00.000Z",
                     *         "completed_at": null,
                     *         "created_at": "2026-09-24T18:00:00.000Z",
                     *         "token": "u5Qm2x9Lk3Rt8Wv1Yz4Ab7Cd0Ef6Gh2J"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["CheckoutSession"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    expireCheckoutSession: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The checkout session id (`cs_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The expired checkout session. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Checkout session expired",
                     *       "data": {
                     *         "id": "cs_01J8Z5X7Q9K2M4N6P8R0S2T4W3",
                     *         "object": "checkout_session",
                     *         "livemode": false,
                     *         "status": "open",
                     *         "url": "https://checkout.pletopay.com/c/u5Qm2x9Lk3Rt8Wv1Yz4Ab7Cd0Ef6Gh2J",
                     *         "amount": 5000000,
                     *         "currency": "NGN",
                     *         "reference": "ORDER-12345",
                     *         "description": "Order #12345",
                     *         "customer": null,
                     *         "customer_email": "customer@example.com",
                     *         "payment": null,
                     *         "payment_link": null,
                     *         "invoice": null,
                     *         "split": null,
                     *         "payment_method_types": [
                     *           "bank_transfer"
                     *         ],
                     *         "success_url": "https://example.com/orders/12345/thanks",
                     *         "cancel_url": "https://example.com/cart",
                     *         "metadata": {
                     *           "order_id": "12345"
                     *         },
                     *         "expires_at": "2026-09-24T19:00:00.000Z",
                     *         "completed_at": null,
                     *         "created_at": "2026-09-24T18:00:00.000Z",
                     *         "token": "u5Qm2x9Lk3Rt8Wv1Yz4Ab7Cd0Ef6Gh2J"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["CheckoutSession"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Conflict (duplicate reference, invalid state, request in progress) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "A payment with reference ORDER-12345 already exists",
                     *       "error": {
                     *         "type": "conflict",
                     *         "code": "duplicate_reference",
                     *         "param": "reference"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listPaymentLinks: {
        parameters: {
            query?: {
                /** @description Number of objects to return */
                limit?: number;
                /** @description Cursor: return objects created before this object id (older) */
                starting_after?: string;
                /** @description Cursor: return objects created after this object id (newer) */
                ending_before?: string;
                /** @description Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z */
                created?: components["schemas"]["DateRangeFilter"];
                /** @description Only objects with this status. */
                status?: "active" | "inactive";
            };
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A page of payment links, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Payment links retrieved",
                     *       "data": [
                     *         {
                     *           "id": "plink_01J8Z5X7Q9K2M4N6P8R0S2T4W4",
                     *           "object": "payment_link",
                     *           "livemode": false,
                     *           "active": true,
                     *           "url": "https://checkout.pletopay.com/l/donate-example",
                     *           "name": "Donation",
                     *           "description": "Support our community library",
                     *           "amount": null,
                     *           "min_amount": 100000,
                     *           "max_amount": 50000000,
                     *           "currency": "NGN",
                     *           "max_uses": null,
                     *           "uses": 12,
                     *           "split": null,
                     *           "success_url": "https://example.com/thanks",
                     *           "cancel_url": null,
                     *           "expires_at": null,
                     *           "metadata": {},
                     *           "created_at": "2026-09-24T18:00:00.000Z"
                     *         }
                     *       ],
                     *       "meta": {
                     *         "has_more": false,
                     *         "next_cursor": null,
                     *         "url": "/api/v1/payment-links"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["PaymentLink"][];
                        meta: components["schemas"]["ListMeta"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    createPaymentLink: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
                /** @description A unique key for this request (1–255 printable ASCII characters). A retry with the same key and body returns the original response, with `Idempotent-Replayed: true`, instead of acting twice. Keys expire after 24 hours. */
                "Idempotency-Key"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "name": "Donation",
                 *       "description": "Support our community library",
                 *       "min_amount": 100000,
                 *       "max_amount": 50000000,
                 *       "success_url": "https://example.com/thanks"
                 *     }
                 */
                "application/json": components["schemas"]["CreatePaymentLinkDto"];
            };
        };
        responses: {
            /** @description The new payment link. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Payment link created",
                     *       "data": {
                     *         "id": "plink_01J8Z5X7Q9K2M4N6P8R0S2T4W4",
                     *         "object": "payment_link",
                     *         "livemode": false,
                     *         "active": true,
                     *         "url": "https://checkout.pletopay.com/l/donate-example",
                     *         "name": "Donation",
                     *         "description": "Support our community library",
                     *         "amount": null,
                     *         "min_amount": 100000,
                     *         "max_amount": 50000000,
                     *         "currency": "NGN",
                     *         "max_uses": null,
                     *         "uses": 12,
                     *         "split": null,
                     *         "success_url": "https://example.com/thanks",
                     *         "cancel_url": null,
                     *         "expires_at": null,
                     *         "metadata": {},
                     *         "created_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["PaymentLink"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description A request with this Idempotency-Key is still in progress */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "A payment with reference ORDER-12345 already exists",
                     *       "error": {
                     *         "type": "conflict",
                     *         "code": "duplicate_reference",
                     *         "param": "reference"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Idempotency-Key reused with a different request */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "This Idempotency-Key was used with a different request",
                     *       "error": {
                     *         "type": "idempotency_error",
                     *         "code": "idempotency_key_reused",
                     *         "param": "Idempotency-Key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getPaymentLink: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The payment link id (`plink_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The payment link. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Payment link retrieved",
                     *       "data": {
                     *         "id": "plink_01J8Z5X7Q9K2M4N6P8R0S2T4W4",
                     *         "object": "payment_link",
                     *         "livemode": false,
                     *         "active": true,
                     *         "url": "https://checkout.pletopay.com/l/donate-example",
                     *         "name": "Donation",
                     *         "description": "Support our community library",
                     *         "amount": null,
                     *         "min_amount": 100000,
                     *         "max_amount": 50000000,
                     *         "currency": "NGN",
                     *         "max_uses": null,
                     *         "uses": 12,
                     *         "split": null,
                     *         "success_url": "https://example.com/thanks",
                     *         "cancel_url": null,
                     *         "expires_at": null,
                     *         "metadata": {},
                     *         "created_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["PaymentLink"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    updatePaymentLink: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The payment link id (`plink_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "active": false
                 *     }
                 */
                "application/json": components["schemas"]["UpdatePaymentLinkDto"];
            };
        };
        responses: {
            /** @description The updated payment link. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Payment link updated",
                     *       "data": {
                     *         "id": "plink_01J8Z5X7Q9K2M4N6P8R0S2T4W4",
                     *         "object": "payment_link",
                     *         "livemode": false,
                     *         "active": true,
                     *         "url": "https://checkout.pletopay.com/l/donate-example",
                     *         "name": "Donation",
                     *         "description": "Support our community library",
                     *         "amount": null,
                     *         "min_amount": 100000,
                     *         "max_amount": 50000000,
                     *         "currency": "NGN",
                     *         "max_uses": null,
                     *         "uses": 12,
                     *         "split": null,
                     *         "success_url": "https://example.com/thanks",
                     *         "cancel_url": null,
                     *         "expires_at": null,
                     *         "metadata": {},
                     *         "created_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["PaymentLink"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listInvoices: {
        parameters: {
            query?: {
                /** @description Number of objects to return */
                limit?: number;
                /** @description Cursor: return objects created before this object id (older) */
                starting_after?: string;
                /** @description Cursor: return objects created after this object id (newer) */
                ending_before?: string;
                /** @description Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z */
                created?: components["schemas"]["DateRangeFilter"];
                /** @description Only objects with this status. */
                status?: "draft" | "open" | "paid" | "void" | "uncollectible";
                /** @description Customer (cus_…) */
                customer?: string;
                /** @description Invoices issued by this subscription (sbs_…) */
                subscription?: string;
            };
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A page of invoices, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Invoices retrieved",
                     *       "data": [
                     *         {
                     *           "id": "inv_01J8Z5X7Q9K2M4N6P8R0S2T4W5",
                     *           "object": "invoice",
                     *           "livemode": false,
                     *           "number": "INV-000042",
                     *           "status": "open",
                     *           "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "currency": "NGN",
                     *           "items": [
                     *             {
                     *               "description": "Website design",
                     *               "quantity": 1,
                     *               "unit_amount": 15000000,
                     *               "amount": 15000000
                     *             },
                     *             {
                     *               "description": "Hosting (12 months)",
                     *               "quantity": 1,
                     *               "unit_amount": 3000000,
                     *               "amount": 3000000
                     *             }
                     *           ],
                     *           "taxes": [
                     *             {
                     *               "name": "VAT",
                     *               "bps": 750,
                     *               "amount": 1350000
                     *             }
                     *           ],
                     *           "subtotal": 18000000,
                     *           "tax_amount": 1350000,
                     *           "total": 19350000,
                     *           "amount_paid": 0,
                     *           "amount_due": 19350000,
                     *           "memo": "Thank you for your business.",
                     *           "due_date": "2026-10-15T00:00:00.000Z",
                     *           "hosted_invoice_url": "https://checkout.pletopay.com/i/inv_tok_example",
                     *           "payment": null,
                     *           "split": null,
                     *           "subscription": null,
                     *           "period_start": null,
                     *           "period_end": null,
                     *           "metadata": {},
                     *           "finalized_at": "2026-09-24T18:04:12.000Z",
                     *           "paid_at": null,
                     *           "voided_at": null,
                     *           "created_at": "2026-09-24T18:00:00.000Z"
                     *         }
                     *       ],
                     *       "meta": {
                     *         "has_more": false,
                     *         "next_cursor": null,
                     *         "url": "/api/v1/invoices"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Invoice"][];
                        meta: components["schemas"]["ListMeta"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    createInvoice: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
                /** @description A unique key for this request (1–255 printable ASCII characters). A retry with the same key and body returns the original response, with `Idempotent-Replayed: true`, instead of acting twice. Keys expire after 24 hours. */
                "Idempotency-Key"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                 *       "items": [
                 *         {
                 *           "description": "Website design",
                 *           "quantity": 1,
                 *           "unit_amount": 15000000
                 *         },
                 *         {
                 *           "description": "Hosting (12 months)",
                 *           "quantity": 1,
                 *           "unit_amount": 3000000
                 *         }
                 *       ],
                 *       "taxes": [
                 *         {
                 *           "name": "VAT",
                 *           "bps": 750
                 *         }
                 *       ],
                 *       "due_date": "2026-10-15T00:00:00.000Z",
                 *       "memo": "Thank you for your business."
                 *     }
                 */
                "application/json": components["schemas"]["CreateInvoiceDto"];
            };
        };
        responses: {
            /** @description The new draft invoice. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Invoice created",
                     *       "data": {
                     *         "id": "inv_01J8Z5X7Q9K2M4N6P8R0S2T4W5",
                     *         "object": "invoice",
                     *         "livemode": false,
                     *         "number": "INV-000042",
                     *         "status": "open",
                     *         "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *         "currency": "NGN",
                     *         "items": [
                     *           {
                     *             "description": "Website design",
                     *             "quantity": 1,
                     *             "unit_amount": 15000000,
                     *             "amount": 15000000
                     *           },
                     *           {
                     *             "description": "Hosting (12 months)",
                     *             "quantity": 1,
                     *             "unit_amount": 3000000,
                     *             "amount": 3000000
                     *           }
                     *         ],
                     *         "taxes": [
                     *           {
                     *             "name": "VAT",
                     *             "bps": 750,
                     *             "amount": 1350000
                     *           }
                     *         ],
                     *         "subtotal": 18000000,
                     *         "tax_amount": 1350000,
                     *         "total": 19350000,
                     *         "amount_paid": 0,
                     *         "amount_due": 19350000,
                     *         "memo": "Thank you for your business.",
                     *         "due_date": "2026-10-15T00:00:00.000Z",
                     *         "hosted_invoice_url": "https://checkout.pletopay.com/i/inv_tok_example",
                     *         "payment": null,
                     *         "split": null,
                     *         "subscription": null,
                     *         "period_start": null,
                     *         "period_end": null,
                     *         "metadata": {},
                     *         "finalized_at": "2026-09-24T18:04:12.000Z",
                     *         "paid_at": null,
                     *         "voided_at": null,
                     *         "created_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Invoice"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description A request with this Idempotency-Key is still in progress */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "A payment with reference ORDER-12345 already exists",
                     *       "error": {
                     *         "type": "conflict",
                     *         "code": "duplicate_reference",
                     *         "param": "reference"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Idempotency-Key reused with a different request */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "This Idempotency-Key was used with a different request",
                     *       "error": {
                     *         "type": "idempotency_error",
                     *         "code": "idempotency_key_reused",
                     *         "param": "Idempotency-Key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getInvoice: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The invoice id (`inv_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The invoice. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Invoice retrieved",
                     *       "data": {
                     *         "id": "inv_01J8Z5X7Q9K2M4N6P8R0S2T4W5",
                     *         "object": "invoice",
                     *         "livemode": false,
                     *         "number": "INV-000042",
                     *         "status": "open",
                     *         "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *         "currency": "NGN",
                     *         "items": [
                     *           {
                     *             "description": "Website design",
                     *             "quantity": 1,
                     *             "unit_amount": 15000000,
                     *             "amount": 15000000
                     *           },
                     *           {
                     *             "description": "Hosting (12 months)",
                     *             "quantity": 1,
                     *             "unit_amount": 3000000,
                     *             "amount": 3000000
                     *           }
                     *         ],
                     *         "taxes": [
                     *           {
                     *             "name": "VAT",
                     *             "bps": 750,
                     *             "amount": 1350000
                     *           }
                     *         ],
                     *         "subtotal": 18000000,
                     *         "tax_amount": 1350000,
                     *         "total": 19350000,
                     *         "amount_paid": 0,
                     *         "amount_due": 19350000,
                     *         "memo": "Thank you for your business.",
                     *         "due_date": "2026-10-15T00:00:00.000Z",
                     *         "hosted_invoice_url": "https://checkout.pletopay.com/i/inv_tok_example",
                     *         "payment": null,
                     *         "split": null,
                     *         "subscription": null,
                     *         "period_start": null,
                     *         "period_end": null,
                     *         "metadata": {},
                     *         "finalized_at": "2026-09-24T18:04:12.000Z",
                     *         "paid_at": null,
                     *         "voided_at": null,
                     *         "created_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Invoice"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    updateInvoice: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The invoice id (`inv_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "due_date": "2026-10-31T00:00:00.000Z",
                 *       "memo": "Due end of month."
                 *     }
                 */
                "application/json": components["schemas"]["UpdateInvoiceDto"];
            };
        };
        responses: {
            /** @description The updated draft invoice. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Invoice updated",
                     *       "data": {
                     *         "id": "inv_01J8Z5X7Q9K2M4N6P8R0S2T4W5",
                     *         "object": "invoice",
                     *         "livemode": false,
                     *         "number": "INV-000042",
                     *         "status": "open",
                     *         "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *         "currency": "NGN",
                     *         "items": [
                     *           {
                     *             "description": "Website design",
                     *             "quantity": 1,
                     *             "unit_amount": 15000000,
                     *             "amount": 15000000
                     *           },
                     *           {
                     *             "description": "Hosting (12 months)",
                     *             "quantity": 1,
                     *             "unit_amount": 3000000,
                     *             "amount": 3000000
                     *           }
                     *         ],
                     *         "taxes": [
                     *           {
                     *             "name": "VAT",
                     *             "bps": 750,
                     *             "amount": 1350000
                     *           }
                     *         ],
                     *         "subtotal": 18000000,
                     *         "tax_amount": 1350000,
                     *         "total": 19350000,
                     *         "amount_paid": 0,
                     *         "amount_due": 19350000,
                     *         "memo": "Thank you for your business.",
                     *         "due_date": "2026-10-15T00:00:00.000Z",
                     *         "hosted_invoice_url": "https://checkout.pletopay.com/i/inv_tok_example",
                     *         "payment": null,
                     *         "split": null,
                     *         "subscription": null,
                     *         "period_start": null,
                     *         "period_end": null,
                     *         "metadata": {},
                     *         "finalized_at": "2026-09-24T18:04:12.000Z",
                     *         "paid_at": null,
                     *         "voided_at": null,
                     *         "created_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Invoice"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Conflict (duplicate reference, invalid state, request in progress) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "A payment with reference ORDER-12345 already exists",
                     *       "error": {
                     *         "type": "conflict",
                     *         "code": "duplicate_reference",
                     *         "param": "reference"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    finalizeInvoice: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The invoice id (`inv_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The invoice, now `open`. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Invoice finalized",
                     *       "data": {
                     *         "id": "inv_01J8Z5X7Q9K2M4N6P8R0S2T4W5",
                     *         "object": "invoice",
                     *         "livemode": false,
                     *         "number": "INV-000042",
                     *         "status": "open",
                     *         "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *         "currency": "NGN",
                     *         "items": [
                     *           {
                     *             "description": "Website design",
                     *             "quantity": 1,
                     *             "unit_amount": 15000000,
                     *             "amount": 15000000
                     *           },
                     *           {
                     *             "description": "Hosting (12 months)",
                     *             "quantity": 1,
                     *             "unit_amount": 3000000,
                     *             "amount": 3000000
                     *           }
                     *         ],
                     *         "taxes": [
                     *           {
                     *             "name": "VAT",
                     *             "bps": 750,
                     *             "amount": 1350000
                     *           }
                     *         ],
                     *         "subtotal": 18000000,
                     *         "tax_amount": 1350000,
                     *         "total": 19350000,
                     *         "amount_paid": 0,
                     *         "amount_due": 19350000,
                     *         "memo": "Thank you for your business.",
                     *         "due_date": "2026-10-15T00:00:00.000Z",
                     *         "hosted_invoice_url": "https://checkout.pletopay.com/i/inv_tok_example",
                     *         "payment": null,
                     *         "split": null,
                     *         "subscription": null,
                     *         "period_start": null,
                     *         "period_end": null,
                     *         "metadata": {},
                     *         "finalized_at": "2026-09-24T18:04:12.000Z",
                     *         "paid_at": null,
                     *         "voided_at": null,
                     *         "created_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Invoice"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Conflict (duplicate reference, invalid state, request in progress) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "A payment with reference ORDER-12345 already exists",
                     *       "error": {
                     *         "type": "conflict",
                     *         "code": "duplicate_reference",
                     *         "param": "reference"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    voidInvoice: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The invoice id (`inv_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The invoice, now `void`. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Invoice voided",
                     *       "data": {
                     *         "id": "inv_01J8Z5X7Q9K2M4N6P8R0S2T4W5",
                     *         "object": "invoice",
                     *         "livemode": false,
                     *         "number": "INV-000042",
                     *         "status": "open",
                     *         "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *         "currency": "NGN",
                     *         "items": [
                     *           {
                     *             "description": "Website design",
                     *             "quantity": 1,
                     *             "unit_amount": 15000000,
                     *             "amount": 15000000
                     *           },
                     *           {
                     *             "description": "Hosting (12 months)",
                     *             "quantity": 1,
                     *             "unit_amount": 3000000,
                     *             "amount": 3000000
                     *           }
                     *         ],
                     *         "taxes": [
                     *           {
                     *             "name": "VAT",
                     *             "bps": 750,
                     *             "amount": 1350000
                     *           }
                     *         ],
                     *         "subtotal": 18000000,
                     *         "tax_amount": 1350000,
                     *         "total": 19350000,
                     *         "amount_paid": 0,
                     *         "amount_due": 19350000,
                     *         "memo": "Thank you for your business.",
                     *         "due_date": "2026-10-15T00:00:00.000Z",
                     *         "hosted_invoice_url": "https://checkout.pletopay.com/i/inv_tok_example",
                     *         "payment": null,
                     *         "split": null,
                     *         "subscription": null,
                     *         "period_start": null,
                     *         "period_end": null,
                     *         "metadata": {},
                     *         "finalized_at": "2026-09-24T18:04:12.000Z",
                     *         "paid_at": null,
                     *         "voided_at": null,
                     *         "created_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Invoice"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Conflict (duplicate reference, invalid state, request in progress) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "A payment with reference ORDER-12345 already exists",
                     *       "error": {
                     *         "type": "conflict",
                     *         "code": "duplicate_reference",
                     *         "param": "reference"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    markInvoiceUncollectible: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The invoice id (`inv_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The invoice, now `uncollectible`. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Invoice marked uncollectible",
                     *       "data": {
                     *         "id": "inv_01J8Z5X7Q9K2M4N6P8R0S2T4W5",
                     *         "object": "invoice",
                     *         "livemode": false,
                     *         "number": "INV-000042",
                     *         "status": "open",
                     *         "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *         "currency": "NGN",
                     *         "items": [
                     *           {
                     *             "description": "Website design",
                     *             "quantity": 1,
                     *             "unit_amount": 15000000,
                     *             "amount": 15000000
                     *           },
                     *           {
                     *             "description": "Hosting (12 months)",
                     *             "quantity": 1,
                     *             "unit_amount": 3000000,
                     *             "amount": 3000000
                     *           }
                     *         ],
                     *         "taxes": [
                     *           {
                     *             "name": "VAT",
                     *             "bps": 750,
                     *             "amount": 1350000
                     *           }
                     *         ],
                     *         "subtotal": 18000000,
                     *         "tax_amount": 1350000,
                     *         "total": 19350000,
                     *         "amount_paid": 0,
                     *         "amount_due": 19350000,
                     *         "memo": "Thank you for your business.",
                     *         "due_date": "2026-10-15T00:00:00.000Z",
                     *         "hosted_invoice_url": "https://checkout.pletopay.com/i/inv_tok_example",
                     *         "payment": null,
                     *         "split": null,
                     *         "subscription": null,
                     *         "period_start": null,
                     *         "period_end": null,
                     *         "metadata": {},
                     *         "finalized_at": "2026-09-24T18:04:12.000Z",
                     *         "paid_at": null,
                     *         "voided_at": null,
                     *         "created_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Invoice"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Conflict (duplicate reference, invalid state, request in progress) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "A payment with reference ORDER-12345 already exists",
                     *       "error": {
                     *         "type": "conflict",
                     *         "code": "duplicate_reference",
                     *         "param": "reference"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listRiskEvents: {
        parameters: {
            query?: {
                /** @description Number of objects to return */
                limit?: number;
                /** @description Cursor: return objects created before this object id (older) */
                starting_after?: string;
                /** @description Cursor: return objects created after this object id (newer) */
                ending_before?: string;
                /** @description Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z */
                created?: components["schemas"]["DateRangeFilter"];
                /** @description Only risk events with this review status. */
                review_status?: "open" | "cleared" | "confirmed";
            };
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A page of risk events, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Risk events retrieved",
                     *       "data": [
                     *         {
                     *           "id": "rsk_01J8Z5X7Q9K2M4N6P8R0S2T4W6",
                     *           "object": "risk_event",
                     *           "livemode": false,
                     *           "type": "high_value_payment",
                     *           "severity": "medium",
                     *           "action": "flagged",
                     *           "rule": "high_value_payment",
                     *           "subject": {
                     *             "type": "payment",
                     *             "id": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6"
                     *           },
                     *           "amount": 250000000,
                     *           "score": 62,
                     *           "reasons": [
                     *             "amount at or above the high-value threshold"
                     *           ],
                     *           "review_status": "open",
                     *           "review_note": null,
                     *           "reviewed_at": null,
                     *           "created_at": "2026-09-24T18:00:00.000Z"
                     *         }
                     *       ],
                     *       "meta": {
                     *         "has_more": false,
                     *         "next_cursor": null,
                     *         "url": "/api/v1/risk-events"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["RiskEvent"][];
                        meta: components["schemas"]["ListMeta"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getRiskLimits: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Your risk limits. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Risk limits retrieved",
                     *       "data": {
                     *         "object": "risk_limits",
                     *         "livemode": false,
                     *         "max_transfer_amount": 500000000,
                     *         "daily_outbound_amount": 2000000000,
                     *         "daily_outbound_count": 500,
                     *         "outbound_per_minute": 30,
                     *         "high_value_payment": 200000000,
                     *         "customer_payments_per_hour": 20
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["RiskLimits"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    setCustomerRiskStatus: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The customer id (`cus_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "status": "blocked",
                 *       "reason": "Chargeback history"
                 *     }
                 */
                "application/json": components["schemas"]["CustomerRiskDto"];
            };
        };
        responses: {
            /** @description The updated customer. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Customer updated",
                     *       "data": {
                     *         "id": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *         "object": "customer",
                     *         "livemode": false,
                     *         "email": "customer@example.com",
                     *         "name": "Chidi Okeke",
                     *         "phone": "+2348012345678",
                     *         "external_id": "user_8841",
                     *         "risk_status": "normal",
                     *         "metadata": {
                     *           "signup_channel": "web"
                     *         },
                     *         "created_at": "2026-09-24T18:00:00.000Z",
                     *         "updated_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Customer"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listPlans: {
        parameters: {
            query?: {
                /** @description Number of objects to return */
                limit?: number;
                /** @description Cursor: return objects created before this object id (older) */
                starting_after?: string;
                /** @description Cursor: return objects created after this object id (newer) */
                ending_before?: string;
                /** @description Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z */
                created?: components["schemas"]["DateRangeFilter"];
            };
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A page of plans, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Plans retrieved",
                     *       "data": [
                     *         {
                     *           "id": "plan_01J8Z5X7Q9K2M4N6P8R0S2T4VA",
                     *           "object": "plan",
                     *           "livemode": false,
                     *           "name": "Pro monthly",
                     *           "description": null,
                     *           "amount": 500000,
                     *           "currency": "NGN",
                     *           "interval": "month",
                     *           "interval_count": 1,
                     *           "active": true,
                     *           "metadata": {},
                     *           "created_at": "2026-09-24T18:00:00.000Z"
                     *         }
                     *       ],
                     *       "meta": {
                     *         "has_more": false,
                     *         "next_cursor": null,
                     *         "url": "/api/v1/plans"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Plan"][];
                        meta: components["schemas"]["ListMeta"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    createPlan: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
                /** @description A unique key for this request (1–255 printable ASCII characters). A retry with the same key and body returns the original response, with `Idempotent-Replayed: true`, instead of acting twice. Keys expire after 24 hours. */
                "Idempotency-Key"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "name": "Pro monthly",
                 *       "amount": 500000,
                 *       "interval": "month",
                 *       "interval_count": 1
                 *     }
                 */
                "application/json": components["schemas"]["CreatePlanDto"];
            };
        };
        responses: {
            /** @description The new plan. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Plan created",
                     *       "data": {
                     *         "id": "plan_01J8Z5X7Q9K2M4N6P8R0S2T4VA",
                     *         "object": "plan",
                     *         "livemode": false,
                     *         "name": "Pro monthly",
                     *         "description": null,
                     *         "amount": 500000,
                     *         "currency": "NGN",
                     *         "interval": "month",
                     *         "interval_count": 1,
                     *         "active": true,
                     *         "metadata": {},
                     *         "created_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Plan"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description A request with this Idempotency-Key is still in progress */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "A payment with reference ORDER-12345 already exists",
                     *       "error": {
                     *         "type": "conflict",
                     *         "code": "duplicate_reference",
                     *         "param": "reference"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Idempotency-Key reused with a different request */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "This Idempotency-Key was used with a different request",
                     *       "error": {
                     *         "type": "idempotency_error",
                     *         "code": "idempotency_key_reused",
                     *         "param": "Idempotency-Key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getPlan: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The plan id (`plan_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The plan. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Plan retrieved",
                     *       "data": {
                     *         "id": "plan_01J8Z5X7Q9K2M4N6P8R0S2T4VA",
                     *         "object": "plan",
                     *         "livemode": false,
                     *         "name": "Pro monthly",
                     *         "description": null,
                     *         "amount": 500000,
                     *         "currency": "NGN",
                     *         "interval": "month",
                     *         "interval_count": 1,
                     *         "active": true,
                     *         "metadata": {},
                     *         "created_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Plan"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    updatePlan: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The plan id (`plan_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "active": false
                 *     }
                 */
                "application/json": components["schemas"]["UpdatePlanDto"];
            };
        };
        responses: {
            /** @description The updated plan. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Plan updated",
                     *       "data": {
                     *         "id": "plan_01J8Z5X7Q9K2M4N6P8R0S2T4VA",
                     *         "object": "plan",
                     *         "livemode": false,
                     *         "name": "Pro monthly",
                     *         "description": null,
                     *         "amount": 500000,
                     *         "currency": "NGN",
                     *         "interval": "month",
                     *         "interval_count": 1,
                     *         "active": true,
                     *         "metadata": {},
                     *         "created_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Plan"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listSubscriptions: {
        parameters: {
            query?: {
                /** @description Number of objects to return */
                limit?: number;
                /** @description Cursor: return objects created before this object id (older) */
                starting_after?: string;
                /** @description Cursor: return objects created after this object id (newer) */
                ending_before?: string;
                /** @description Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z */
                created?: components["schemas"]["DateRangeFilter"];
                /** @description Only objects with this status. */
                status?: "active" | "past_due" | "canceled";
                /** @description Customer (cus_…) */
                customer?: string;
            };
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A page of subscriptions, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Subscriptions retrieved",
                     *       "data": [
                     *         {
                     *           "id": "sbs_01J8Z5X7Q9K2M4N6P8R0S2T4W7",
                     *           "object": "subscription",
                     *           "livemode": false,
                     *           "status": "active",
                     *           "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *           "plan": "plan_01J8Z5X7Q9K2M4N6P8R0S2T4VA",
                     *           "collection_method": "invoice",
                     *           "dedicated_account": null,
                     *           "days_until_due": 7,
                     *           "current_period_start": "2026-09-24T18:00:00.000Z",
                     *           "current_period_end": "2026-10-24T18:00:00.000Z",
                     *           "next_invoice_at": "2026-10-24T18:00:00.000Z",
                     *           "latest_invoice": "inv_01J8Z5X7Q9K2M4N6P8R0S2T4W5",
                     *           "cancel_at_period_end": false,
                     *           "canceled_at": null,
                     *           "cancel_reason": null,
                     *           "metadata": {},
                     *           "created_at": "2026-09-24T18:00:00.000Z"
                     *         }
                     *       ],
                     *       "meta": {
                     *         "has_more": false,
                     *         "next_cursor": null,
                     *         "url": "/api/v1/subscriptions"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Subscription"][];
                        meta: components["schemas"]["ListMeta"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    createSubscription: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
                /** @description A unique key for this request (1–255 printable ASCII characters). A retry with the same key and body returns the original response, with `Idempotent-Replayed: true`, instead of acting twice. Keys expire after 24 hours. */
                "Idempotency-Key"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                 *       "plan": "plan_01J8Z5X7Q9K2M4N6P8R0S2T4VA",
                 *       "collection_method": "invoice",
                 *       "days_until_due": 7
                 *     }
                 */
                "application/json": components["schemas"]["CreateSubscriptionDto"];
            };
        };
        responses: {
            /** @description The new subscription. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Subscription created",
                     *       "data": {
                     *         "id": "sbs_01J8Z5X7Q9K2M4N6P8R0S2T4W7",
                     *         "object": "subscription",
                     *         "livemode": false,
                     *         "status": "active",
                     *         "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *         "plan": "plan_01J8Z5X7Q9K2M4N6P8R0S2T4VA",
                     *         "collection_method": "invoice",
                     *         "dedicated_account": null,
                     *         "days_until_due": 7,
                     *         "current_period_start": "2026-09-24T18:00:00.000Z",
                     *         "current_period_end": "2026-10-24T18:00:00.000Z",
                     *         "next_invoice_at": "2026-10-24T18:00:00.000Z",
                     *         "latest_invoice": "inv_01J8Z5X7Q9K2M4N6P8R0S2T4W5",
                     *         "cancel_at_period_end": false,
                     *         "canceled_at": null,
                     *         "cancel_reason": null,
                     *         "metadata": {},
                     *         "created_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Subscription"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /**
             * @description Conflict (duplicate reference, invalid state, request in progress)
             *
             *     A request with this Idempotency-Key is still in progress
             */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "A payment with reference ORDER-12345 already exists",
                     *       "error": {
                     *         "type": "conflict",
                     *         "code": "duplicate_reference",
                     *         "param": "reference"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Idempotency-Key reused with a different request */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "This Idempotency-Key was used with a different request",
                     *       "error": {
                     *         "type": "idempotency_error",
                     *         "code": "idempotency_key_reused",
                     *         "param": "Idempotency-Key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description The virtual account could not be created. Nothing was created */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "The virtual account could not be created. Nothing was created; check the account details or contact support.",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "virtual_account_creation_failed"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getSubscription: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The subscription id (`sbs_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The subscription. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Subscription retrieved",
                     *       "data": {
                     *         "id": "sbs_01J8Z5X7Q9K2M4N6P8R0S2T4W7",
                     *         "object": "subscription",
                     *         "livemode": false,
                     *         "status": "active",
                     *         "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *         "plan": "plan_01J8Z5X7Q9K2M4N6P8R0S2T4VA",
                     *         "collection_method": "invoice",
                     *         "dedicated_account": null,
                     *         "days_until_due": 7,
                     *         "current_period_start": "2026-09-24T18:00:00.000Z",
                     *         "current_period_end": "2026-10-24T18:00:00.000Z",
                     *         "next_invoice_at": "2026-10-24T18:00:00.000Z",
                     *         "latest_invoice": "inv_01J8Z5X7Q9K2M4N6P8R0S2T4W5",
                     *         "cancel_at_period_end": false,
                     *         "canceled_at": null,
                     *         "cancel_reason": null,
                     *         "metadata": {},
                     *         "created_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Subscription"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    cancelSubscription: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The subscription id (`sbs_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "at_period_end": true,
                 *       "reason": "Customer downgraded"
                 *     }
                 */
                "application/json": components["schemas"]["CancelSubscriptionDto"];
            };
        };
        responses: {
            /** @description The updated subscription. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Subscription canceled",
                     *       "data": {
                     *         "id": "sbs_01J8Z5X7Q9K2M4N6P8R0S2T4W7",
                     *         "object": "subscription",
                     *         "livemode": false,
                     *         "status": "active",
                     *         "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
                     *         "plan": "plan_01J8Z5X7Q9K2M4N6P8R0S2T4VA",
                     *         "collection_method": "invoice",
                     *         "dedicated_account": null,
                     *         "days_until_due": 7,
                     *         "current_period_start": "2026-09-24T18:00:00.000Z",
                     *         "current_period_end": "2026-10-24T18:00:00.000Z",
                     *         "next_invoice_at": "2026-10-24T18:00:00.000Z",
                     *         "latest_invoice": "inv_01J8Z5X7Q9K2M4N6P8R0S2T4W5",
                     *         "cancel_at_period_end": false,
                     *         "canceled_at": null,
                     *         "cancel_reason": null,
                     *         "metadata": {},
                     *         "created_at": "2026-09-24T18:00:00.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Subscription"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Conflict (duplicate reference, invalid state, request in progress) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "A payment with reference ORDER-12345 already exists",
                     *       "error": {
                     *         "type": "conflict",
                     *         "code": "duplicate_reference",
                     *         "param": "reference"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listReports: {
        parameters: {
            query?: {
                /** @description Number of objects to return */
                limit?: number;
                /** @description Cursor: return objects created before this object id (older) */
                starting_after?: string;
                /** @description Cursor: return objects created after this object id (newer) */
                ending_before?: string;
                /** @description Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z */
                created?: components["schemas"]["DateRangeFilter"];
                /** @description Only objects of this type. */
                type?: "payments" | "transfers" | "refunds" | "settlements" | "balance_statement" | "customers" | "invoices" | "subscriptions";
                /** @description Only objects with this status. */
                status?: "pending" | "running" | "succeeded" | "failed";
            };
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A page of reports, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Reports retrieved",
                     *       "data": [
                     *         {
                     *           "id": "rpt_01J8Z5X7Q9K2M4N6P8R0S2T4W8",
                     *           "object": "report",
                     *           "livemode": false,
                     *           "type": "payments",
                     *           "status": "succeeded",
                     *           "period_start": "2026-09-01T00:00:00.000Z",
                     *           "period_end": "2026-10-01T00:00:00.000Z",
                     *           "format": "csv",
                     *           "row_count": 1284,
                     *           "size_bytes": 402118,
                     *           "sha256": "9f2b5c0d7e1a4b3c8d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c",
                     *           "download_url": "/api/v1/reports/rpt_01J8Z5X7Q9K2M4N6P8R0S2T4W8/download",
                     *           "error": null,
                     *           "expires_at": "2026-10-24T18:00:00.000Z",
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "completed_at": "2026-09-24T18:04:12.000Z"
                     *         }
                     *       ],
                     *       "meta": {
                     *         "has_more": false,
                     *         "next_cursor": null,
                     *         "url": "/api/v1/reports"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Report"][];
                        meta: components["schemas"]["ListMeta"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    createReport: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "type": "payments",
                 *       "period_start": "2026-09-01T00:00:00.000Z",
                 *       "period_end": "2026-10-01T00:00:00.000Z"
                 *     }
                 */
                "application/json": components["schemas"]["CreateReportDto"];
            };
        };
        responses: {
            /** @description The new report, `pending`. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Report created",
                     *       "data": {
                     *         "id": "rpt_01J8Z5X7Q9K2M4N6P8R0S2T4W8",
                     *         "object": "report",
                     *         "livemode": false,
                     *         "type": "payments",
                     *         "status": "succeeded",
                     *         "period_start": "2026-09-01T00:00:00.000Z",
                     *         "period_end": "2026-10-01T00:00:00.000Z",
                     *         "format": "csv",
                     *         "row_count": 1284,
                     *         "size_bytes": 402118,
                     *         "sha256": "9f2b5c0d7e1a4b3c8d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c",
                     *         "download_url": "/api/v1/reports/rpt_01J8Z5X7Q9K2M4N6P8R0S2T4W8/download",
                     *         "error": null,
                     *         "expires_at": "2026-10-24T18:00:00.000Z",
                     *         "created_at": "2026-09-24T18:00:00.000Z",
                     *         "completed_at": "2026-09-24T18:04:12.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Report"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getReport: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The report id (`rpt_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The report. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Report retrieved",
                     *       "data": {
                     *         "id": "rpt_01J8Z5X7Q9K2M4N6P8R0S2T4W8",
                     *         "object": "report",
                     *         "livemode": false,
                     *         "type": "payments",
                     *         "status": "succeeded",
                     *         "period_start": "2026-09-01T00:00:00.000Z",
                     *         "period_end": "2026-10-01T00:00:00.000Z",
                     *         "format": "csv",
                     *         "row_count": 1284,
                     *         "size_bytes": 402118,
                     *         "sha256": "9f2b5c0d7e1a4b3c8d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c",
                     *         "download_url": "/api/v1/reports/rpt_01J8Z5X7Q9K2M4N6P8R0S2T4W8/download",
                     *         "error": null,
                     *         "expires_at": "2026-10-24T18:00:00.000Z",
                     *         "created_at": "2026-09-24T18:00:00.000Z",
                     *         "completed_at": "2026-09-24T18:04:12.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Report"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    downloadReport: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The report id (`rpt_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The CSV file. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/csv": string;
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/csv": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/csv": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/csv": components["schemas"]["Error"];
                };
            };
            /** @description Conflict (duplicate reference, invalid state, request in progress) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/csv": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/csv": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/csv": components["schemas"]["Error"];
                };
            };
        };
    };
    getStatement: {
        parameters: {
            query: {
                /** @description Start of the period (inclusive, ISO 8601). */
                period_start: string;
                /** @description End of the period (exclusive, ISO 8601). */
                period_end: string;
            };
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The statement. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Statement retrieved",
                     *       "data": {
                     *         "object": "statement",
                     *         "livemode": false,
                     *         "currency": "NGN",
                     *         "period_start": "2026-09-01T00:00:00.000Z",
                     *         "period_end": "2026-10-01T00:00:00.000Z",
                     *         "balances": [
                     *           {
                     *             "balance": "available",
                     *             "opening": 12000000,
                     *             "credits": 49500000,
                     *             "debits": 30000000,
                     *             "closing": 31500000
                     *           },
                     *           {
                     *             "balance": "pending",
                     *             "opening": 0,
                     *             "credits": 49500000,
                     *             "debits": 49500000,
                     *             "closing": 0
                     *           }
                     *         ]
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Statement"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listWebhookEndpoints: {
        parameters: {
            query?: {
                /** @description Number of objects to return */
                limit?: number;
                /** @description Cursor: return objects created before this object id (older) */
                starting_after?: string;
                /** @description Cursor: return objects created after this object id (newer) */
                ending_before?: string;
                /** @description Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z */
                created?: components["schemas"]["DateRangeFilter"];
            };
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A page of webhook endpoints, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Webhook endpoints retrieved",
                     *       "data": [
                     *         {
                     *           "id": "we_01J8Z5X7Q9K2M4N6P8R0S2T4VB",
                     *           "object": "webhook_endpoint",
                     *           "livemode": false,
                     *           "url": "https://example.com/webhooks/pletopay",
                     *           "description": "Production order service",
                     *           "enabled_events": [
                     *             "payment.succeeded",
                     *             "payment.failed",
                     *             "transfer.succeeded",
                     *             "transfer.failed"
                     *           ],
                     *           "status": "enabled",
                     *           "health": {
                     *             "consecutive_failures": 0,
                     *             "last_success_at": "2026-09-24T18:04:12.000Z",
                     *             "last_failure_at": null,
                     *             "disabled_at": null
                     *           },
                     *           "created_at": "2026-09-24T18:00:00.000Z",
                     *           "secret": "whsec_EXAMPLEexampleEXAMPLEexample",
                     *           "stats": {
                     *             "last_delivery_at": "2026-09-24T18:04:12.000Z",
                     *             "deliveries_7d": 214,
                     *             "success_rate_7d": 1
                     *           }
                     *         }
                     *       ],
                     *       "meta": {
                     *         "has_more": false,
                     *         "next_cursor": null,
                     *         "url": "/api/v1/webhook-endpoints"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["WebhookEndpoint"][];
                        meta: components["schemas"]["ListMeta"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    createWebhookEndpoint: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
                /** @description A unique key for this request (1–255 printable ASCII characters). A retry with the same key and body returns the original response, with `Idempotent-Replayed: true`, instead of acting twice. Keys expire after 24 hours. */
                "Idempotency-Key"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "url": "https://example.com/webhooks/pletopay",
                 *       "enabled_events": [
                 *         "payment.succeeded",
                 *         "payment.failed",
                 *         "transfer.succeeded",
                 *         "transfer.failed"
                 *       ],
                 *       "description": "Production order service"
                 *     }
                 */
                "application/json": components["schemas"]["CreateWebhookEndpointDto"];
            };
        };
        responses: {
            /** @description The new endpoint, including its `secret`. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Webhook endpoint created",
                     *       "data": {
                     *         "id": "we_01J8Z5X7Q9K2M4N6P8R0S2T4VB",
                     *         "object": "webhook_endpoint",
                     *         "livemode": false,
                     *         "url": "https://example.com/webhooks/pletopay",
                     *         "description": "Production order service",
                     *         "enabled_events": [
                     *           "payment.succeeded",
                     *           "payment.failed",
                     *           "transfer.succeeded",
                     *           "transfer.failed"
                     *         ],
                     *         "status": "enabled",
                     *         "health": {
                     *           "consecutive_failures": 0,
                     *           "last_success_at": "2026-09-24T18:04:12.000Z",
                     *           "last_failure_at": null,
                     *           "disabled_at": null
                     *         },
                     *         "created_at": "2026-09-24T18:00:00.000Z",
                     *         "secret": "whsec_EXAMPLEexampleEXAMPLEexample",
                     *         "stats": {
                     *           "last_delivery_at": "2026-09-24T18:04:12.000Z",
                     *           "deliveries_7d": 214,
                     *           "success_rate_7d": 1
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["WebhookEndpoint"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description A request with this Idempotency-Key is still in progress */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "A payment with reference ORDER-12345 already exists",
                     *       "error": {
                     *         "type": "conflict",
                     *         "code": "duplicate_reference",
                     *         "param": "reference"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Idempotency-Key reused with a different request */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "This Idempotency-Key was used with a different request",
                     *       "error": {
                     *         "type": "idempotency_error",
                     *         "code": "idempotency_key_reused",
                     *         "param": "Idempotency-Key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getWebhookEndpoint: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The webhook endpoint id (`we_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The webhook endpoint. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Webhook endpoint retrieved",
                     *       "data": {
                     *         "id": "we_01J8Z5X7Q9K2M4N6P8R0S2T4VB",
                     *         "object": "webhook_endpoint",
                     *         "livemode": false,
                     *         "url": "https://example.com/webhooks/pletopay",
                     *         "description": "Production order service",
                     *         "enabled_events": [
                     *           "payment.succeeded",
                     *           "payment.failed",
                     *           "transfer.succeeded",
                     *           "transfer.failed"
                     *         ],
                     *         "status": "enabled",
                     *         "health": {
                     *           "consecutive_failures": 0,
                     *           "last_success_at": "2026-09-24T18:04:12.000Z",
                     *           "last_failure_at": null,
                     *           "disabled_at": null
                     *         },
                     *         "created_at": "2026-09-24T18:00:00.000Z",
                     *         "secret": "whsec_EXAMPLEexampleEXAMPLEexample",
                     *         "stats": {
                     *           "last_delivery_at": "2026-09-24T18:04:12.000Z",
                     *           "deliveries_7d": 214,
                     *           "success_rate_7d": 1
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["WebhookEndpoint"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    deleteWebhookEndpoint: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The webhook endpoint id (`we_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Confirmation that the endpoint was deleted. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Webhook endpoint deleted",
                     *       "data": {
                     *         "id": "we_01J8Z5X7Q9K2M4N6P8R0S2T4VB",
                     *         "object": "webhook_endpoint",
                     *         "deleted": true
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["DeletedObject"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    updateWebhookEndpoint: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The webhook endpoint id (`we_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "enabled_events": [
                 *         "*"
                 *       ],
                 *       "status": "enabled"
                 *     }
                 */
                "application/json": components["schemas"]["UpdateWebhookEndpointDto"];
            };
        };
        responses: {
            /** @description The updated webhook endpoint. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Webhook endpoint updated",
                     *       "data": {
                     *         "id": "we_01J8Z5X7Q9K2M4N6P8R0S2T4VB",
                     *         "object": "webhook_endpoint",
                     *         "livemode": false,
                     *         "url": "https://example.com/webhooks/pletopay",
                     *         "description": "Production order service",
                     *         "enabled_events": [
                     *           "payment.succeeded",
                     *           "payment.failed",
                     *           "transfer.succeeded",
                     *           "transfer.failed"
                     *         ],
                     *         "status": "enabled",
                     *         "health": {
                     *           "consecutive_failures": 0,
                     *           "last_success_at": "2026-09-24T18:04:12.000Z",
                     *           "last_failure_at": null,
                     *           "disabled_at": null
                     *         },
                     *         "created_at": "2026-09-24T18:00:00.000Z",
                     *         "secret": "whsec_EXAMPLEexampleEXAMPLEexample",
                     *         "stats": {
                     *           "last_delivery_at": "2026-09-24T18:04:12.000Z",
                     *           "deliveries_7d": 214,
                     *           "success_rate_7d": 1
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["WebhookEndpoint"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    rotateWebhookSecret: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The webhook endpoint id (`we_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The endpoint, including its new `secret`. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Webhook endpoint rotated",
                     *       "data": {
                     *         "id": "we_01J8Z5X7Q9K2M4N6P8R0S2T4VB",
                     *         "object": "webhook_endpoint",
                     *         "livemode": false,
                     *         "url": "https://example.com/webhooks/pletopay",
                     *         "description": "Production order service",
                     *         "enabled_events": [
                     *           "payment.succeeded",
                     *           "payment.failed",
                     *           "transfer.succeeded",
                     *           "transfer.failed"
                     *         ],
                     *         "status": "enabled",
                     *         "health": {
                     *           "consecutive_failures": 0,
                     *           "last_success_at": "2026-09-24T18:04:12.000Z",
                     *           "last_failure_at": null,
                     *           "disabled_at": null
                     *         },
                     *         "created_at": "2026-09-24T18:00:00.000Z",
                     *         "secret": "whsec_EXAMPLEexampleEXAMPLEexample",
                     *         "stats": {
                     *           "last_delivery_at": "2026-09-24T18:04:12.000Z",
                     *           "deliveries_7d": 214,
                     *           "success_rate_7d": 1
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["WebhookEndpoint"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    testWebhookEndpoint: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The webhook endpoint id (`we_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The test delivery. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Webhook delivery sent",
                     *       "data": {
                     *         "id": "whd_01J8Z5X7Q9K2M4N6P8R0S2T4WA",
                     *         "object": "webhook_delivery",
                     *         "livemode": false,
                     *         "event": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *         "endpoint": "we_01J8Z5X7Q9K2M4N6P8R0S2T4VB",
                     *         "status": "succeeded",
                     *         "attempts": 1,
                     *         "response_status": 200,
                     *         "error": null,
                     *         "duration_ms": 184,
                     *         "last_attempt_at": "2026-09-24T18:04:12.000Z",
                     *         "next_attempt_at": null,
                     *         "replay_of": null,
                     *         "created_at": "2026-09-24T18:04:12.000Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["WebhookDelivery"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listEndpointDeliveries: {
        parameters: {
            query?: {
                /** @description Number of objects to return */
                limit?: number;
                /** @description Cursor: return objects created before this object id (older) */
                starting_after?: string;
                /** @description Cursor: return objects created after this object id (newer) */
                ending_before?: string;
                /** @description Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z */
                created?: components["schemas"]["DateRangeFilter"];
                /** @description Only objects with this status. */
                status?: "pending" | "succeeded" | "failed" | "dead";
            };
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The webhook endpoint id (`we_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A page of deliveries, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Webhook deliveries retrieved",
                     *       "data": [
                     *         {
                     *           "id": "whd_01J8Z5X7Q9K2M4N6P8R0S2T4WA",
                     *           "object": "webhook_delivery",
                     *           "livemode": false,
                     *           "event": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *           "endpoint": "we_01J8Z5X7Q9K2M4N6P8R0S2T4VB",
                     *           "status": "succeeded",
                     *           "attempts": 1,
                     *           "response_status": 200,
                     *           "error": null,
                     *           "duration_ms": 184,
                     *           "last_attempt_at": "2026-09-24T18:04:12.000Z",
                     *           "next_attempt_at": null,
                     *           "replay_of": null,
                     *           "created_at": "2026-09-24T18:04:12.000Z"
                     *         }
                     *       ],
                     *       "meta": {
                     *         "has_more": false,
                     *         "next_cursor": null,
                     *         "url": "/api/v1/webhook-endpoints"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["WebhookDelivery"][];
                        meta: components["schemas"]["ListMeta"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listEvents: {
        parameters: {
            query?: {
                /** @description Number of objects to return */
                limit?: number;
                /** @description Cursor: return objects created before this object id (older) */
                starting_after?: string;
                /** @description Cursor: return objects created after this object id (newer) */
                ending_before?: string;
                /** @description Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z */
                created?: components["schemas"]["DateRangeFilter"];
                /** @description Only objects of this type. */
                type?: "payment.created" | "payment.pending" | "payment.succeeded" | "payment.failed" | "payment.expired" | "payment.under_review" | "payment.reversed" | "payment.partially_refunded" | "payment.refunded" | "virtual_account.created" | "virtual_account.updated" | "virtual_account.closed" | "transfer.created" | "transfer.processing" | "transfer.succeeded" | "transfer.failed" | "transfer.reversed" | "settlement.created" | "settlement.completed" | "settlement.failed" | "refund.created" | "refund.succeeded" | "refund.failed" | "checkout.session.completed" | "checkout.session.expired" | "invoice.created" | "invoice.finalized" | "invoice.paid" | "invoice.voided" | "invoice.marked_uncollectible" | "subscription.created" | "subscription.updated" | "subscription.past_due" | "subscription.canceled" | "report.ready" | "report.failed" | "risk.event_flagged" | "webhook.test";
                /** @description Only events about this object (e.g. pay_…) */
                resource_id?: string;
            };
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A page of events, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Events retrieved",
                     *       "data": [
                     *         {
                     *           "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *           "object": "event",
                     *           "type": "payment.succeeded",
                     *           "api_version": "2026-09-24",
                     *           "livemode": false,
                     *           "created_at": "2026-09-24T18:04:12.000Z",
                     *           "data": {
                     *             "object": {
                     *               "id": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *               "object": "payment",
                     *               "status": "succeeded"
                     *             }
                     *           }
                     *         }
                     *       ],
                     *       "meta": {
                     *         "has_more": false,
                     *         "next_cursor": null,
                     *         "url": "/api/v1/events"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Event"][];
                        meta: components["schemas"]["ListMeta"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getEvent: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The event id (`evt_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The event. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Event retrieved",
                     *       "data": {
                     *         "id": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *         "object": "event",
                     *         "type": "payment.succeeded",
                     *         "api_version": "2026-09-24",
                     *         "livemode": false,
                     *         "created_at": "2026-09-24T18:04:12.000Z",
                     *         "data": {
                     *           "object": {
                     *             "id": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *             "object": "payment",
                     *             "status": "succeeded"
                     *           }
                     *         }
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Event"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listEventDeliveries: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path: {
                /** @description The event id (`evt_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description All deliveries of the event (not paginated). */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Webhook deliveries retrieved",
                     *       "data": [
                     *         {
                     *           "id": "whd_01J8Z5X7Q9K2M4N6P8R0S2T4WA",
                     *           "object": "webhook_delivery",
                     *           "livemode": false,
                     *           "event": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *           "endpoint": "we_01J8Z5X7Q9K2M4N6P8R0S2T4VB",
                     *           "status": "succeeded",
                     *           "attempts": 1,
                     *           "response_status": 200,
                     *           "error": null,
                     *           "duration_ms": 184,
                     *           "last_attempt_at": "2026-09-24T18:04:12.000Z",
                     *           "next_attempt_at": null,
                     *           "replay_of": null,
                     *           "created_at": "2026-09-24T18:04:12.000Z"
                     *         }
                     *       ],
                     *       "meta": {
                     *         "has_more": false,
                     *         "next_cursor": null,
                     *         "url": "/api/v1/events"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["WebhookDelivery"][];
                        meta: components["schemas"]["ListMeta"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    replayEvent: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
                /** @description A unique key for this request (1–255 printable ASCII characters). A retry with the same key and body returns the original response, with `Idempotent-Replayed: true`, instead of acting twice. Keys expire after 24 hours. */
                "Idempotency-Key"?: string;
            };
            path: {
                /** @description The event id (`evt_…`). */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "endpoint": "we_01J8Z5X7Q9K2M4N6P8R0S2T4VB"
                 *     }
                 */
                "application/json": components["schemas"]["ReplayEventDto"];
            };
        };
        responses: {
            /** @description The new deliveries (not paginated). */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Webhook deliveries retrieved",
                     *       "data": [
                     *         {
                     *           "id": "whd_01J8Z5X7Q9K2M4N6P8R0S2T4WA",
                     *           "object": "webhook_delivery",
                     *           "livemode": false,
                     *           "event": "evt_01J8Z5X7Q9K2M4N6P8R0S2T4WB",
                     *           "endpoint": "we_01J8Z5X7Q9K2M4N6P8R0S2T4VB",
                     *           "status": "succeeded",
                     *           "attempts": 1,
                     *           "response_status": 200,
                     *           "error": null,
                     *           "duration_ms": 184,
                     *           "last_attempt_at": "2026-09-24T18:04:12.000Z",
                     *           "next_attempt_at": null,
                     *           "replay_of": null,
                     *           "created_at": "2026-09-24T18:04:12.000Z"
                     *         }
                     *       ],
                     *       "meta": {
                     *         "has_more": false,
                     *         "next_cursor": null,
                     *         "url": "/api/v1/events"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["WebhookDelivery"][];
                        meta: components["schemas"]["ListMeta"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "No such payment: pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
                     *       "error": {
                     *         "type": "not_found",
                     *         "code": "resource_missing",
                     *         "param": "id"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description A request with this Idempotency-Key is still in progress */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "A payment with reference ORDER-12345 already exists",
                     *       "error": {
                     *         "type": "conflict",
                     *         "code": "duplicate_reference",
                     *         "param": "reference"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Idempotency-Key reused with a different request */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "This Idempotency-Key was used with a different request",
                     *       "error": {
                     *         "type": "idempotency_error",
                     *         "code": "idempotency_key_reused",
                     *         "param": "Idempotency-Key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getBalance: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Your balances in kobo. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Balance retrieved",
                     *       "data": {
                     *         "object": "balance",
                     *         "livemode": false,
                     *         "currency": "NGN",
                     *         "available": 31500000,
                     *         "pending": 4950000,
                     *         "held": 0,
                     *         "unapplied": 0,
                     *         "settling": 0,
                     *         "total": 36450000,
                     *         "settled_total": 120000000
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["Balance"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listTransactions: {
        parameters: {
            query?: {
                /** @description Number of objects to return */
                limit?: number;
                /** @description Cursor: return objects created before this object id (older) */
                starting_after?: string;
                /** @description Cursor: return objects created after this object id (newer) */
                ending_before?: string;
                /** @description Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z */
                created?: components["schemas"]["DateRangeFilter"];
                /** @description Only objects of this type. */
                type?: "payment_receipt" | "unmatched_receipt" | "unapplied_receipt" | "unapplied_application" | "suspense_assignment" | "funds_release" | "sweep" | "transfer_reserve" | "transfer_complete" | "transfer_release" | "external_debit" | "adjustment" | "reversal" | "settlement_reserve" | "settlement_complete" | "settlement_release" | "split_allocation";
                /** @description What caused the movement */
                source?: "payment" | "transfer" | "account_transaction" | "adjustment";
            };
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A page of ledger transactions, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Ledger transactions retrieved",
                     *       "data": [
                     *         {
                     *           "id": "jrn_01J8Z5X7Q9K2M4N6P8R0S2T4W9",
                     *           "object": "ledger_transaction",
                     *           "livemode": false,
                     *           "type": "payment_receipt",
                     *           "description": "Payment ORDER-12345",
                     *           "currency": "NGN",
                     *           "net_amount": 4950000,
                     *           "balance_changes": {
                     *             "pending": 4950000
                     *           },
                     *           "source": {
                     *             "object": "payment",
                     *             "id": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6"
                     *           },
                     *           "created_at": "2026-09-24T18:04:12.000Z"
                     *         }
                     *       ],
                     *       "meta": {
                     *         "has_more": false,
                     *         "next_cursor": null,
                     *         "url": "/api/v1/transactions"
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["LedgerTransaction"][];
                        meta: components["schemas"]["ListMeta"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    simulateTransfer: {
        parameters: {
            query?: never;
            header?: {
                /** @description Dated API version. Defaults to the version pinned on your organization. */
                "PletoPay-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "account_number": "9000002140",
                 *       "amount": 5000000
                 *     }
                 */
                "application/json": components["schemas"]["SimulateTransferDto"];
            };
        };
        responses: {
            /** @description The simulation was accepted. */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "message": "Simulated transfer simulated",
                     *       "data": {
                     *         "object": "simulated_transfer",
                     *         "status": "accepted",
                     *         "account_number": "9000002140",
                     *         "amount": 5000000
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @constant */
                        status: true;
                        /**
                         * @description Human-readable outcome
                         * @example Request successful
                         */
                        message: string;
                        data: components["schemas"]["SimulatedTransfer"];
                    };
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "amount must not be less than 1",
                     *       "error": {
                     *         "type": "invalid_request",
                     *         "code": "parameter_invalid",
                     *         "param": "amount"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Invalid API key",
                     *       "error": {
                     *         "type": "authentication_error",
                     *         "code": "invalid_api_key"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient permissions */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "You do not have permission to perform this action",
                     *       "error": {
                     *         "type": "permission_error",
                     *         "code": "insufficient_permissions"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limited */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "Too many requests. Retry after the indicated delay.",
                     *       "error": {
                     *         "type": "rate_limit_error",
                     *         "code": "rate_limited"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Unexpected error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "An unexpected error occurred",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "internal_error"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description The service is temporarily unavailable. Nothing was sent or created; retry later with the same Idempotency-Key */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": false,
                     *       "message": "The service is temporarily unavailable. Nothing was sent or created; retry shortly.",
                     *       "error": {
                     *         "type": "api_error",
                     *         "code": "service_unavailable"
                     *       },
                     *       "request_id": "req_01J8Z5X7Q9K2M4N6P8R0S2T4WE"
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
}
