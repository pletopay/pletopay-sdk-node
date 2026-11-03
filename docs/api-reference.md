# @pletopay/node API reference

Generated from the Pletopay OpenAPI contract (`Pletopay API`, version `2026-09-25`) by `pnpm generate:docs`. One section per operation: the SDK call, the request fields with their types and whether they are required, the query parameters, the response, and the contract's own example. Amounts are integers in kobo. Every method also accepts per-call `options` (`idempotencyKey`, `timeoutMs`, `maxRetries`, `signal`, `correlationId`, `apiVersion`, `headers`).

## Contents

- **Accept payments**: [Payments](#payments) · [Virtual accounts](#virtual-accounts) · [Customers](#customers) · [Checkout](#checkout) · [Payment links](#payment-links) · [Invoices](#invoices) · [Subscriptions](#subscriptions)
- **Move money**: [Transfers](#transfers) · [Refunds](#refunds) · [Settlements](#settlements) · [Subaccounts & splits](#subaccounts-splits)
- **Account**: [Balance](#balance) · [Reports](#reports) · [Risk](#risk)
- **Developers**: [Webhooks](#webhooks) · [Sandbox](#sandbox)
- [Object schemas](#object-schemas)

## Payments

Accept a bank transfer: create a payment, show the customer the account to pay into, and get notified when the money is confirmed. Each payment gets its own single-use (dynamic) virtual account.

### `pletopay.payments.create(params, options?)`

`POST /api/v1/payments` · operation `createPayment` · Idempotency-Key accepted (generated when omitted)

Create a bank-transfer payment. Pletopay opens a dynamic (single-use) virtual account for it and returns the account in `bank_transfer`: show the account number, bank and amount to your customer.

With `amount_rule: exact` (the default) transfers of any other amount are rejected. With `any`, whatever arrives is accepted and `amount` may be omitted.

The account expires with the payment: `expires_in` (seconds) or `expires_at`, between 5 minutes and 3 hours (the limit for one-time accounts; `400 expiry_out_of_range` carries `details.min_seconds` / `max_seconds`); the default is your organization’s setting (30 minutes unless changed).

The payment becomes `succeeded` only when the credit is confirmed. Never treat a redirect or client-side callback as proof of payment: listen for `payment.succeeded` or retrieve the payment.

`reference` must be unique among your payments in this mode (`409 duplicate_reference`). Send an `Idempotency-Key` so a retried request can’t create a second payment.

**Request fields** (`CreatePayment`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `amount` | number | no | Amount in minor units (kobo). ₦50,000.00 = 5000000. Required when amount_rule is exact.. min 1 |
| `currency` | `NGN` | **yes** |  |
| `reference` | string | **yes** | Your unique reference for this payment (e.g. order id) |
| `amount_rule` | `exact` · `any` | no | exact: transfers of any other amount are rejected. any: accept whatever is sent.. default `"exact"` |
| `customer` | PaymentCustomerDto | no |  |
| `description` | string | no | max length 500 |
| `metadata` | map of string to string | no |  |
| `split` | string | no | Split rule id (spl_…) to share the net amount with subaccounts |
| `expires_in` | number | no | Seconds until the payment (and its account) expires: 300 to 10800 (one-time accounts last up to 3 hours) |
| `expires_at` | string (date-time) | no | Absolute expiry, alternative to expires_in: 5 minutes to 3 hours from now |

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `customer.id` | string | no | Existing customer id (cus_…) |
| `customer.email` | string | no | Creates or reuses the customer with this email |
| `customer.name` | string | no |  |
| `customer.phone` | string | no |  |

**Query parameters** (`params`):

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `expand` | array of `customer` | no | Embed related objects instead of their ids. `customer` embeds the customer. |

**Returns** (HTTP 201): [Payment](#payment) — The new payment, normally `pending` with `bank_transfer` instructions.

**Example**

```ts
const result = await pletopay.payments.create({
    "amount": 5000000,
    "currency": "NGN",
    "reference": "ORDER-12345",
    "customer": {
      "email": "customer@example.com",
      "name": "Chidi Okeke"
    },
    "description": "Order #12345",
    "expires_in": 1800,
    "metadata": {
      "order_id": "12345"
    }
  });
```

### `pletopay.payments.list(params?, options?)`

`GET /api/v1/payments` · operation `listPayments`

List payments. Filter by `status`, `customer`, `reference`, `virtual_account`, amount received (`amount[gte]`, `amount[lte]`, in kobo) and creation time. Add `expand[]=customer` to embed the customer object.

**Query parameters** (`params`):

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | number | no | Number of objects to return. min 1, max 100, default `10` |
| `starting_after` | string | no | Cursor: return objects created before this object id (older) |
| `ending_before` | string | no | Cursor: return objects created after this object id (newer) |
| `created` | `{ gt?, gte?, lt?, lte? }` (ISO-8601 or Date) | no | Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z |
| `status` | `created` · `pending` · `processing` · `succeeded` · `under_review` · `failed` · `expired` · `reversed` · `partially_refunded` · `refunded` | no | Only objects with this status. |
| `customer` | string | no | Only objects of this customer (`cus_…`). |
| `reference` | string | no | Only the payment with this reference. |
| `q` | string | no | Search: a payment id (pay_…), reference (starts with), account number (starts with) or va_…, customer id (cus_…), email, phone or name (starts with), split rule id (spl_…), or the transfer reference or session id of the transfer that paid it. max length 100 |
| `amount` | `{ gte?, lte? }` (kobo) | no | Amount received (kobo), e.g. amount[gte]=100000 |
| `virtual_account` | string | no | Payments into this virtual account (va_…) |
| `expand` | array of `customer` | no | Embed related objects instead of their ids. `customer` embeds the customer. |

**Returns** (HTTP 200): [Payment[]](#payment) — A page of payments, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one.

### `pletopay.payments.retrieve(id, params?, options?)`

`GET /api/v1/payments/{id}` · operation `getPayment`

Retrieve a payment by id (`pay_…`). This is the authoritative way to verify a payment server-side before you deliver value: check `status` is `succeeded` and `amount_received` is what you expect.

**Path arguments:** `id` (The payment id (`pay_…`).)

**Query parameters** (`params`):

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `expand` | array of `customer` | no | Embed related objects instead of their ids. `customer` embeds the customer. |

**Returns** (HTTP 200): [Payment](#payment) — The payment.

### `pletopay.payments.retrieveByReference(reference, params?, options?)`

`GET /api/v1/payments/reference/{reference}` · operation `getPaymentByReference`

Retrieve a payment by the `reference` you gave it. Useful when you stored your order id but not the Pletopay payment id.

**Path arguments:** `reference` (The `reference` you gave the payment.)

**Query parameters** (`params`):

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `expand` | array of `customer` | no | Embed related objects instead of their ids. `customer` embeds the customer. |

**Returns** (HTTP 200): [Payment](#payment) — The payment.

## Virtual accounts

Real bank account numbers that route money into your Pletopay balance. Dedicated accounts belong to one customer permanently; dynamic accounts serve a single payment.

### `pletopay.virtualAccounts.create(params, options?)`

`POST /api/v1/virtual-accounts` · operation `createVirtualAccount` · Idempotency-Key accepted (generated when omitted)

Create a virtual account (a real NUBAN that routes into your balance).

**Dedicated** (`type: dedicated`, needs `customer_id`): a permanent account for one customer. Every transfer into it creates a `succeeded` payment with `source: dedicated_virtual_account`, whatever the amount. Close it when you no longer want to receive money through it.

**Dynamic** (`type: dynamic`, needs `amount` and `reference`): a single-use account for one exact amount. This is the same as creating a payment with `POST /api/v1/payments`; the response is the account, and the payment id is in `payment`.

**Request fields** (`CreateVirtualAccount`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | `dedicated` · `dynamic` | **yes** | dedicated: permanent account for a customer. dynamic: single-use account bound to one payment. |
| `customer_id` | string | no | Customer id (cus_…). Required for dedicated accounts. |
| `amount` | number | no | Dynamic only: amount in kobo |
| `currency` | `NGN` | no | Dynamic only |
| `reference` | string | no | Dynamic only: your unique payment reference |
| `expires_at` | string (date-time) | no | Dynamic only |
| `metadata` | map of string to string | no |  |

**Returns** (HTTP 201): [VirtualAccount](#virtualaccount) — The new virtual account.

**Example**

```ts
const result = await pletopay.virtualAccounts.create({
    "type": "dedicated",
    "customer_id": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
    "metadata": {
      "plan": "wallet"
    }
  });
```

### `pletopay.virtualAccounts.list(params?, options?)`

`GET /api/v1/virtual-accounts` · operation `listVirtualAccounts`

List virtual accounts. Filter by `type`, `status`, `customer` or `account_number`.

**Query parameters** (`params`):

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | number | no | Number of objects to return. min 1, max 100, default `10` |
| `starting_after` | string | no | Cursor: return objects created before this object id (older) |
| `ending_before` | string | no | Cursor: return objects created after this object id (newer) |
| `created` | `{ gt?, gte?, lt?, lte? }` (ISO-8601 or Date) | no | Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z |
| `type` | `dedicated` · `dynamic` | no | Only objects of this type. |
| `customer` | string | no | Only objects of this customer (`cus_…`). |
| `status` | `requested` · `active` · `blocked` · `expired` · `consumed` · `closed` · `failed` | no | Only objects with this status. |
| `account_number` | string | no | Only the account with this 10-digit number. |

**Returns** (HTTP 200): [VirtualAccount[]](#virtualaccount) — A page of virtual accounts, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one.

### `pletopay.virtualAccounts.retrieve(id, options?)`

`GET /api/v1/virtual-accounts/{id}` · operation `getVirtualAccount`

Retrieve a virtual account by id (`va_…`).

**Path arguments:** `id` (The virtual account id (`va_…`).)

**Returns** (HTTP 200): [VirtualAccount](#virtualaccount) — The virtual account.

### `pletopay.virtualAccounts.retrieveByReference(reference, options?)`

`GET /api/v1/virtual-accounts/reference/{reference}` · operation `getVirtualAccountByReference`

Retrieve a **dynamic** virtual account by the `reference` you gave when creating it (the same reference as its payment). Dedicated accounts have no reference: retrieve them by id, or list them with `customer`. An unknown reference returns `404 resource_missing`.

**Path arguments:** `reference` (The `reference` you gave the payment.)

**Returns** (HTTP 200): [VirtualAccount](#virtualaccount) — The virtual account.

### `pletopay.virtualAccounts.close(id, params, options?)`

`POST /api/v1/virtual-accounts/{id}/close` · operation `closeVirtualAccount` · Idempotency-Key accepted (generated when omitted)

Close a dedicated virtual account so it stops receiving money for you. Dynamic accounts can’t be closed this way (`400 invalid_operation`): they close with their payment. Closing an already closed account returns it unchanged.

**Path arguments:** `id` (The virtual account id (`va_…`).)

**Request fields** (`CloseVirtualAccount`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `reason` | string | **yes** |  |

**Returns** (HTTP 200): [VirtualAccount](#virtualaccount) — The closed virtual account.

**Example**

```ts
const result = await pletopay.virtualAccounts.close(id, {
    "reason": "Customer offboarded"
  });
```

## Customers

The people and businesses who pay you. Customers own dedicated accounts, invoices and subscriptions.

### `pletopay.customers.create(params, options?)`

`POST /api/v1/customers` · operation `createCustomer` · Idempotency-Key accepted (generated when omitted)

Create a customer so you can issue dedicated virtual accounts, invoices and subscriptions to them, and see their payments together. Every field is optional. An email must be unique among your customers in this mode (`409 customer_exists`).

**Request fields** (`CreateCustomer`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `email` | string | no |  |
| `name` | string | no |  |
| `phone` | string | no |  |
| `external_id` | string | no | Your own identifier for this customer |
| `metadata` | map of string to string | no |  |

**Returns** (HTTP 201): [Customer](#customer) — The new customer.

**Example**

```ts
const result = await pletopay.customers.create({
    "email": "customer@example.com",
    "name": "Chidi Okeke",
    "phone": "+2348012345678",
    "external_id": "user_8841",
    "metadata": {
      "signup_channel": "web"
    }
  });
```

### `pletopay.customers.list(params?, options?)`

`GET /api/v1/customers` · operation `listCustomers`

List your customers. Filter by `email` to find a customer you created earlier.

**Query parameters** (`params`):

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | number | no | Number of objects to return. min 1, max 100, default `10` |
| `starting_after` | string | no | Cursor: return objects created before this object id (older) |
| `ending_before` | string | no | Cursor: return objects created after this object id (newer) |
| `created` | `{ gt?, gte?, lt?, lte? }` (ISO-8601 or Date) | no | Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z |
| `email` | string | no | Only the customer with this email. |

**Returns** (HTTP 200): [Customer[]](#customer) — A page of customers, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one.

### `pletopay.customers.retrieve(id, options?)`

`GET /api/v1/customers/{id}` · operation `getCustomer`

Retrieve a customer by id (`cus_…`).

**Path arguments:** `id` (The customer id (`cus_…`).)

**Returns** (HTTP 200): [Customer](#customer) — The customer.

### `pletopay.customers.update(id, params, options?)`

`PATCH /api/v1/customers/{id}` · operation `updateCustomer` · Idempotency-Key accepted (generated when omitted)

Update a customer’s email, name or phone. `metadata` is merged into the existing metadata. Changing the email to one another customer uses returns `409 customer_exists`. Set a metadata key to `""` to delete it; the merged metadata may have at most 50 keys (`400 metadata_too_large`).

**Path arguments:** `id` (The customer id (`cus_…`).)

**Request fields** (`UpdateCustomer`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `email` | string | no |  |
| `name` | string | no |  |
| `phone` | string | no |  |
| `metadata` | map of string to string | no | Merged into existing metadata |

**Returns** (HTTP 200): [Customer](#customer) — The updated customer.

**Example**

```ts
const result = await pletopay.customers.update(id, {
    "name": "Chidi E. Okeke",
    "metadata": {
      "tier": "gold"
    }
  });
```

## Checkout

Hosted checkout pages: redirect your customer to Pletopay, and we show the transfer details and confirm the payment.

### `pletopay.checkout.sessions.create(params, options?)`

`POST /api/v1/checkout/sessions` · operation `createCheckoutSession` · Idempotency-Key accepted (generated when omitted)

Create a checkout session, then either redirect your customer to its `url` (hosted checkout) or hand its `token` to your front end and open it in the Pletopay popup with the browser SDK and your publishable key. Pletopay’s page shows the bank-transfer details (the payment is created when the customer opens it), waits for the transfer and sends the customer to `success_url` (hosted) or calls your `onSuccess` callback (popup). The session expires after `expires_in` seconds (default 1 hour, at most 3 hours: one-time bank accounts are limited to 3 hours) and completes when its payment succeeds (`checkout.session.completed`). `reference` is optional; when given it must be unique per mode (`409 duplicate_reference`), and the session can then be retrieved with `GET /api/v1/checkout/sessions/reference/{reference}`. Neither the redirect nor the callback is proof of payment: confirm with the webhook or by retrieving the session.

**Request fields** (`CreateCheckoutSession`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `amount` | number | **yes** | Amount in kobo |
| `currency` | `NGN` | **yes** |  |
| `reference` | string | no | Your reference for this session, unique per mode (409 duplicate_reference if reused) |
| `description` | string | no | Shown to the customer |
| `customer` | string | no | Existing customer (cus_…) |
| `customer_email` | string | no |  |
| `success_url` | string | no | Where the customer is sent after paying |
| `cancel_url` | string | no | Where the customer goes if they cancel |
| `expires_in` | number | no | Seconds until the session expires (default 3600, at most 10800: one-time accounts last up to 3 hours). max 10800 |
| `split` | string | no | Split rule applied to the payment (spl_…) |
| `metadata` | map of string to string | no |  |

**Returns** (HTTP 201): [CheckoutSession](#checkoutsession) — The new checkout session, `open`.

**Example**

```ts
const result = await pletopay.checkout.sessions.create({
    "amount": 5000000,
    "currency": "NGN",
    "reference": "ORDER-12345",
    "description": "Order #12345",
    "customer_email": "customer@example.com",
    "success_url": "https://example.com/orders/12345/thanks",
    "cancel_url": "https://example.com/cart",
    "metadata": {
      "order_id": "12345"
    }
  });
```

### `pletopay.checkout.sessions.list(params?, options?)`

`GET /api/v1/checkout/sessions` · operation `listCheckoutSessions`

List checkout sessions. Filter by `status` or by the `payment_link` that started them.

**Query parameters** (`params`):

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | number | no | Number of objects to return. min 1, max 100, default `10` |
| `starting_after` | string | no | Cursor: return objects created before this object id (older) |
| `ending_before` | string | no | Cursor: return objects created after this object id (newer) |
| `created` | `{ gt?, gte?, lt?, lte? }` (ISO-8601 or Date) | no | Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z |
| `status` | `open` · `complete` · `expired` | no | Only objects with this status. |
| `payment_link` | string | no | Only sessions started from this payment link (plink_…) |

**Returns** (HTTP 200): [CheckoutSession[]](#checkoutsession) — A page of checkout sessions, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one.

### `pletopay.checkout.sessions.retrieve(id, options?)`

`GET /api/v1/checkout/sessions/{id}` · operation `getCheckoutSession`

Retrieve a checkout session by id (`cs_…`).

**Path arguments:** `id` (The checkout session id (`cs_…`).)

**Returns** (HTTP 200): [CheckoutSession](#checkoutsession) — The checkout session.

### `pletopay.checkout.sessions.retrieveByReference(reference, options?)`

`GET /api/v1/checkout/sessions/reference/{reference}` · operation `getCheckoutSessionByReference`

Retrieve a checkout session by the `reference` you gave when creating it (unique per mode). An unknown reference returns `404 resource_missing`.

**Path arguments:** `reference` (The `reference` you gave the payment.)

**Returns** (HTTP 200): [CheckoutSession](#checkoutsession) — The checkout session.

### `pletopay.checkout.sessions.expire(id, options?)`

`POST /api/v1/checkout/sessions/{id}/expire` · operation `expireCheckoutSession`

Expire an open checkout session so the customer can no longer pay through it. A session that is already complete or expired returns `409`.

**Path arguments:** `id` (The checkout session id (`cs_…`).)

**Returns** (HTTP 200): [CheckoutSession](#checkoutsession) — The expired checkout session.

## Payment links

Reusable hosted payment pages you can share by URL: no integration needed.

### `pletopay.paymentLinks.create(params, options?)`

`POST /api/v1/payment-links` · operation `createPaymentLink` · Idempotency-Key accepted (generated when omitted)

Create a reusable payment link: a hosted page you can share anywhere. Each visit starts its own checkout session. Set a fixed `amount`, or leave it out and set `min_amount` / `max_amount` to let the customer choose. `max_uses` and `expires_at` stop the link automatically.

**Request fields** (`CreatePaymentLink`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | **yes** |  |
| `description` | string | no |  |
| `amount` | number | no | Fixed amount in kobo. Omit and set min/max to let the customer choose. |
| `min_amount` | number | no |  |
| `max_amount` | number | no |  |
| `max_uses` | number | no | Stop accepting payments after this many |
| `success_url` | string | no |  |
| `cancel_url` | string | no |  |
| `split` | string | no | Split rule (spl_…) |
| `expires_at` | string (date-time) | no |  |
| `metadata` | map of string to string | no |  |

**Returns** (HTTP 201): [PaymentLink](#paymentlink) — The new payment link.

**Example**

```ts
const result = await pletopay.paymentLinks.create({
    "name": "Donation",
    "description": "Support our community library",
    "min_amount": 100000,
    "max_amount": 50000000,
    "success_url": "https://example.com/thanks"
  });
```

### `pletopay.paymentLinks.list(params?, options?)`

`GET /api/v1/payment-links` · operation `listPaymentLinks`

List payment links. Filter by `status` (`active` / `inactive`).

**Query parameters** (`params`):

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | number | no | Number of objects to return. min 1, max 100, default `10` |
| `starting_after` | string | no | Cursor: return objects created before this object id (older) |
| `ending_before` | string | no | Cursor: return objects created after this object id (newer) |
| `created` | `{ gt?, gte?, lt?, lte? }` (ISO-8601 or Date) | no | Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z |
| `status` | `active` · `inactive` | no | Only objects with this status. |

**Returns** (HTTP 200): [PaymentLink[]](#paymentlink) — A page of payment links, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one.

### `pletopay.paymentLinks.retrieve(id, options?)`

`GET /api/v1/payment-links/{id}` · operation `getPaymentLink`

Retrieve a payment link by id (`plink_…`).

**Path arguments:** `id` (The payment link id (`plink_…`).)

**Returns** (HTTP 200): [PaymentLink](#paymentlink) — The payment link.

### `pletopay.paymentLinks.update(id, params, options?)`

`PATCH /api/v1/payment-links/{id}` · operation `updatePaymentLink`

Rename a payment link, change its description, or deactivate it (`active: false`) so it stops accepting payments.

**Path arguments:** `id` (The payment link id (`plink_…`).)

**Request fields** (`UpdatePaymentLink`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `active` | boolean | no |  |
| `name` | string | no |  |
| `description` | string | no |  |

**Returns** (HTTP 200): [PaymentLink](#paymentlink) — The updated payment link.

**Example**

```ts
const result = await pletopay.paymentLinks.update(id, {
    "active": false
  });
```

## Invoices

Itemised invoices with a hosted payment page, paid by bank transfer.

### `pletopay.invoices.create(params, options?)`

`POST /api/v1/invoices` · operation `createInvoice` · Idempotency-Key accepted (generated when omitted)

Create a draft invoice for a customer with line items and optional taxes (basis points, 750 = 7.5%). Totals are computed for you. A draft can be edited; finalize it to make it payable.

**Request fields** (`CreateInvoice`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `customer` | string | **yes** | Customer (cus_…) |
| `items` | array of InvoiceItemDto | **yes** |  |
| `taxes` | array of InvoiceTaxDto | no |  |
| `due_date` | string (date-time) | **yes** |  |
| `memo` | string | no |  |
| `split` | string | no | Split rule (spl_…) |
| `metadata` | map of string to string | no |  |

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `items[].description` | string | **yes** |  |
| `items[].quantity` | number | **yes** |  |
| `items[].unit_amount` | number | **yes** | Unit price in kobo |

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `taxes[].name` | string | **yes** |  |
| `taxes[].bps` | number | **yes** | Rate in basis points (750 = 7.5%) |

**Returns** (HTTP 201): [Invoice](#invoice) — The new draft invoice.

**Example**

```ts
const result = await pletopay.invoices.create({
    "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
    "items": [
      {
        "description": "Website design",
        "quantity": 1,
        "unit_amount": 15000000
      },
      {
        "description": "Hosting (12 months)",
        "quantity": 1,
        "unit_amount": 3000000
      }
    ],
    "taxes": [
      {
        "name": "VAT",
        "bps": 750
      }
    ],
    "due_date": "2026-10-15T00:00:00.000Z",
    "memo": "Thank you for your business."
  });
```

### `pletopay.invoices.list(params?, options?)`

`GET /api/v1/invoices` · operation `listInvoices`

List invoices. Filter by `status`, `customer` or the `subscription` that issued them.

**Query parameters** (`params`):

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | number | no | Number of objects to return. min 1, max 100, default `10` |
| `starting_after` | string | no | Cursor: return objects created before this object id (older) |
| `ending_before` | string | no | Cursor: return objects created after this object id (newer) |
| `created` | `{ gt?, gte?, lt?, lte? }` (ISO-8601 or Date) | no | Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z |
| `status` | `draft` · `open` · `paid` · `void` · `uncollectible` | no | Only objects with this status. |
| `customer` | string | no | Customer (cus_…) |
| `subscription` | string | no | Invoices issued by this subscription (sbs_…) |

**Returns** (HTTP 200): [Invoice[]](#invoice) — A page of invoices, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one.

### `pletopay.invoices.retrieve(id, options?)`

`GET /api/v1/invoices/{id}` · operation `getInvoice`

Retrieve an invoice by id (`inv_…`).

**Path arguments:** `id` (The invoice id (`inv_…`).)

**Returns** (HTTP 200): [Invoice](#invoice) — The invoice.

### `pletopay.invoices.update(id, params, options?)`

`PATCH /api/v1/invoices/{id}` · operation `updateInvoice`

Change a draft invoice’s customer, items, taxes, due date, memo or metadata. Only drafts can be changed (`409 invoice_not_draft`).

**Path arguments:** `id` (The invoice id (`inv_…`).)

**Request fields** (`UpdateInvoice`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `customer` | string | no |  |
| `items` | array of InvoiceItemDto | no |  |
| `taxes` | array of InvoiceTaxDto | no |  |
| `due_date` | string (date-time) | no |  |
| `memo` | string | no |  |
| `metadata` | map of string to string | no |  |

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `items[].description` | string | **yes** |  |
| `items[].quantity` | number | **yes** |  |
| `items[].unit_amount` | number | **yes** | Unit price in kobo |

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `taxes[].name` | string | **yes** |  |
| `taxes[].bps` | number | **yes** | Rate in basis points (750 = 7.5%) |

**Returns** (HTTP 200): [Invoice](#invoice) — The updated draft invoice.

**Example**

```ts
const result = await pletopay.invoices.update(id, {
    "due_date": "2026-10-31T00:00:00.000Z",
    "memo": "Due end of month."
  });
```

### `pletopay.invoices.finalize(id, options?)`

`POST /api/v1/invoices/{id}/finalize` · operation `finalizeInvoice`

Finalize a draft invoice: it gets its number, the amounts are frozen, and `hosted_invoice_url` becomes a payable page to send to your customer. A zero total or a past due date can’t be finalized.

**Path arguments:** `id` (The invoice id (`inv_…`).)

**Returns** (HTTP 200): [Invoice](#invoice) — The invoice, now `open`.

### `pletopay.invoices.void(id, options?)`

`POST /api/v1/invoices/{id}/void` · operation `voidInvoice`

Void an open or uncollectible invoice so it can no longer be paid. Invoices in any other status return `409 invoice_not_open`.

**Path arguments:** `id` (The invoice id (`inv_…`).)

**Returns** (HTTP 200): [Invoice](#invoice) — The invoice, now `void`.

### `pletopay.invoices.markUncollectible(id, options?)`

`POST /api/v1/invoices/{id}/mark-uncollectible` · operation `markInvoiceUncollectible`

Mark an open invoice uncollectible for your records. The customer can still pay it.

**Path arguments:** `id` (The invoice id (`inv_…`).)

**Returns** (HTTP 200): [Invoice](#invoice) — The invoice, now `uncollectible`.

## Subscriptions

Plans and recurring billing through invoices or dedicated accounts. There is no automatic debit.

### `pletopay.plans.create(params, options?)`

`POST /api/v1/plans` · operation `createPlan` · Idempotency-Key accepted (generated when omitted)

Create a plan: an amount billed every `interval_count` × `interval` (for example every 3 months). Subscribe customers to it with `POST /api/v1/subscriptions`.

**Request fields** (`CreatePlan`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | **yes** |  |
| `description` | string | no |  |
| `amount` | number | **yes** | Amount per period in kobo |
| `interval` | `day` · `week` · `month` · `year` | **yes** |  |
| `interval_count` | number | no | Bill every N intervals (e.g. 3 months). default `1` |
| `metadata` | map of string to string | no |  |

**Returns** (HTTP 201): [Plan](#plan) — The new plan.

**Example**

```ts
const result = await pletopay.plans.create({
    "name": "Pro monthly",
    "amount": 500000,
    "interval": "month",
    "interval_count": 1
  });
```

### `pletopay.plans.list(params?, options?)`

`GET /api/v1/plans` · operation `listPlans`

List your plans.

**Query parameters** (`params`):

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | number | no | Number of objects to return. min 1, max 100, default `10` |
| `starting_after` | string | no | Cursor: return objects created before this object id (older) |
| `ending_before` | string | no | Cursor: return objects created after this object id (newer) |
| `created` | `{ gt?, gte?, lt?, lte? }` (ISO-8601 or Date) | no | Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z |

**Returns** (HTTP 200): [Plan[]](#plan) — A page of plans, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one.

### `pletopay.plans.retrieve(id, options?)`

`GET /api/v1/plans/{id}` · operation `getPlan`

Retrieve a plan by id (`plan_…`).

**Path arguments:** `id` (The plan id (`plan_…`).)

**Returns** (HTTP 200): [Plan](#plan) — The plan.

### `pletopay.plans.update(id, params, options?)`

`PATCH /api/v1/plans/{id}` · operation `updatePlan`

Rename a plan or deactivate it. Inactive plans take no new subscriptions; existing subscriptions continue.

**Path arguments:** `id` (The plan id (`plan_…`).)

**Request fields** (`UpdatePlan`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `active` | boolean | no | Inactive plans take no new subscriptions; existing ones continue |
| `name` | string | no |  |
| `description` | string | no |  |

**Returns** (HTTP 200): [Plan](#plan) — The updated plan.

**Example**

```ts
const result = await pletopay.plans.update(id, {
    "active": false
  });
```

### `pletopay.subscriptions.create(params, options?)`

`POST /api/v1/subscriptions` · operation `createSubscription` · Idempotency-Key accepted (generated when omitted)

Subscribe a customer to a plan. The first period’s invoice is issued at `start_date` (default now) and each later one at the end of the period, due after `days_until_due` days.

Nothing is ever debited automatically; Nigerian bank transfers are push payments. With `collection_method: invoice` the customer pays each period through its hosted invoice page. With `dedicated_account`, the customer also gets a dedicated virtual account and an exact transfer into it pays the open invoice.

A customer can have one live subscription per plan (`409 subscription_exists`).

**Request fields** (`CreateSubscription`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `customer` | string | **yes** | Customer (cus_…) |
| `plan` | string | **yes** | Plan (plan_…) |
| `collection_method` | `invoice` · `dedicated_account` | **yes** | invoice: each period is paid through its hosted invoice page. dedicated_account: an exact transfer into the customer's dedicated account also pays it. Nothing is ever debited automatically. |
| `days_until_due` | number | no | default `7` |
| `start_date` | string (date-time) | no | Defaults to now; the first invoice is issued at this time |
| `split` | string | no | Split rule (spl_…) applied to each payment |
| `metadata` | map of string to string | no |  |

**Returns** (HTTP 201): [Subscription](#subscription) — The new subscription.

**Example**

```ts
const result = await pletopay.subscriptions.create({
    "customer": "cus_01J8Z5X7Q9K2M4N6P8R0S2T4V7",
    "plan": "plan_01J8Z5X7Q9K2M4N6P8R0S2T4VA",
    "collection_method": "invoice",
    "days_until_due": 7
  });
```

### `pletopay.subscriptions.list(params?, options?)`

`GET /api/v1/subscriptions` · operation `listSubscriptions`

List subscriptions. Filter by `status` or `customer`.

**Query parameters** (`params`):

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | number | no | Number of objects to return. min 1, max 100, default `10` |
| `starting_after` | string | no | Cursor: return objects created before this object id (older) |
| `ending_before` | string | no | Cursor: return objects created after this object id (newer) |
| `created` | `{ gt?, gte?, lt?, lte? }` (ISO-8601 or Date) | no | Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z |
| `status` | `active` · `past_due` · `canceled` | no | Only objects with this status. |
| `customer` | string | no | Customer (cus_…) |

**Returns** (HTTP 200): [Subscription[]](#subscription) — A page of subscriptions, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one.

### `pletopay.subscriptions.retrieve(id, options?)`

`GET /api/v1/subscriptions/{id}` · operation `getSubscription`

Retrieve a subscription by id (`sbs_…`).

**Path arguments:** `id` (The subscription id (`sbs_…`).)

**Returns** (HTTP 200): [Subscription](#subscription) — The subscription.

### `pletopay.subscriptions.cancel(id, params, options?)`

`POST /api/v1/subscriptions/{id}/cancel` · operation `cancelSubscription`

Cancel a subscription now, or at the end of the current period with `at_period_end: true`. Canceling an already canceled subscription returns `409 subscription_canceled`.

**Path arguments:** `id` (The subscription id (`sbs_…`).)

**Request fields** (`CancelSubscription`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `at_period_end` | boolean | no | Cancel when the current period ends instead of now. default `false` |
| `reason` | string | no |  |

**Returns** (HTTP 200): [Subscription](#subscription) — The updated subscription.

**Example**

```ts
const result = await pletopay.subscriptions.cancel(id, {
    "at_period_end": true,
    "reason": "Customer downgraded"
  });
```

## Transfers

Send money from your available balance to any Nigerian bank account, with name enquiry and a bank list.

### `pletopay.transfers.create(params, options?)`

`POST /api/v1/transfers` · operation `createTransfer` · **Idempotency-Key required** (pass `options.idempotencyKey`; generated when omitted)

Send money from your available balance to any Nigerian bank account. **`Idempotency-Key` is required**: if the request times out, retry with the same key and you will get the original transfer, never a second one.

Resolve the account first with `POST /api/v1/transfers/name-enquiry`. The amount plus fees (`total_debit`) is reserved from your available balance immediately (`400 insufficient_funds` otherwise). The minimum transfer is ₦10.00 (`400 amount_below_minimum`) and `narration` is limited to 50 characters.

A transfer whose outcome isn’t known yet stays `processing`; it is never reported `failed` until it is confirmed. Listen for `transfer.succeeded` / `transfer.failed`. A failed transfer releases the reserved funds.

Money-out can be refused by your risk limits (`403 risk_limit_exceeded`), an operator hold (`403 funds_on_hold`), live-mode verification (`403 compliance_verification_required`) or transfers not being enabled for your account (`403 transfers_disabled`).

**Request fields** (`CreateTransfer`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `amount` | number | **yes** | Amount in kobo. min 100 |
| `currency` | `NGN` | **yes** |  |
| `reference` | string | **yes** |  |
| `narration` | string | **yes** | Shown on the recipient's statement (at most 50 characters). max length 50 |
| `beneficiary` | BeneficiaryDto | **yes** |  |
| `metadata` | map of string to string | no |  |

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `beneficiary.bank_code` | string | **yes** | Bank code from GET /api/v1/banks |
| `beneficiary.account_number` | string | **yes** | 10-digit NUBAN account number |

**Returns** (HTTP 201): [Transfer](#transfer) — The new transfer, `pending` or `processing`.

**Example**

```ts
const result = await pletopay.transfers.create({
    "amount": 2500000,
    "currency": "NGN",
    "reference": "PAYOUT-2026-0001",
    "narration": "Vendor payout September",
    "beneficiary": {
      "bank_code": "058",
      "account_number": "0123456789"
    },
    "metadata": {
      "vendor_id": "v_204"
    }
  });
```

### `pletopay.transfers.list(params?, options?)`

`GET /api/v1/transfers` · operation `listTransfers`

List transfers. Filter by `status` and creation time.

**Query parameters** (`params`):

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | number | no | Number of objects to return. min 1, max 100, default `10` |
| `starting_after` | string | no | Cursor: return objects created before this object id (older) |
| `ending_before` | string | no | Cursor: return objects created after this object id (newer) |
| `created` | `{ gt?, gte?, lt?, lte? }` (ISO-8601 or Date) | no | Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z |
| `status` | `pending` · `processing` · `succeeded` · `failed` · `reversed` | no | Only objects with this status. |

**Returns** (HTTP 200): [Transfer[]](#transfer) — A page of transfers, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one.

### `pletopay.transfers.retrieve(id, options?)`

`GET /api/v1/transfers/{id}` · operation `getTransfer`

Retrieve a transfer by id (`trf_…`).

**Path arguments:** `id` (The transfer id (`trf_…`).)

**Returns** (HTTP 200): [Transfer](#transfer) — The transfer.

### `pletopay.transfers.retrieveByReference(reference, options?)`

`GET /api/v1/transfers/reference/{reference}` · operation `getTransferByReference`

Retrieve a transfer by the `reference` you gave when sending it. References are unique per mode, so this is a safe way to check a transfer after a timeout when you never received its id. An unknown reference returns `404 resource_missing`.

**Path arguments:** `reference` (The `reference` you gave the payment.)

**Returns** (HTTP 200): [Transfer](#transfer) — The transfer.

### `pletopay.transfers.resolveAccount(params, options?)`

`POST /api/v1/transfers/name-enquiry` · operation `resolveAccount`

Look up the account name for a bank code and account number (NIP name enquiry). Show the name to the person sending money before they confirm. An account that can’t be resolved returns `400 account_not_resolved`. In live mode, lookups need an approved business verification and count toward the money-movement rate limit.

**Request fields** (`NameEnquiry`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `bank_code` | string | **yes** |  |
| `account_number` | string | **yes** |  |

**Returns** (HTTP 200): [AccountResolution](#accountresolution) — The resolved account.

**Example**

```ts
const result = await pletopay.transfers.resolveAccount({
    "bank_code": "058",
    "account_number": "0123456789"
  });
```

### `pletopay.banks.list(options?)`

`GET /api/v1/banks` · operation `listBanks`

List the banks you can send transfers to, with the `code` to use as `bank_code`. The list is cached for an hour.

**Returns** (HTTP 200): [Bank[]](#bank) — All supported banks (not paginated).

## Refunds

Return money for a payment by bank transfer, fully or partially.

### `pletopay.refunds.create(params, options?)`

`POST /api/v1/refunds` · operation `createRefund` · **Idempotency-Key required** (pass `options.idempotencyKey`; generated when omitted)

Refund a payment, fully or partially, by bank transfer from your available balance. **`Idempotency-Key` is required.**

Without `amount`, the whole refundable amount is refunded. Only `succeeded` or `partially_refunded` payments can be refunded (`409 payment_not_refundable`).

**Destination.** When the sender’s full account details are known, the refund always goes back to that account: omit `destination` (a different one returns `400 refund_destination_mismatch`). When the sender isn’t known, pass `destination` (`400 refund_destination_required` otherwise); it is verified by name enquiry. In live mode a custom destination also needs outbound transfers enabled (`403 transfers_disabled`).

The payment becomes `partially_refunded` or `refunded` only once the refund has actually been paid out (`refund.succeeded`). Without a `reference`, one is derived from the `Idempotency-Key`, so a retried request can’t create a second refund.

**Request fields** (`CreateRefund`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `payment` | string | **yes** | The original payment (pay_…) |
| `amount` | number | no | Amount in kobo; defaults to the full refundable amount (partial refunds allowed) |
| `reason` | string | **yes** |  |
| `reference` | string | no | Your unique refund reference |
| `destination` | unknown | no | Where to send the money. Defaults to the original sender when their full account details are known. |
| `metadata` | map of string to string | no |  |

**Returns** (HTTP 201): [Refund](#refund) — The new refund, `pending` or `processing`.

**Example**

```ts
const result = await pletopay.refunds.create({
    "payment": "pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6",
    "amount": 1000000,
    "reason": "Customer returned the item",
    "reference": "RFND-12345"
  });
```

### `pletopay.refunds.list(params?, options?)`

`GET /api/v1/refunds` · operation `listRefunds`

List refunds. Filter by `payment` to see the refunds of one payment.

**Query parameters** (`params`):

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | number | no | Number of objects to return. min 1, max 100, default `10` |
| `starting_after` | string | no | Cursor: return objects created before this object id (older) |
| `ending_before` | string | no | Cursor: return objects created after this object id (newer) |
| `created` | `{ gt?, gte?, lt?, lte? }` (ISO-8601 or Date) | no | Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z |
| `payment` | string | no | Only refunds of this payment (pay_…) |

**Returns** (HTTP 200): [Refund[]](#refund) — A page of refunds, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one.

### `pletopay.refunds.retrieve(id, options?)`

`GET /api/v1/refunds/{id}` · operation `getRefund`

Retrieve a refund by id (`re_…`).

**Path arguments:** `id` (The refund id (`re_…`).)

**Returns** (HTTP 200): [Refund](#refund) — The refund.

### `pletopay.refunds.retrieveByReference(reference, options?)`

`GET /api/v1/refunds/reference/{reference}` · operation `getRefundByReference`

Retrieve a refund by its `reference` (unique per mode). A refund created without one is given a generated reference, returned in its `reference` field. An unknown reference returns `404 resource_missing`.

**Path arguments:** `reference` (The `reference` you gave the payment.)

**Returns** (HTTP 200): [Refund](#refund) — The refund.

## Settlements

Payouts of your available balance to your settlement bank account, scheduled or on demand, itemised for reconciliation.

### `pletopay.settlements.list(params?, options?)`

`GET /api/v1/settlements` · operation `listSettlements`

List settlements: payouts of your available balance (or a subaccount’s) to the settlement account you set in the dashboard, on your schedule or on demand. Filter by `status` or `subaccount`.

**Query parameters** (`params`):

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | number | no | Number of objects to return. min 1, max 100, default `10` |
| `starting_after` | string | no | Cursor: return objects created before this object id (older) |
| `ending_before` | string | no | Cursor: return objects created after this object id (newer) |
| `created` | `{ gt?, gte?, lt?, lte? }` (ISO-8601 or Date) | no | Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z |
| `status` | `pending` · `processing` · `completed` · `failed` | no | Only objects with this status. |
| `subaccount` | string | no | Only settlements of this subaccount (sub_…) |

**Returns** (HTTP 200): [Settlement[]](#settlement) — A page of settlements, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one.

### `pletopay.settlements.retrieve(id, options?)`

`GET /api/v1/settlements/{id}` · operation `getSettlement`

Retrieve a settlement by id (`stl_…`), including its fees and the payout transfer’s status.

**Path arguments:** `id` (The settlement id (`stl_…`).)

**Returns** (HTTP 200): [Settlement](#settlement) — The settlement.

### `pletopay.settlements.listItems(id, options?)`

`GET /api/v1/settlements/{id}/items` · operation `listSettlementItems`

Every movement of your available balance up to the settlement’s cutoff that this settlement accounts for. Use it to reconcile a payout against the payments and transfers behind it.

**Path arguments:** `id` (The settlement id (`stl_…`).)

**Returns** (HTTP 200): [SettlementItem[]](#settlementitem) — All items of the settlement (not paginated).

## Subaccounts & splits

Marketplaces and platforms: give sellers their own balance and payout account, and split payments with them.

### `pletopay.subaccounts.create(params, options?)`

`POST /api/v1/subaccounts` · operation `createSubaccount` · Idempotency-Key accepted (generated when omitted)

Create a subaccount: a seller, vendor or branch on your platform with its own balance and payout account. The payout account is verified by name enquiry (`400 account_not_resolved` if it can’t be resolved). Payments share their net amount with subaccounts through split rules.

**Request fields** (`CreateSubaccount`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | **yes** |  |
| `email` | string | no |  |
| `bank_code` | string | **yes** | Payout bank code |
| `account_number` | string | **yes** | Payout account (verified by name enquiry) |
| `metadata` | map of string to string | no |  |

**Returns** (HTTP 201): [Subaccount](#subaccount) — The new subaccount.

**Example**

```ts
const result = await pletopay.subaccounts.create({
    "name": "Mama Ngozi Kitchen",
    "email": "payouts@example.com",
    "bank_code": "058",
    "account_number": "0123456789",
    "metadata": {
      "vendor_id": "v_204"
    }
  });
```

### `pletopay.subaccounts.list(params?, options?)`

`GET /api/v1/subaccounts` · operation `listSubaccounts`

List your subaccounts.

**Query parameters** (`params`):

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | number | no | Number of objects to return. min 1, max 100, default `10` |
| `starting_after` | string | no | Cursor: return objects created before this object id (older) |
| `ending_before` | string | no | Cursor: return objects created after this object id (newer) |
| `created` | `{ gt?, gte?, lt?, lte? }` (ISO-8601 or Date) | no | Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z |

**Returns** (HTTP 200): [Subaccount[]](#subaccount) — A page of subaccounts, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one.

### `pletopay.subaccounts.retrieve(id, options?)`

`GET /api/v1/subaccounts/{id}` · operation `getSubaccount`

Retrieve a subaccount by id (`sub_…`).

**Path arguments:** `id` (The subaccount id (`sub_…`).)

**Returns** (HTTP 200): [Subaccount](#subaccount) — The subaccount.

### `pletopay.subaccounts.update(id, params, options?)`

`PATCH /api/v1/subaccounts/{id}` · operation `updateSubaccount`

Update a subaccount’s name, email, status or metadata. Changing the payout account (`bank_code` with `account_number`) re-runs name enquiry, and the new account is used only after a cooldown (`settlement_account.usable_from`) to protect against account takeover.

**Path arguments:** `id` (The subaccount id (`sub_…`).)

**Request fields** (`UpdateSubaccount`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | no |  |
| `email` | string | no |  |
| `status` | `active` · `inactive` | no |  |
| `bank_code` | string | no | Change the payout account (a cooldown applies before it is used) |
| `account_number` | string | no |  |
| `metadata` | map of string to string | no |  |

**Returns** (HTTP 200): [Subaccount](#subaccount) — The updated subaccount.

**Example**

```ts
const result = await pletopay.subaccounts.update(id, {
    "status": "inactive"
  });
```

### `pletopay.subaccounts.retrieveBalance(id, options?)`

`GET /api/v1/subaccounts/{id}/balance` · operation `getSubaccountBalance`

A subaccount’s pending, available and settling balances, read from the ledger.

**Path arguments:** `id` (The subaccount id (`sub_…`).)

**Returns** (HTTP 200): [SubaccountBalance](#subaccountbalance) — The subaccount’s balances in kobo.

### `pletopay.splitRules.create(params, options?)`

`POST /api/v1/split-rules` · operation `createSplitRule` · Idempotency-Key accepted (generated when omitted)

Create a split rule that shares each payment’s **net amount** (after fees) with one or more subaccounts. The rest stays in your balance.

`percentage` shares are basis points (2500 = 25%); `flat` shares are kobo, capped at the net amount. Pass the rule id as `split` when you create a payment, checkout session, payment link, invoice or subscription. The split is frozen on each payment when it is created.

**Request fields** (`CreateSplitRule`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | **yes** |  |
| `type` | `percentage` · `flat` | **yes** |  |
| `allocations` | array of SplitAllocationDto | **yes** |  |
| `metadata` | map of string to string | no |  |

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `allocations[].subaccount` | string | **yes** | Subaccount id (sub_…) |
| `allocations[].share` | number | **yes** | percentage: basis points of the net amount (2500 = 25%). flat: amount in kobo. |

**Returns** (HTTP 201): [SplitRule](#splitrule) — The new split rule.

**Example**

```ts
const result = await pletopay.splitRules.create({
    "name": "Marketplace 80/20",
    "type": "percentage",
    "allocations": [
      {
        "subaccount": "sub_01J8Z5X7Q9K2M4N6P8R0S2T4V9",
        "share": 8000
      }
    ]
  });
```

### `pletopay.splitRules.list(params?, options?)`

`GET /api/v1/split-rules` · operation `listSplitRules`

List your split rules.

**Query parameters** (`params`):

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | number | no | Number of objects to return. min 1, max 100, default `10` |
| `starting_after` | string | no | Cursor: return objects created before this object id (older) |
| `ending_before` | string | no | Cursor: return objects created after this object id (newer) |
| `created` | `{ gt?, gte?, lt?, lte? }` (ISO-8601 or Date) | no | Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z |

**Returns** (HTTP 200): [SplitRule[]](#splitrule) — A page of split rules, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one.

### `pletopay.splitRules.retrieve(id, options?)`

`GET /api/v1/split-rules/{id}` · operation `getSplitRule`

Retrieve a split rule by id (`spl_…`).

**Path arguments:** `id` (The split rule id (`spl_…`).)

**Returns** (HTTP 200): [SplitRule](#splitrule) — The split rule.

### `pletopay.splitRules.update(id, params, options?)`

`PATCH /api/v1/split-rules/{id}` · operation `updateSplitRule`

Activate or deactivate a split rule. Deactivated rules can’t be used for new payments; payments already created keep their frozen split.

**Path arguments:** `id` (The split rule id (`spl_…`).)

**Request fields** (`UpdateSplitRule`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `active` | boolean | **yes** | Deactivated rules cannot be used for new payments; existing payments keep their frozen split. |

**Returns** (HTTP 200): [SplitRule](#splitrule) — The updated split rule.

**Example**

```ts
const result = await pletopay.splitRules.update(id, {
    "active": false
  });
```

## Balance

Your balances and the ledger transactions behind them.

### `pletopay.balance.retrieve(options?)`

`GET /api/v1/balance` · operation `getBalance`

Your balances in this mode, computed from the double-entry ledger:

- `available`: can be sent as transfers, refunds or settlements.
- `pending`: received but not yet available.
- `held`: on hold.
- `unapplied`: received money under review.
- `settling`: reserved by an open settlement.
- `total`: the sum of the above. `settled_total`: the lifetime amount paid out by completed settlements.

**Returns** (HTTP 200): [Balance](#balance) — Your balances in kobo.

### `pletopay.transactions.list(params?, options?)`

`GET /api/v1/transactions` · operation `listTransactions`

Every ledger journal that moved your balances, with its signed effect per balance (credits to you are positive) and the object that caused it. Filter by journal `type` or by `source`. Use it for reconciliation.

**Query parameters** (`params`):

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | number | no | Number of objects to return. min 1, max 100, default `10` |
| `starting_after` | string | no | Cursor: return objects created before this object id (older) |
| `ending_before` | string | no | Cursor: return objects created after this object id (newer) |
| `created` | `{ gt?, gte?, lt?, lte? }` (ISO-8601 or Date) | no | Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z |
| `type` | `payment_receipt` · `unmatched_receipt` · `unapplied_receipt` · `unapplied_application` · `suspense_assignment` · `funds_release` · `sweep` · `transfer_reserve` · `transfer_complete` · `transfer_release` · `external_debit` · `adjustment` · `reversal` · `settlement_reserve` · `settlement_complete` · `settlement_release` · `split_allocation` | no | Only objects of this type. |
| `source` | `payment` · `transfer` · `account_transaction` · `adjustment` | no | What caused the movement |

**Returns** (HTTP 200): [LedgerTransaction[]](#ledgertransaction) — A page of ledger transactions, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one.

## Reports

CSV exports and balance statements for accounting and reconciliation.

### `pletopay.reports.create(params, options?)`

`POST /api/v1/reports` · operation `createReport`

Generate a CSV report for a period of up to 366 days (`period_end` is exclusive). Reports run in the background: poll the report or listen for `report.ready`, then download it. Amounts in the CSV are exact decimal naira and times are UTC. The file is available until the report’s `expires_at`. At most two reports generate at once per mode (`429 reports_in_progress`).

**Request fields** (`CreateReport`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | `payments` · `transfers` · `refunds` · `settlements` · `balance_statement` · `customers` · `invoices` · `subscriptions` | **yes** |  |
| `period_start` | string (date-time) | **yes** |  |
| `period_end` | string (date-time) | **yes** | Exclusive; at most 366 days after period_start |

**Returns** (HTTP 201): [Report](#report) — The new report, `pending`.

**Example**

```ts
const result = await pletopay.reports.create({
    "type": "payments",
    "period_start": "2026-09-01T00:00:00.000Z",
    "period_end": "2026-10-01T00:00:00.000Z"
  });
```

### `pletopay.reports.list(params?, options?)`

`GET /api/v1/reports` · operation `listReports`

List reports. Filter by `type` or `status`.

**Query parameters** (`params`):

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | number | no | Number of objects to return. min 1, max 100, default `10` |
| `starting_after` | string | no | Cursor: return objects created before this object id (older) |
| `ending_before` | string | no | Cursor: return objects created after this object id (newer) |
| `created` | `{ gt?, gte?, lt?, lte? }` (ISO-8601 or Date) | no | Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z |
| `type` | `payments` · `transfers` · `refunds` · `settlements` · `balance_statement` · `customers` · `invoices` · `subscriptions` | no | Only objects of this type. |
| `status` | `pending` · `running` · `succeeded` · `failed` | no | Only objects with this status. |

**Returns** (HTTP 200): [Report[]](#report) — A page of reports, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one.

### `pletopay.reports.retrieve(id, options?)`

`GET /api/v1/reports/{id}` · operation `getReport`

Retrieve a report by id (`rpt_…`).

**Path arguments:** `id` (The report id (`rpt_…`).)

**Returns** (HTTP 200): [Report](#report) — The report.

### `pletopay.reports.download(id, options?)`

`GET /api/v1/reports/{id}/download` · operation `downloadReport`

Download a finished report as CSV. The `X-Content-SHA256` response header carries the file’s hash (it matches the report’s `sha256`). A report still generating returns `409 report_not_ready`; an expired file returns `409 report_expired`.

**Path arguments:** `id` (The report id (`rpt_…`).)

**Returns** (HTTP 200): text/csv (The CSV file.)

### `pletopay.reports.statement(params?, options?)`

`GET /api/v1/statement` · operation `getStatement`

Opening balance, credits, debits and closing balance for each of your balances over a period, computed from the ledger.

**Query parameters** (`params`):

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `period_start` | string (date-time) | **yes** | Start of the period (inclusive, ISO 8601). |
| `period_end` | string (date-time) | **yes** | End of the period (exclusive, ISO 8601). |

**Returns** (HTTP 200): [Statement](#statement) — The statement.

## Risk

Your risk limits, risk events and per-customer risk status.

### `pletopay.risk.listEvents(params?, options?)`

`GET /api/v1/risk-events` · operation `listRiskEvents`

List risk events: money movements blocked by your risk limits and payments flagged for review (high value, customer velocity, blocked customers). Filter by `review_status`.

**Query parameters** (`params`):

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | number | no | Number of objects to return. min 1, max 100, default `10` |
| `starting_after` | string | no | Cursor: return objects created before this object id (older) |
| `ending_before` | string | no | Cursor: return objects created after this object id (newer) |
| `created` | `{ gt?, gte?, lt?, lte? }` (ISO-8601 or Date) | no | Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z |
| `review_status` | `open` · `cleared` · `confirmed` | no | Only risk events with this review status. |

**Returns** (HTTP 200): [RiskEvent[]](#riskevent) — A page of risk events, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one.

### `pletopay.risk.retrieveLimits(options?)`

`GET /api/v1/risk-limits` · operation `getRiskLimits`

Your effective risk limits in this mode, in kobo (0 = no limit). Transfers and refunds over a limit are refused with `403 risk_limit_exceeded`; received payments over `high_value_payment` are flagged, never refused.

**Returns** (HTTP 200): [RiskLimits](#risklimits) — Your risk limits.

### `pletopay.customers.setRiskStatus(id, params, options?)`

`POST /api/v1/customers/{id}/risk-status` · operation `setCustomerRiskStatus`

Set a customer’s risk status. `blocked` customers can’t be issued new payments or accounts (`409 customer_blocked`); `elevated` is informational.

**Path arguments:** `id` (The customer id (`cus_…`).)

**Request fields** (`CustomerRisk`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `status` | `normal` · `elevated` · `blocked` | **yes** | blocked: no new payments or accounts for this customer |
| `reason` | string | no |  |

**Returns** (HTTP 200): [Customer](#customer) — The updated customer.

**Example**

```ts
const result = await pletopay.customers.setRiskStatus(id, {
    "status": "blocked",
    "reason": "Chargeback history"
  });
```

## Webhooks

Endpoints that receive signed events, the event log, delivery history and replays.

### `pletopay.webhookEndpoints.create(params, options?)`

`POST /api/v1/webhook-endpoints` · operation `createWebhookEndpoint` · Idempotency-Key accepted (generated when omitted)

Register a publicly reachable endpoint to receive events (https is required for live mode; private network addresses are refused). Subscribe to specific `enabled_events` or `*` for all. The signing secret (`whsec_…`) is returned **only in this response**: store it to verify `X-PletoPay-Signature`. You can have up to 16 endpoints per mode (`400 webhook_endpoint_limit_reached`).

**Request fields** (`CreateWebhookEndpoint`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | **yes** |  |
| `enabled_events` | array of `*` · `payment.created` · `payment.pending` · `payment.succeeded` · `payment.failed` · `payment.expired` · `payment.under_review` · `payment.reversed` · `payment.partially_refunded` · `payment.refunded` · `virtual_account.created` · `virtual_account.updated` · `virtual_account.closed` · `transfer.created` · `transfer.processing` · `transfer.succeeded` · `transfer.failed` · `transfer.reversed` · `settlement.created` · `settlement.completed` · `settlement.failed` · `refund.created` · `refund.succeeded` · `refund.failed` · `checkout.session.completed` · `checkout.session.expired` · `invoice.created` · `invoice.finalized` · `invoice.paid` · `invoice.voided` · `invoice.marked_uncollectible` · `subscription.created` · `subscription.updated` · `subscription.past_due` · `subscription.canceled` · `report.ready` · `report.failed` · `risk.event_flagged` · `webhook.test` | **yes** |  |
| `description` | string | no |  |

**Returns** (HTTP 201): [WebhookEndpoint](#webhookendpoint) — The new endpoint, including its `secret`.

**Example**

```ts
const result = await pletopay.webhookEndpoints.create({
    "url": "https://example.com/webhooks/pletopay",
    "enabled_events": [
      "payment.succeeded",
      "payment.failed",
      "transfer.succeeded",
      "transfer.failed"
    ],
    "description": "Production order service"
  });
```

### `pletopay.webhookEndpoints.list(params?, options?)`

`GET /api/v1/webhook-endpoints` · operation `listWebhookEndpoints`

List your webhook endpoints with their delivery health.

**Query parameters** (`params`):

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | number | no | Number of objects to return. min 1, max 100, default `10` |
| `starting_after` | string | no | Cursor: return objects created before this object id (older) |
| `ending_before` | string | no | Cursor: return objects created after this object id (newer) |
| `created` | `{ gt?, gte?, lt?, lte? }` (ISO-8601 or Date) | no | Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z |

**Returns** (HTTP 200): [WebhookEndpoint[]](#webhookendpoint) — A page of webhook endpoints, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one.

### `pletopay.webhookEndpoints.retrieve(id, options?)`

`GET /api/v1/webhook-endpoints/{id}` · operation `getWebhookEndpoint`

Retrieve a webhook endpoint by id (`we_…`).

**Path arguments:** `id` (The webhook endpoint id (`we_…`).)

**Returns** (HTTP 200): [WebhookEndpoint](#webhookendpoint) — The webhook endpoint.

### `pletopay.webhookEndpoints.update(id, params, options?)`

`PATCH /api/v1/webhook-endpoints/{id}` · operation `updateWebhookEndpoint`

Change an endpoint’s URL, events or description, or disable and re-enable it. Re-enabling an endpoint that was auto-disabled after repeated failures resets its health.

**Path arguments:** `id` (The webhook endpoint id (`we_…`).)

**Request fields** (`UpdateWebhookEndpoint`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | no |  |
| `enabled_events` | array of `*` · `payment.created` · `payment.pending` · `payment.succeeded` · `payment.failed` · `payment.expired` · `payment.under_review` · `payment.reversed` · `payment.partially_refunded` · `payment.refunded` · `virtual_account.created` · `virtual_account.updated` · `virtual_account.closed` · `transfer.created` · `transfer.processing` · `transfer.succeeded` · `transfer.failed` · `transfer.reversed` · `settlement.created` · `settlement.completed` · `settlement.failed` · `refund.created` · `refund.succeeded` · `refund.failed` · `checkout.session.completed` · `checkout.session.expired` · `invoice.created` · `invoice.finalized` · `invoice.paid` · `invoice.voided` · `invoice.marked_uncollectible` · `subscription.created` · `subscription.updated` · `subscription.past_due` · `subscription.canceled` · `report.ready` · `report.failed` · `risk.event_flagged` · `webhook.test` | no |  |
| `description` | string | no |  |
| `status` | `enabled` · `disabled` | no |  |

**Returns** (HTTP 200): [WebhookEndpoint](#webhookendpoint) — The updated webhook endpoint.

**Example**

```ts
const result = await pletopay.webhookEndpoints.update(id, {
    "enabled_events": [
      "*"
    ],
    "status": "enabled"
  });
```

### `pletopay.webhookEndpoints.delete(id, options?)`

`DELETE /api/v1/webhook-endpoints/{id}` · operation `deleteWebhookEndpoint`

Delete a webhook endpoint. Deliveries to it stop; its delivery history is kept.

**Path arguments:** `id` (The webhook endpoint id (`we_…`).)

**Returns** (HTTP 200): [DeletedObject](#deletedobject) — Confirmation that the endpoint was deleted.

### `pletopay.webhookEndpoints.rotateSecret(id, options?)`

`POST /api/v1/webhook-endpoints/{id}/rotate-secret` · operation `rotateWebhookSecret`

Replace the endpoint’s signing secret. The new secret is returned only in this response, and deliveries are signed with it from now on.

**Path arguments:** `id` (The webhook endpoint id (`we_…`).)

**Returns** (HTTP 200): [WebhookEndpoint](#webhookendpoint) — The endpoint, including its new `secret`.

### `pletopay.webhookEndpoints.test(id, options?)`

`POST /api/v1/webhook-endpoints/{id}/test` · operation `testWebhookEndpoint`

Send a signed `webhook.test` event to this endpoint only, to check your signature verification and connectivity. The endpoint must be enabled (`409 endpoint_disabled`). Test sends are limited per business (`429 rate_limited`, see `Retry-After`).

**Path arguments:** `id` (The webhook endpoint id (`we_…`).)

**Returns** (HTTP 200): [WebhookDelivery](#webhookdelivery) — The test delivery.

### `pletopay.webhookEndpoints.listDeliveries(id, params?, options?)`

`GET /api/v1/webhook-endpoints/{id}/deliveries` · operation `listEndpointDeliveries`

Delivery attempts to this endpoint, with response status, error and timing. Filter by `status`.

**Path arguments:** `id` (The webhook endpoint id (`we_…`).)

**Query parameters** (`params`):

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | number | no | Number of objects to return. min 1, max 100, default `10` |
| `starting_after` | string | no | Cursor: return objects created before this object id (older) |
| `ending_before` | string | no | Cursor: return objects created after this object id (newer) |
| `created` | `{ gt?, gte?, lt?, lte? }` (ISO-8601 or Date) | no | Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z |
| `status` | `pending` · `succeeded` · `failed` · `dead` | no | Only objects with this status. |

**Returns** (HTTP 200): [WebhookDelivery[]](#webhookdelivery) — A page of deliveries, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one.

### `pletopay.events.list(params?, options?)`

`GET /api/v1/events` · operation `listEvents`

List events, the same objects delivered to your webhooks. Filter by `type` or by `resource_id` (e.g. a payment id) to see everything that happened to one object. Use it to catch up after downtime.

**Query parameters** (`params`):

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | number | no | Number of objects to return. min 1, max 100, default `10` |
| `starting_after` | string | no | Cursor: return objects created before this object id (older) |
| `ending_before` | string | no | Cursor: return objects created after this object id (newer) |
| `created` | `{ gt?, gte?, lt?, lte? }` (ISO-8601 or Date) | no | Filter on creation time, e.g. created[gte]=2026-01-01T00:00:00Z |
| `type` | `payment.created` · `payment.pending` · `payment.succeeded` · `payment.failed` · `payment.expired` · `payment.under_review` · `payment.reversed` · `payment.partially_refunded` · `payment.refunded` · `virtual_account.created` · `virtual_account.updated` · `virtual_account.closed` · `transfer.created` · `transfer.processing` · `transfer.succeeded` · `transfer.failed` · `transfer.reversed` · `settlement.created` · `settlement.completed` · `settlement.failed` · `refund.created` · `refund.succeeded` · `refund.failed` · `checkout.session.completed` · `checkout.session.expired` · `invoice.created` · `invoice.finalized` · `invoice.paid` · `invoice.voided` · `invoice.marked_uncollectible` · `subscription.created` · `subscription.updated` · `subscription.past_due` · `subscription.canceled` · `report.ready` · `report.failed` · `risk.event_flagged` · `webhook.test` | no | Only objects of this type. |
| `resource_id` | string | no | Only events about this object (e.g. pay_…) |

**Returns** (HTTP 200): [Event[]](#event) — A page of events, newest first, in `data`. Pass `meta.next_cursor` as `starting_after` to fetch the next page; it is `null` on the last one.

### `pletopay.events.retrieve(id, options?)`

`GET /api/v1/events/{id}` · operation `getEvent`

Retrieve an event by id (`evt_…`).

**Path arguments:** `id` (The event id (`evt_…`).)

**Returns** (HTTP 200): [Event](#event) — The event.

### `pletopay.events.listDeliveries(id, options?)`

`GET /api/v1/events/{id}/deliveries` · operation `listEventDeliveries`

Every delivery of this event to your endpoints.

**Path arguments:** `id` (The event id (`evt_…`).)

**Returns** (HTTP 200): [WebhookDelivery[]](#webhookdelivery) — All deliveries of the event (not paginated).

### `pletopay.events.replay(id, params, options?)`

`POST /api/v1/events/{id}/replay` · operation `replayEvent` · Idempotency-Key accepted (generated when omitted)

Deliver an event again, to every endpoint subscribed to it or to one `endpoint`. The payload and `X-PletoPay-Event-ID` are unchanged, so your de-duplication still applies. Replays are limited per business (`429 rate_limited`, see `Retry-After`).

**Path arguments:** `id` (The event id (`evt_…`).)

**Request fields** (`ReplayEvent`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `endpoint` | string | no | Only replay to this endpoint (we_…) |

**Returns** (HTTP 200): [WebhookDelivery[]](#webhookdelivery) — The new deliveries (not paginated).

**Example**

```ts
const result = await pletopay.events.replay(id, {
    "endpoint": "we_01J8Z5X7Q9K2M4N6P8R0S2T4VB"
  });
```

## Sandbox

Test-mode tools that simulate what customers do.

### `pletopay.sandbox.simulateTransfer(params, options?)`

`POST /api/v1/sandbox/simulate-transfer` · operation `simulateTransfer` · **test mode only**

**Test mode only** (`403 test_mode_only` with a live key). Simulate a transfer into one of your test virtual accounts, as a customer would make it.

The transfer then flows through the same pipeline as live money: the payment moves to `succeeded` and webhooks are sent. A wrong amount into an exact-amount account is refused (`400 simulation_rejected`), as a real transfer would be. An account that is not `active` (for example a one-time account that already received its payment) is refused before anything is sent (`409 virtual_account_not_active`). A `202` only means the simulation was accepted; watch the payment or its events for the outcome.

**Request fields** (`SimulateTransfer`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `account_number` | string | **yes** | Your virtual account number that should receive the transfer |
| `amount` | number | **yes** | Amount in kobo |

**Returns** (HTTP 202): [SimulatedTransfer](#simulatedtransfer) — The simulation was accepted.

**Example**

```ts
const result = await pletopay.sandbox.simulateTransfer({
    "account_number": "9000002140",
    "amount": 5000000
  });
```

## Object schemas

The response objects, as returned in `data`. Unknown fields may be added at any time; ignore what you do not use.

### DateRangeFilter

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `gt` | string (date-time) | no |  |
| `gte` | string (date-time) | no |  |
| `lt` | string (date-time) | no |  |
| `lte` | string (date-time) | no |  |

### AmountRangeFilter

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `gte` | integer | no |  |
| `lte` | integer | no |  |

### Error

Every error response. Program against `error.type` and `error.code`; `message` is for humans and may change.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `status` | `false` | **yes** |  |
| `message` | string | **yes** | Human-readable explanation |
| `error` | object | **yes** |  |
| `request_id` | string | **yes** |  |

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `error.type` | `invalid_request` · `authentication_error` · `permission_error` · `not_found` · `conflict` · `idempotency_error` · `rate_limit_error` · `api_error` | **yes** |  |
| `error.code` | string | **yes** | Stable machine-readable code (the error catalogue lists every code) |
| `error.param` | string | no | The request field the error is about, when there is one |
| `error.details` | object | no |  |

### Customer

Someone who pays you. Customers own dedicated accounts, invoices and subscriptions.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | **yes** | pattern `^cus_[0-9A-HJKMNP-TV-Z]{26}$` |
| `object` | `customer` | **yes** |  |
| `livemode` | boolean | **yes** |  |
| `email` | string or null | **yes** |  |
| `name` | string or null | **yes** |  |
| `phone` | string or null | **yes** |  |
| `external_id` | string or null | **yes** |  |
| `risk_status` | `normal` · `elevated` · `blocked` | **yes** | blocked customers cannot be issued new payments or accounts |
| `metadata` | map of string to string | **yes** |  |
| `created_at` | string (date-time) | **yes** |  |
| `updated_at` | string (date-time) | **yes** |  |

### BankTransferInstructions

What to show your customer: the account to transfer to, at which bank, until when.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `account_number` | string | **yes** | pattern `^[0-9]{10}$` |
| `account_name` | string | **yes** | Account name; payers see it prefixed by the business short name (e.g. "IPC/Ada Stores Ltd") |
| `bank_name` | string | **yes** |  |
| `bank_code` | string | **yes** |  |
| `virtual_account` | string | **yes** | pattern `^va_[0-9A-HJKMNP-TV-Z]{26}$` |
| `expires_at` | string or null | **yes** |  |

### Payment

A request for money by bank transfer. `status` moves `created` → `pending` (account issued) → `succeeded` when the credit is confirmed, or to `expired`, `failed` or `under_review`.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | **yes** | pattern `^pay_[0-9A-HJKMNP-TV-Z]{26}$` |
| `object` | `payment` | **yes** |  |
| `livemode` | boolean | **yes** |  |
| `reference` | string | **yes** |  |
| `amount` | integer or null | **yes** | Expected amount in minor units; null when amount_rule is any |
| `amount_received` | integer | **yes** | Minor units (kobo for NGN) |
| `fee` | integer | **yes** | Minor units (kobo for NGN) |
| `stamp_duty` | integer | **yes** | Minor units (kobo for NGN) |
| `net_amount` | integer | **yes** | Minor units (kobo for NGN) |
| `amount_refunded` | integer | **yes** | Total of successful refunds against this payment |
| `split` | string or null | **yes** | Split rule (spl_…) applied to this payment |
| `split_amount` | integer | **yes** | Part of net_amount allocated to subaccounts by the split rule |
| `currency` | `NGN` | **yes** |  |
| `status` | `created` · `pending` · `processing` · `succeeded` · `under_review` · `failed` · `expired` · `reversed` · `partially_refunded` · `refunded` | **yes** | partially_refunded / refunded are set only once a refund has actually been paid out. |
| `payment_method` | `bank_transfer` | **yes** |  |
| `amount_rule` | `exact` · `any` | **yes** |  |
| `source` | `api` · `dedicated_virtual_account` | **yes** |  |
| `customer` | null or string or [Customer](#customer) | **yes** | Customer id, or the full object with expand[]=customer |
| `bank_transfer` | null or [BankTransferInstructions](#banktransferinstructions) | **yes** |  |
| `description` | string or null | **yes** |  |
| `metadata` | map of string to string | **yes** |  |
| `failure_reason` | string or null | **yes** |  |
| `review_reason` | string or null | **yes** |  |
| `created_at` | string (date-time) | **yes** |  |
| `expires_at` | string or null | **yes** |  |
| `succeeded_at` | string or null | **yes** |  |

### VirtualAccount

A bank account number that routes transfers into your balance: `dedicated` (one customer, permanent) or `dynamic` (one payment).

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | **yes** | pattern `^va_[0-9A-HJKMNP-TV-Z]{26}$` |
| `object` | `virtual_account` | **yes** |  |
| `livemode` | boolean | **yes** |  |
| `type` | `dedicated` · `dynamic` | **yes** |  |
| `status` | `requested` · `active` · `blocked` · `expired` · `consumed` · `closed` · `failed` | **yes** |  |
| `account_number` | string or null | **yes** | pattern `^[0-9]{10}$` |
| `account_name` | string | **yes** |  |
| `bank_name` | string | **yes** |  |
| `bank_code` | string | **yes** |  |
| `currency` | `NGN` | **yes** |  |
| `customer` | null or string | **yes** |  |
| `payment` | null or string | **yes** |  |
| `expected_amount` | integer or null | **yes** |  |
| `amount_rule` | `exact` · `any` | **yes** |  |
| `single_use` | boolean | **yes** |  |
| `expires_at` | string or null | **yes** |  |
| `closed_at` | string or null | **yes** |  |
| `metadata` | map of string to string | **yes** |  |
| `created_at` | string (date-time) | **yes** |  |

### Transfer

Money sent from your available balance to a bank account.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | **yes** | pattern `^trf_[0-9A-HJKMNP-TV-Z]{26}$` |
| `object` | `transfer` | **yes** |  |
| `livemode` | boolean | **yes** |  |
| `reference` | string | **yes** |  |
| `amount` | integer | **yes** | Minor units (kobo for NGN) |
| `fee` | integer | **yes** | Fees charged to you for this transfer (transfer fee, stamp duty, platform fee) |
| `total_debit` | integer | **yes** | amount + fee, debited from your available balance |
| `currency` | `NGN` | **yes** |  |
| `status` | `pending` · `processing` · `succeeded` · `failed` · `reversed` | **yes** | A transfer whose outcome is unknown stays processing until confirmed — never failed. |
| `beneficiary` | object | **yes** |  |
| `narration` | string | **yes** |  |
| `session_id` | string or null | **yes** |  |
| `failure_reason` | string or null | **yes** |  |
| `metadata` | map of string to string | **yes** |  |
| `created_at` | string (date-time) | **yes** |  |
| `completed_at` | string or null | **yes** |  |

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `beneficiary.bank_code` | string | **yes** |  |
| `beneficiary.bank_name` | string or null | **yes** | Bank name for display (null if the list of banks is unavailable) |
| `beneficiary.account_number` | string | **yes** | pattern `^[0-9]{10}$` |
| `beneficiary.account_name` | string or null | **yes** |  |

### Refund

Money returned for a payment by bank transfer.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | **yes** | pattern `^re_[0-9A-HJKMNP-TV-Z]{26}$` |
| `object` | `refund` | **yes** |  |
| `livemode` | boolean | **yes** |  |
| `payment` | string | **yes** | The original payment being refunded. pattern `^pay_[0-9A-HJKMNP-TV-Z]{26}$` |
| `reference` | string | **yes** |  |
| `amount` | integer | **yes** | Minor units (kobo for NGN) |
| `fee` | integer | **yes** | Transfer costs charged to you for paying this refund out |
| `currency` | `NGN` | **yes** |  |
| `reason` | string | **yes** |  |
| `status` | `pending` · `processing` · `succeeded` · `failed` | **yes** | When a refund succeeds, the payment becomes partially_refunded or refunded. |
| `destination` | object | **yes** |  |
| `transfer` | null or object | **yes** |  |
| `failure_reason` | string or null | **yes** |  |
| `metadata` | map of string to string | **yes** |  |
| `created_at` | string (date-time) | **yes** |  |
| `completed_at` | string or null | **yes** |  |

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `destination.bank_code` | string | **yes** |  |
| `destination.bank_name` | string or null | **yes** | Bank name for display (null if the list of banks is unavailable) |
| `destination.account_number_last4` | string | **yes** | pattern `^[0-9]{4}$` |
| `destination.account_name` | string or null | **yes** |  |

### Subaccount

A seller or vendor on your platform with its own balance and payout account.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | **yes** | pattern `^sub_[0-9A-HJKMNP-TV-Z]{26}$` |
| `object` | `subaccount` | **yes** |  |
| `livemode` | boolean | **yes** |  |
| `name` | string | **yes** |  |
| `email` | string or null | **yes** |  |
| `status` | `active` · `inactive` | **yes** |  |
| `settlement_account` | null or object | **yes** |  |
| `metadata` | map of string to string | **yes** |  |
| `created_at` | string (date-time) | **yes** |  |

### SubaccountBalance

A subaccount’s balances, in kobo.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `object` | `subaccount_balance` | **yes** |  |
| `subaccount` | string | **yes** | pattern `^sub_[0-9A-HJKMNP-TV-Z]{26}$` |
| `livemode` | boolean | **yes** |  |
| `currency` | `NGN` | **yes** |  |
| `pending` | integer | **yes** | Minor units (kobo for NGN) |
| `available` | integer | **yes** | Minor units (kobo for NGN) |
| `settling` | integer | **yes** | Minor units (kobo for NGN) |
| `total` | integer | **yes** | Minor units (kobo for NGN) |
| `settled_total` | integer | **yes** | Minor units (kobo for NGN) |

### SplitRule

How a payment’s net amount is shared with subaccounts.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | **yes** | pattern `^spl_[0-9A-HJKMNP-TV-Z]{26}$` |
| `object` | `split_rule` | **yes** |  |
| `livemode` | boolean | **yes** |  |
| `name` | string | **yes** |  |
| `type` | `percentage` · `flat` | **yes** | percentage: share in basis points of the net amount; flat: share in kobo (capped at the net amount) |
| `active` | boolean | **yes** |  |
| `allocations` | array of object | **yes** |  |
| `metadata` | map of string to string | **yes** |  |
| `created_at` | string (date-time) | **yes** |  |

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `allocations[].subaccount` | string | **yes** | pattern `^sub_[0-9A-HJKMNP-TV-Z]{26}$` |
| `allocations[].share` | integer | **yes** |  |

### CheckoutSession

A hosted payment page for one payment.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | **yes** | pattern `^cs_[0-9A-HJKMNP-TV-Z]{26}$` |
| `object` | `checkout_session` | **yes** |  |
| `livemode` | boolean | **yes** |  |
| `status` | `open` · `complete` · `expired` | **yes** |  |
| `url` | string (uri) | **yes** | Hosted page to redirect your customer to |
| `token` | string | no | Session token for the browser SDK (`pletopay.checkout({ session: token })`); it is also the last segment of `url`. Pass it to your front end; never the secret key.. pattern `^[A-Za-z0-9_-]{8,64}$` |
| `amount` | integer | **yes** | Minor units (kobo for NGN) |
| `currency` | `NGN` | **yes** |  |
| `reference` | string or null | **yes** |  |
| `description` | string or null | **yes** |  |
| `customer` | null or string | **yes** |  |
| `customer_email` | string or null | **yes** |  |
| `payment` | null or string | **yes** | Created when the customer opens the page |
| `payment_link` | null or string | **yes** |  |
| `invoice` | null or string | **yes** |  |
| `split` | null or string | **yes** |  |
| `payment_method_types` | array of `bank_transfer` | **yes** |  |
| `success_url` | string or null | **yes** |  |
| `cancel_url` | string or null | **yes** |  |
| `metadata` | map of string to string | **yes** |  |
| `expires_at` | string (date-time) | **yes** |  |
| `completed_at` | string or null | **yes** |  |
| `created_at` | string (date-time) | **yes** |  |

### PaymentLink

A reusable hosted payment page.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | **yes** | pattern `^plink_[0-9A-HJKMNP-TV-Z]{26}$` |
| `object` | `payment_link` | **yes** |  |
| `livemode` | boolean | **yes** |  |
| `active` | boolean | **yes** |  |
| `url` | string (uri) | **yes** |  |
| `name` | string | **yes** |  |
| `description` | string or null | **yes** |  |
| `amount` | integer or null | **yes** | Fixed amount; null when the customer chooses |
| `min_amount` | integer or null | **yes** |  |
| `max_amount` | integer or null | **yes** |  |
| `currency` | `NGN` | **yes** |  |
| `max_uses` | integer or null | **yes** |  |
| `uses` | integer | **yes** | Completed payments |
| `split` | null or string | **yes** |  |
| `success_url` | string or null | **yes** |  |
| `cancel_url` | string or null | **yes** |  |
| `expires_at` | string or null | **yes** |  |
| `metadata` | map of string to string | **yes** |  |
| `created_at` | string (date-time) | **yes** |  |

### InvoiceItem

One line of an invoice.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `description` | string | **yes** |  |
| `quantity` | integer | **yes** | min 1 |
| `unit_amount` | integer | **yes** | Minor units (kobo for NGN) |
| `amount` | integer | **yes** | Minor units (kobo for NGN) |

### InvoiceTax

A tax applied to an invoice subtotal.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | **yes** |  |
| `bps` | integer | **yes** | Rate in basis points (750 = 7.5%) |
| `amount` | integer | **yes** | Minor units (kobo for NGN) |

### Invoice

An itemised bill with a hosted payment page.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | **yes** | pattern `^inv_[0-9A-HJKMNP-TV-Z]{26}$` |
| `object` | `invoice` | **yes** |  |
| `livemode` | boolean | **yes** |  |
| `number` | string or null | **yes** | Assigned at finalization, e.g. INV-000042 |
| `status` | `draft` · `open` · `paid` · `void` · `uncollectible` | **yes** |  |
| `customer` | string | **yes** | pattern `^cus_[0-9A-HJKMNP-TV-Z]{26}$` |
| `currency` | `NGN` | **yes** |  |
| `items` | array of [InvoiceItem](#invoiceitem) | **yes** |  |
| `taxes` | array of [InvoiceTax](#invoicetax) | **yes** |  |
| `subtotal` | integer | **yes** | Minor units (kobo for NGN) |
| `tax_amount` | integer | **yes** | Minor units (kobo for NGN) |
| `total` | integer | **yes** | Minor units (kobo for NGN) |
| `amount_paid` | integer | **yes** | Minor units (kobo for NGN) |
| `amount_due` | integer | **yes** | Minor units (kobo for NGN) |
| `memo` | string or null | **yes** |  |
| `due_date` | string (date-time) | **yes** |  |
| `hosted_invoice_url` | string or null | **yes** | Customer payment page (after finalization) |
| `payment` | null or string | **yes** |  |
| `split` | null or string | **yes** |  |
| `subscription` | null or string | **yes** | Set when issued by a subscription |
| `period_start` | string or null | **yes** |  |
| `period_end` | string or null | **yes** |  |
| `metadata` | map of string to string | **yes** |  |
| `finalized_at` | string or null | **yes** |  |
| `paid_at` | string or null | **yes** |  |
| `voided_at` | string or null | **yes** |  |
| `created_at` | string (date-time) | **yes** |  |

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `items[].description` | string | **yes** |  |
| `items[].quantity` | integer | **yes** | min 1 |
| `items[].unit_amount` | integer | **yes** | Minor units (kobo for NGN) |
| `items[].amount` | integer | **yes** | Minor units (kobo for NGN) |

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `taxes[].name` | string | **yes** |  |
| `taxes[].bps` | integer | **yes** | Rate in basis points (750 = 7.5%) |
| `taxes[].amount` | integer | **yes** | Minor units (kobo for NGN) |

### RiskEvent

Activity your risk rules blocked or flagged.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | **yes** | pattern `^rsk_[0-9A-HJKMNP-TV-Z]{26}$` |
| `object` | `risk_event` | **yes** |  |
| `livemode` | boolean | **yes** |  |
| `type` | `amount_limit` · `daily_amount_limit` · `daily_count_limit` · `frequency_limit` · `high_value_payment` · `customer_velocity` · `blocked_customer` · `restricted_merchant` · `payout_account_changed` · `manual_flag` | **yes** |  |
| `severity` | `low` · `medium` · `high` | **yes** |  |
| `action` | `allowed` · `flagged` · `blocked` | **yes** | blocked: the request was refused; flagged: allowed, queued for review |
| `rule` | string or null | **yes** |  |
| `subject` | object | **yes** |  |
| `amount` | integer or null | **yes** |  |
| `score` | integer or null | **yes** | Transaction risk score 0–100 (placeholder model) |
| `reasons` | array of string | **yes** |  |
| `review_status` | `open` · `cleared` · `confirmed` | **yes** |  |
| `review_note` | string or null | **yes** |  |
| `reviewed_at` | string or null | **yes** |  |
| `created_at` | string (date-time) | **yes** |  |

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `subject.type` | string | **yes** |  |
| `subject.id` | string or null | **yes** |  |

### RiskLimits

Your effective risk limits in kobo; 0 means no limit.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `object` | `risk_limits` | **yes** |  |
| `livemode` | boolean | **yes** |  |
| `max_transfer_amount` | integer | **yes** | Largest single transfer or refund (kobo); 0 = no limit |
| `daily_outbound_amount` | integer | **yes** |  |
| `daily_outbound_count` | integer | **yes** |  |
| `outbound_per_minute` | integer | **yes** |  |
| `high_value_payment` | integer | **yes** | Received payments at or above this are flagged (never refused) |
| `customer_payments_per_hour` | integer | **yes** |  |

### Plan

A recurring price for subscriptions.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | **yes** | pattern `^plan_[0-9A-HJKMNP-TV-Z]{26}$` |
| `object` | `plan` | **yes** |  |
| `livemode` | boolean | **yes** |  |
| `name` | string | **yes** |  |
| `description` | string or null | **yes** |  |
| `amount` | integer | **yes** | Minor units (kobo for NGN) |
| `currency` | `NGN` | **yes** |  |
| `interval` | `day` · `week` · `month` · `year` | **yes** |  |
| `interval_count` | integer | **yes** | min 1 |
| `active` | boolean | **yes** |  |
| `metadata` | map of string to string | **yes** |  |
| `created_at` | string (date-time) | **yes** |  |

### Subscription

A customer’s subscription to a plan, billed by invoice each period.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | **yes** | pattern `^sbs_[0-9A-HJKMNP-TV-Z]{26}$` |
| `object` | `subscription` | **yes** |  |
| `livemode` | boolean | **yes** |  |
| `status` | `active` · `past_due` · `canceled` | **yes** |  |
| `customer` | string | **yes** | pattern `^cus_[0-9A-HJKMNP-TV-Z]{26}$` |
| `plan` | string | **yes** | pattern `^plan_[0-9A-HJKMNP-TV-Z]{26}$` |
| `collection_method` | `invoice` · `dedicated_account` | **yes** | Neither is an automatic debit. |
| `dedicated_account` | null or object | **yes** |  |
| `days_until_due` | integer | **yes** |  |
| `current_period_start` | string (date-time) | **yes** |  |
| `current_period_end` | string (date-time) | **yes** |  |
| `next_invoice_at` | string or null | **yes** |  |
| `latest_invoice` | null or string | **yes** |  |
| `cancel_at_period_end` | boolean | **yes** |  |
| `canceled_at` | string or null | **yes** |  |
| `cancel_reason` | string or null | **yes** |  |
| `metadata` | map of string to string | **yes** |  |
| `created_at` | string (date-time) | **yes** |  |

### Report

A CSV export generated in the background.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | **yes** | pattern `^rpt_[0-9A-HJKMNP-TV-Z]{26}$` |
| `object` | `report` | **yes** |  |
| `livemode` | boolean | **yes** |  |
| `type` | `payments` · `transfers` · `refunds` · `settlements` · `balance_statement` · `customers` · `invoices` · `subscriptions` | **yes** |  |
| `status` | `pending` · `running` · `succeeded` · `failed` | **yes** |  |
| `period_start` | string (date-time) | **yes** |  |
| `period_end` | string (date-time) | **yes** |  |
| `format` | `csv` | **yes** |  |
| `row_count` | integer or null | **yes** |  |
| `size_bytes` | integer or null | **yes** |  |
| `sha256` | string or null | **yes** |  |
| `download_url` | string or null | **yes** |  |
| `error` | string or null | **yes** |  |
| `expires_at` | string or null | **yes** |  |
| `created_at` | string (date-time) | **yes** |  |
| `completed_at` | string or null | **yes** |  |

### Statement

Opening, credits, debits and closing per balance over a period.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `object` | `statement` | **yes** |  |
| `livemode` | boolean | **yes** |  |
| `currency` | `NGN` | **yes** |  |
| `period_start` | string (date-time) | **yes** |  |
| `period_end` | string (date-time) | **yes** |  |
| `balances` | array of object | **yes** |  |

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `balances[].balance` | `available` · `pending` · `held` · `unapplied` · `settling` | **yes** |  |
| `balances[].opening` | integer | **yes** |  |
| `balances[].credits` | integer | **yes** |  |
| `balances[].debits` | integer | **yes** |  |
| `balances[].closing` | integer | **yes** |  |

### AccountResolution

The result of a name enquiry.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `object` | `account_resolution` | **yes** |  |
| `bank_code` | string | **yes** |  |
| `account_number` | string | **yes** |  |
| `account_name` | string | **yes** |  |

### Bank

A bank you can send transfers to.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `object` | `bank` | **yes** |  |
| `code` | string | **yes** |  |
| `name` | string | **yes** |  |

### Balance

Your balances in kobo, computed from the ledger.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `object` | `balance` | **yes** |  |
| `livemode` | boolean | **yes** |  |
| `currency` | `NGN` | **yes** |  |
| `available` | integer | **yes** | Minor units (kobo for NGN) |
| `pending` | integer | **yes** | Minor units (kobo for NGN) |
| `held` | integer | **yes** | Minor units (kobo for NGN) |
| `unapplied` | integer | **yes** | Minor units (kobo for NGN) |
| `settling` | integer | **yes** | Minor units (kobo for NGN) |
| `total` | integer | **yes** | Minor units (kobo for NGN) |
| `settled_total` | integer | **yes** | Lifetime amount paid out by completed settlements |

### LedgerTransaction

A ledger journal and its signed effect on your balances.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | **yes** | pattern `^jrn_[0-9A-HJKMNP-TV-Z]{26}$` |
| `object` | `ledger_transaction` | **yes** |  |
| `livemode` | boolean | **yes** |  |
| `type` | string | **yes** |  |
| `description` | string | **yes** |  |
| `currency` | `NGN` | **yes** |  |
| `net_amount` | integer | **yes** | Signed net effect on your balances (minor units) |
| `balance_changes` | map of string to integer | **yes** | Signed change per balance: available, pending, held, unapplied, settling |
| `source` | null or object | **yes** |  |
| `created_at` | string (date-time) | **yes** |  |

### WebhookEndpoint

A URL that receives signed events.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | **yes** | pattern `^we_[0-9A-HJKMNP-TV-Z]{26}$` |
| `object` | `webhook_endpoint` | **yes** |  |
| `livemode` | boolean | **yes** |  |
| `url` | string (uri) | **yes** |  |
| `description` | string or null | **yes** |  |
| `enabled_events` | array of string | **yes** |  |
| `status` | `enabled` · `disabled` · `auto_disabled` | **yes** |  |
| `secret` | string | no | Signing secret. Returned only on create and rotate.. pattern `^whsec_` |
| `health` | object | **yes** |  |
| `stats` | null or object | no |  |
| `created_at` | string (date-time) | **yes** |  |

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `health.consecutive_failures` | integer | **yes** |  |
| `health.last_success_at` | string or null | **yes** |  |
| `health.last_failure_at` | string or null | **yes** |  |
| `health.disabled_at` | string or null | **yes** |  |

### DeletedObject

Confirmation that an object was deleted.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | **yes** |  |
| `object` | string | **yes** |  |
| `deleted` | `true` | **yes** |  |

### WebhookTest

The data of a `webhook.test` event.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `object` | `webhook_test` | **yes** |  |
| `endpoint` | string | **yes** | pattern `^we_[0-9A-HJKMNP-TV-Z]{26}$` |
| `message` | string | **yes** |  |

### Event

Something that happened in your account. The same object is delivered to your webhook endpoints.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | **yes** | pattern `^evt_[0-9A-HJKMNP-TV-Z]{26}$` |
| `object` | `event` | **yes** |  |
| `type` | string | **yes** |  |
| `api_version` | string | **yes** |  |
| `livemode` | boolean | **yes** |  |
| `created_at` | string (date-time) | **yes** |  |
| `data` | object | **yes** |  |

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `data.object` | object | **yes** | The resource (payment, virtual_account, transfer) at the time of the event |

### WebhookDelivery

One delivery of an event to an endpoint, with its retry state.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | **yes** | pattern `^whd_[0-9A-HJKMNP-TV-Z]{26}$` |
| `object` | `webhook_delivery` | **yes** |  |
| `livemode` | boolean | **yes** |  |
| `event` | string | **yes** | pattern `^evt_[0-9A-HJKMNP-TV-Z]{26}$` |
| `endpoint` | string | **yes** | pattern `^we_[0-9A-HJKMNP-TV-Z]{26}$` |
| `status` | `pending` · `succeeded` · `failed` · `dead` | **yes** |  |
| `attempts` | integer | **yes** |  |
| `response_status` | integer or null | **yes** |  |
| `error` | string or null | **yes** |  |
| `duration_ms` | integer or null | **yes** |  |
| `last_attempt_at` | string or null | **yes** |  |
| `next_attempt_at` | string or null | **yes** |  |
| `replay_of` | null or string | **yes** |  |
| `created_at` | string (date-time) | **yes** |  |

### SimulatedTransfer

Acknowledgement that a simulated transfer was accepted.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `object` | `simulated_transfer` | **yes** |  |
| `status` | `accepted` | **yes** |  |
| `account_number` | string | **yes** |  |
| `amount` | integer | **yes** | Minor units (kobo for NGN) |

### Settlement

A payout of available balance to a settlement account.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | **yes** | pattern `^stl_[0-9A-HJKMNP-TV-Z]{26}$` |
| `object` | `settlement` | **yes** |  |
| `livemode` | boolean | **yes** |  |
| `subaccount` | string or null | **yes** | The subaccount paid by this settlement (sub_…), or null for your own balance |
| `status` | `pending` · `processing` · `completed` · `failed` | **yes** |  |
| `trigger` | `scheduled` · `manual` | **yes** |  |
| `amount` | integer | **yes** | Sent to your settlement account |
| `fee` | integer | **yes** | Platform settlement fee |
| `transfer_fee` | integer | **yes** | Transfer fee (when passed through) |
| `transfer_fee_vat` | integer | **yes** | 7.5% VAT on the transfer fee (when passed through) |
| `stamp_duty` | integer | **yes** | Minor units (kobo for NGN) |
| `total_deducted` | integer | **yes** | Taken from your available balance: amount + fees |
| `reserve_retained` | integer | **yes** | Kept available by your reserve setting |
| `currency` | `NGN` | **yes** |  |
| `settlement_account` | object | **yes** |  |
| `transfer` | null or object | **yes** |  |
| `failure_reason` | string or null | **yes** |  |
| `cutoff_at` | string (date-time) | **yes** |  |
| `created_at` | string (date-time) | **yes** |  |
| `completed_at` | string or null | **yes** |  |

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `settlement_account.id` | string | **yes** | pattern `^sta_[0-9A-HJKMNP-TV-Z]{26}$` |
| `settlement_account.bank_code` | string | **yes** |  |
| `settlement_account.bank_name` | string or null | **yes** | Bank name for display (null if the list of banks is unavailable) |
| `settlement_account.account_number_last4` | string | **yes** | pattern `^[0-9]{4}$` |
| `settlement_account.account_name` | string | **yes** |  |

### SettlementItem

A ledger movement a settlement accounts for.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `object` | `settlement_item` | **yes** |  |
| `ledger_transaction` | string | **yes** | Ledger transaction id (jrn_…) |
| `type` | string | **yes** |  |
| `source` | null or object | **yes** |  |
| `available_delta` | integer | **yes** | Signed change to your available balance |
| `posted_at` | string (date-time) | **yes** |  |

### ListMeta

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `has_more` | boolean | **yes** | More results exist after this page |
| `next_cursor` | string or null | **yes** | Pass as `starting_after` to fetch the next page (null on the last page) |
| `url` | string | **yes** |  |

## Webhook events

Each event is `{ id, object: "event", type, api_version, livemode, created_at, data: { object } }` where `data.object` is the resource below. Verify with `constructEvent` and narrow on `type`.

| Event type | `data.object` | When |
| --- | --- | --- |
| `payment.created` | [Payment](#payment) | A payment was created. Its account details may still be pending. |
| `payment.pending` | [Payment](#payment) | The payment’s virtual account is ready: the customer can now transfer. |
| `payment.succeeded` | [Payment](#payment) | The customer’s transfer was confirmed. Fulfil the order (once, keyed by your reference). |
| `payment.failed` | [Payment](#payment) | The payment can no longer be paid: for example its virtual account could not be created, or it failed review. |
| `payment.expired` | [Payment](#payment) | The payment expired before any money arrived. |
| `payment.under_review` | [Payment](#payment) | Money arrived but needs review (the wrong amount, or it arrived after the payment expired). It is held in your unapplied balance until reviewed; it is never silently accepted or dropped. |
| `payment.reversed` | [Payment](#payment) | A succeeded payment was reversed. |
| `payment.partially_refunded` | [Payment](#payment) | A refund of part of the payment was paid out. |
| `payment.refunded` | [Payment](#payment) | The payment was refunded in full. |
| `virtual_account.created` | [VirtualAccount](#virtualaccount) | A virtual account became active. |
| `virtual_account.updated` | [VirtualAccount](#virtualaccount) | A virtual account changed status. |
| `virtual_account.closed` | [VirtualAccount](#virtualaccount) | A virtual account was closed. |
| `transfer.created` | [Transfer](#transfer) | A transfer was created and its funds reserved. |
| `transfer.processing` | [Transfer](#transfer) | A transfer was sent for processing; the outcome is not yet known. |
| `transfer.succeeded` | [Transfer](#transfer) | The transfer was confirmed as received by the beneficiary. |
| `transfer.failed` | [Transfer](#transfer) | The transfer was confirmed as failed. The reserved funds were released. |
| `transfer.reversed` | [Transfer](#transfer) | A succeeded transfer was reversed. |
| `settlement.created` | [Settlement](#settlement) | A settlement of your available balance was opened. |
| `settlement.completed` | [Settlement](#settlement) | A settlement was paid into your settlement account. |
| `settlement.failed` | [Settlement](#settlement) | A settlement payout failed. The funds were returned to your available balance. |
| `refund.created` | [Refund](#refund) | A refund was created and its funds reserved. |
| `refund.succeeded` | [Refund](#refund) | A refund was paid out to the customer. |
| `refund.failed` | [Refund](#refund) | A refund payout failed. The funds were released. |
| `checkout.session.completed` | [CheckoutSession](#checkoutsession) | The checkout session’s payment succeeded. |
| `checkout.session.expired` | [CheckoutSession](#checkoutsession) | The checkout session expired unpaid, or you expired it. |
| `invoice.created` | [Invoice](#invoice) | A draft invoice was created. |
| `invoice.finalized` | [Invoice](#invoice) | An invoice was finalized and can now be paid. |
| `invoice.paid` | [Invoice](#invoice) | An invoice was paid in full. |
| `invoice.voided` | [Invoice](#invoice) | An invoice was voided. |
| `invoice.marked_uncollectible` | [Invoice](#invoice) | An invoice was marked uncollectible. |
| `subscription.created` | [Subscription](#subscription) | A customer subscribed to a plan. |
| `subscription.updated` | [Subscription](#subscription) | A subscription changed status or its cancellation settings. |
| `subscription.past_due` | [Subscription](#subscription) | A subscription’s invoice passed its due date unpaid. |
| `subscription.canceled` | [Subscription](#subscription) | A subscription was canceled. |
| `report.ready` | [Report](#report) | A report finished and can be downloaded. |
| `report.failed` | [Report](#report) | A report could not be generated. |
| `risk.event_flagged` | [RiskEvent](#riskevent) | Activity was flagged or blocked by your risk rules. |
| `webhook.test` | [WebhookTest](#webhooktest) | A test event you sent with the test endpoint. |
