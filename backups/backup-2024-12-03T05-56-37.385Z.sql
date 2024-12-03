--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6 (Ubuntu 16.6-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.6 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: husain
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO husain;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: husain
--

COMMENT ON SCHEMA public IS '';


--
-- Name: AccountType; Type: TYPE; Schema: public; Owner: husain
--

CREATE TYPE public."AccountType" AS ENUM (
    'ASSET',
    'LIABILITY',
    'EQUITY',
    'REVENUE',
    'EXPENSE'
);


ALTER TYPE public."AccountType" OWNER TO husain;

--
-- Name: PaymentMode; Type: TYPE; Schema: public; Owner: husain
--

CREATE TYPE public."PaymentMode" AS ENUM (
    'CASH',
    'ACCOUNTS_RECEIVABLE'
);


ALTER TYPE public."PaymentMode" OWNER TO husain;

--
-- Name: TaxType; Type: TYPE; Schema: public; Owner: husain
--

CREATE TYPE public."TaxType" AS ENUM (
    'VAT',
    'ZERO_RATE',
    'EXEMPT'
);


ALTER TYPE public."TaxType" OWNER TO husain;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "hierarchyCode" text NOT NULL,
    name text NOT NULL,
    "accountType" public."AccountType" NOT NULL,
    "openingBalance" double precision DEFAULT 0.0,
    "currentBalance" double precision DEFAULT 0.0 NOT NULL,
    "parentAccountId" text,
    "mainAccount" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Account" OWNER TO husain;

--
-- Name: Asset; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."Asset" (
    id text NOT NULL,
    name text NOT NULL,
    value double precision NOT NULL,
    "heldForSale" boolean DEFAULT false NOT NULL,
    "fairValue" double precision,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Asset" OWNER TO husain;

--
-- Name: Contract; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."Contract" (
    id text NOT NULL,
    "customerId" text NOT NULL,
    "totalValue" double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Contract" OWNER TO husain;

--
-- Name: Customer; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."Customer" (
    id text NOT NULL,
    name text NOT NULL,
    email text,
    phone text,
    address text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Customer" OWNER TO husain;

--
-- Name: GeneralLedger; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."GeneralLedger" (
    id text NOT NULL,
    "accountId" text NOT NULL,
    balance double precision NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."GeneralLedger" OWNER TO husain;

--
-- Name: Invoice; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."Invoice" (
    id text NOT NULL,
    "invoiceNumber" text NOT NULL,
    "customerId" text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    total double precision NOT NULL,
    "taxType" public."TaxType" DEFAULT 'VAT'::public."TaxType" NOT NULL,
    "taxAmount" double precision NOT NULL,
    "grandTotal" double precision NOT NULL,
    "paymentMode" public."PaymentMode" DEFAULT 'CASH'::public."PaymentMode" NOT NULL,
    "vendorName" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Invoice" OWNER TO husain;

--
-- Name: JournalEntry; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."JournalEntry" (
    id text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."JournalEntry" OWNER TO husain;

--
-- Name: Lease; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."Lease" (
    id text NOT NULL,
    "accountId" text NOT NULL,
    "leaseLiability" double precision NOT NULL,
    "rouAsset" double precision NOT NULL,
    "leaseTerm" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Lease" OWNER TO husain;

--
-- Name: Obligation; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."Obligation" (
    id text NOT NULL,
    "contractId" text NOT NULL,
    description text NOT NULL,
    "revenueValue" double precision NOT NULL,
    fulfilled boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Obligation" OWNER TO husain;

--
-- Name: Salary; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."Salary" (
    id text NOT NULL,
    "employeeId" text NOT NULL,
    amount double precision NOT NULL,
    benefit double precision NOT NULL,
    "paymentDate" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Salary" OWNER TO husain;

--
-- Name: Transaction; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."Transaction" (
    id text NOT NULL,
    "accountId" text NOT NULL,
    "journalEntryId" text NOT NULL,
    debit double precision,
    credit double precision,
    currency text DEFAULT 'JOD'::text NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Transaction" OWNER TO husain;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO husain;

--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Account" (id, "hierarchyCode", name, "accountType", "openingBalance", "currentBalance", "parentAccountId", "mainAccount", "createdAt", "updatedAt") FROM stdin;
b1c9ebef-e807-4a8f-ae90-008091cd031b	5.2	Non-Operating Expenses	EXPENSE	0	0	5cd72881-deb4-44a1-a18c-9d8dd8e83af6	f	2024-12-02 11:27:39.041	2024-12-03 05:52:22.7
13f2e2b8-27db-4d48-96f4-d53f93cc739e	2.1	Current Liabilities	LIABILITY	0	0	c777bb16-927b-4c31-a65e-17a93e09753b	t	2024-12-02 11:27:38.964	2024-12-03 05:52:22.98
c777bb16-927b-4c31-a65e-17a93e09753b	2	Liabilities	LIABILITY	0	0	\N	t	2024-12-02 11:27:38.853	2024-12-03 05:52:22.995
930ad4a5-823c-41a1-aef8-8a75797dac07	1.2.2	Buildings	ASSET	0	0	021102ea-6523-4445-8728-7d50e1784cb3	f	2024-12-02 11:27:38.956	2024-12-03 05:52:23.015
3bb99c02-71ab-4daa-acf5-7d66f911c973	5.1	Operating Expenses	EXPENSE	0	0	5cd72881-deb4-44a1-a18c-9d8dd8e83af6	f	2024-12-02 11:27:39.033	2024-12-03 05:52:22.729
5cd72881-deb4-44a1-a18c-9d8dd8e83af6	5	Expenses	EXPENSE	0	0	\N	t	2024-12-02 11:27:38.867	2024-12-03 05:52:22.746
fcc3b5dd-9c52-4dfb-bd5a-35b8cb46922e	1.2.1	Land	ASSET	0	0	021102ea-6523-4445-8728-7d50e1784cb3	f	2024-12-02 11:27:38.948	2024-12-03 05:52:23.028
021102ea-6523-4445-8728-7d50e1784cb3	1.2	Fixed Assets	ASSET	0	0	9316d63b-76dc-40bc-a6de-a28b90308123	t	2024-12-02 11:27:38.892	2024-12-03 05:52:23.042
c80f4f00-2525-4813-9fdc-afbad389b205	1.1.4	Stock	ASSET	0	0	331996d8-2548-41f8-bd89-f41b03033fba	f	2024-12-02 11:27:38.94	2024-12-03 05:52:23.056
a3b5b568-5597-4bd8-a7f4-3e71ce11e0a2	1.1.3.2	Client B	ASSET	0	0	0b3cd377-f1b6-4dfd-8d00-ccdbbde7bb83	f	2024-12-02 11:27:39.055	2024-12-03 05:52:23.073
3c995bfe-4cdc-485f-9192-54b70fdd6eb6	1.1.3.1	Client A	ASSET	0	-133	0b3cd377-f1b6-4dfd-8d00-ccdbbde7bb83	f	2024-12-02 11:27:39.048	2024-12-03 05:52:23.089
0b3cd377-f1b6-4dfd-8d00-ccdbbde7bb83	1.1.3	Accounts Receivable	ASSET	0	-133	331996d8-2548-41f8-bd89-f41b03033fba	f	2024-12-02 11:27:38.924	2024-12-03 05:52:23.106
05cf6846-9ed8-4a9d-8d7c-aac06a93f876	4.2	Service Revenue	REVENUE	0	0	6758fee7-221e-4487-aeed-528785bad7db	f	2024-12-02 11:27:39.027	2024-12-03 05:52:22.769
5ae134ea-67c9-4dd8-a3af-61cf3b9f60cc	4.1	Sales Revenue	REVENUE	0	0	6758fee7-221e-4487-aeed-528785bad7db	f	2024-12-02 11:27:39.019	2024-12-03 05:52:22.787
6758fee7-221e-4487-aeed-528785bad7db	4	Revenue	REVENUE	0	0	\N	t	2024-12-02 11:27:38.863	2024-12-03 05:52:22.806
91c78c5e-baa7-4c58-a02b-f099318a3403	3.2	Capital Stock	EQUITY	0	-5000	944343c4-c38c-4dcf-9cd8-e85546fe960d	t	2024-12-02 11:27:39.012	2024-12-03 05:52:22.825
14fea974-1024-4f9d-9415-a267a73f8a50	3.1	Retained Earnings	EQUITY	0	0	944343c4-c38c-4dcf-9cd8-e85546fe960d	t	2024-12-02 11:27:39.005	2024-12-03 05:52:22.842
944343c4-c38c-4dcf-9cd8-e85546fe960d	3	Equity	EQUITY	0	-5000	\N	t	2024-12-02 11:27:38.858	2024-12-03 05:52:22.86
dca0b753-cdfd-4d15-9644-49da65329f2d	2.2.1	Loans Payable	LIABILITY	0	0	4224d1de-259f-4dba-aef0-da842730d215	f	2024-12-02 11:27:38.998	2024-12-03 05:52:22.878
4224d1de-259f-4dba-aef0-da842730d215	2.2	Long-Term Liabilities	LIABILITY	0	0	c777bb16-927b-4c31-a65e-17a93e09753b	t	2024-12-02 11:27:38.976	2024-12-03 05:52:22.895
36c82353-8adc-4a9d-b3bb-0e4ba4489aa8	2.1.2	Sales Tax Payable	LIABILITY	0	0	13f2e2b8-27db-4d48-96f4-d53f93cc739e	f	2024-12-02 11:27:38.992	2024-12-03 05:52:22.912
ac0cd3ba-e6ee-44b0-92d3-703991b2a7c4	2.1.1.2	Supplier B	LIABILITY	0	0	566203b9-1c00-446f-af15-db13b777cb14	f	2024-12-02 11:27:39.07	2024-12-03 05:52:22.933
b2ccc235-16dc-4c90-a130-9dd3826c1be7	1.1.2	Bank Accounts	ASSET	0	0	331996d8-2548-41f8-bd89-f41b03033fba	f	2024-12-02 11:27:38.909	2024-12-03 05:52:23.12
6c47d61b-da8a-46fc-9173-228629aefa2b	1.1.1	Cash	ASSET	0	5133	331996d8-2548-41f8-bd89-f41b03033fba	f	2024-12-02 11:27:38.9	2024-12-03 05:52:23.136
331996d8-2548-41f8-bd89-f41b03033fba	1.1	Current Assets	ASSET	0	5000	9316d63b-76dc-40bc-a6de-a28b90308123	t	2024-12-02 11:27:38.881	2024-12-03 05:52:23.152
4d904eb0-da5a-4993-b017-c1c8c1854f70	2.1.1.1	Supplier A	LIABILITY	0	0	566203b9-1c00-446f-af15-db13b777cb14	f	2024-12-02 11:27:39.063	2024-12-03 05:52:22.949
566203b9-1c00-446f-af15-db13b777cb14	2.1.1	Accounts Payable	LIABILITY	0	0	13f2e2b8-27db-4d48-96f4-d53f93cc739e	f	2024-12-02 11:27:38.983	2024-12-03 05:52:22.966
9316d63b-76dc-40bc-a6de-a28b90308123	1	Assets	ASSET	0	5000	\N	t	2024-12-02 11:27:38.844	2024-12-03 05:52:23.165
\.


--
-- Data for Name: Asset; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Asset" (id, name, value, "heldForSale", "fairValue", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Contract; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Contract" (id, "customerId", "totalValue", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Customer; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Customer" (id, name, email, phone, address, "createdAt") FROM stdin;
\.


--
-- Data for Name: GeneralLedger; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."GeneralLedger" (id, "accountId", balance, "updatedAt") FROM stdin;
\.


--
-- Data for Name: Invoice; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Invoice" (id, "invoiceNumber", "customerId", date, total, "taxType", "taxAmount", "grandTotal", "paymentMode", "vendorName", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: JournalEntry; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."JournalEntry" (id, date, "createdAt", "updatedAt") FROM stdin;
001088e4-29e5-40a8-b165-1f205f181d55	2024-12-02 00:00:00	2024-12-02 11:34:03.743	2024-12-02 11:34:03.743
94f77889-2726-439d-89ca-944a6af9e7a3	2024-12-02 00:00:00	2024-12-02 11:38:34.235	2024-12-02 11:38:34.235
19837e95-ae64-479a-a595-b86b5e3f2ff5	2024-12-02 00:00:00	2024-12-02 11:53:47.224	2024-12-02 11:53:47.224
\.


--
-- Data for Name: Lease; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Lease" (id, "accountId", "leaseLiability", "rouAsset", "leaseTerm", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Obligation; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Obligation" (id, "contractId", description, "revenueValue", fulfilled, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Salary; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Salary" (id, "employeeId", amount, benefit, "paymentDate", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Transaction; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Transaction" (id, "accountId", "journalEntryId", debit, credit, currency, notes, "createdAt") FROM stdin;
de47198b-bc8e-44ad-baa1-252172810a0b	6c47d61b-da8a-46fc-9173-228629aefa2b	001088e4-29e5-40a8-b165-1f205f181d55	11	\N	JOD	\N	2024-12-02 11:34:03.743
8cdd7f3c-3910-4570-916d-8757c8006dcc	3c995bfe-4cdc-485f-9192-54b70fdd6eb6	001088e4-29e5-40a8-b165-1f205f181d55	\N	11	JOD	\N	2024-12-02 11:34:03.743
11f5f491-5b1b-4204-82b6-89be189bde07	6c47d61b-da8a-46fc-9173-228629aefa2b	94f77889-2726-439d-89ca-944a6af9e7a3	5000	\N	JOD	\N	2024-12-02 11:38:34.235
1d92d0bc-6153-47cd-b740-c26cd375d52a	91c78c5e-baa7-4c58-a02b-f099318a3403	94f77889-2726-439d-89ca-944a6af9e7a3	\N	5000	JOD	\N	2024-12-02 11:38:34.235
3296441c-22ba-4ced-97b7-a62dc5952a0a	6c47d61b-da8a-46fc-9173-228629aefa2b	19837e95-ae64-479a-a595-b86b5e3f2ff5	122	\N	JOD	\N	2024-12-02 11:53:47.224
2ff46f4b-500b-4f84-b68c-46dcd62d8a7f	3c995bfe-4cdc-485f-9192-54b70fdd6eb6	19837e95-ae64-479a-a595-b86b5e3f2ff5	\N	122	JOD	\N	2024-12-02 11:53:47.224
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
28b137db-b59d-4d2b-8652-2032db72acb9	ae5cd8d203b08de8d87e54a2b07de397716d0de7df8677ea55e3d9fc3f2cbe96	2024-12-02 10:32:40.776008+00	20241202103240_asd_a	\N	\N	2024-12-02 10:32:40.664412+00	1
81aef5e6-bc77-453a-b93b-2552b8149ad8	7efcec6c807d9293cc754f7060671a1b1cf194d44581823d98b632df48d5eb98	2024-12-02 10:38:45.217452+00	20241202103845_asd_a	\N	\N	2024-12-02 10:38:45.200752+00	1
972de711-a8ee-481e-84d3-5d3955dc61c2	5775e6402f8ccfff3e97f0d7068a9c235d14ff5d7d2b0ca81451937ec82b174f	2024-12-03 05:38:53.206455+00	20241203053853_asd_as	\N	\N	2024-12-03 05:38:53.160544+00	1
fa6337d0-148a-48f0-8a31-5e4f9fd4cf6f	5e3e8c293c19eb584a0ca871132d9e637ee3b6652a73f191c3fda9ea21a6211a	2024-12-03 05:43:24.434843+00	20241203054324_dbr	\N	\N	2024-12-03 05:43:24.395135+00	1
\.


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: Asset Asset_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Asset"
    ADD CONSTRAINT "Asset_pkey" PRIMARY KEY (id);


--
-- Name: Contract Contract_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Contract"
    ADD CONSTRAINT "Contract_pkey" PRIMARY KEY (id);


--
-- Name: Customer Customer_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_pkey" PRIMARY KEY (id);


--
-- Name: GeneralLedger GeneralLedger_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."GeneralLedger"
    ADD CONSTRAINT "GeneralLedger_pkey" PRIMARY KEY (id);


--
-- Name: Invoice Invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_pkey" PRIMARY KEY (id);


--
-- Name: JournalEntry JournalEntry_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."JournalEntry"
    ADD CONSTRAINT "JournalEntry_pkey" PRIMARY KEY (id);


--
-- Name: Lease Lease_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Lease"
    ADD CONSTRAINT "Lease_pkey" PRIMARY KEY (id);


--
-- Name: Obligation Obligation_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Obligation"
    ADD CONSTRAINT "Obligation_pkey" PRIMARY KEY (id);


--
-- Name: Salary Salary_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Salary"
    ADD CONSTRAINT "Salary_pkey" PRIMARY KEY (id);


--
-- Name: Transaction Transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Account_hierarchyCode_key; Type: INDEX; Schema: public; Owner: husain
--

CREATE UNIQUE INDEX "Account_hierarchyCode_key" ON public."Account" USING btree ("hierarchyCode");


--
-- Name: GeneralLedger_accountId_key; Type: INDEX; Schema: public; Owner: husain
--

CREATE UNIQUE INDEX "GeneralLedger_accountId_key" ON public."GeneralLedger" USING btree ("accountId");


--
-- Name: Invoice_invoiceNumber_key; Type: INDEX; Schema: public; Owner: husain
--

CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON public."Invoice" USING btree ("invoiceNumber");


--
-- Name: Account Account_parentAccountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_parentAccountId_fkey" FOREIGN KEY ("parentAccountId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Contract Contract_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Contract"
    ADD CONSTRAINT "Contract_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GeneralLedger GeneralLedger_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."GeneralLedger"
    ADD CONSTRAINT "GeneralLedger_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Invoice Invoice_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Lease Lease_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Lease"
    ADD CONSTRAINT "Lease_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Obligation Obligation_contractId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Obligation"
    ADD CONSTRAINT "Obligation_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES public."Contract"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transaction Transaction_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transaction Transaction_journalEntryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES public."JournalEntry"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: husain
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

