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
-- Name: AccountType; Type: TYPE; Schema: public; Owner: husain
--

CREATE TYPE public."AccountType" AS ENUM (
    'ASSET',
    'LIABILITY',
    'EQUITY',
    'REVENUE',
    'EXPENSE',
    'CONTRA_ASSET'
);


ALTER TYPE public."AccountType" OWNER TO husain;

--
-- Name: MovementType; Type: TYPE; Schema: public; Owner: husain
--

CREATE TYPE public."MovementType" AS ENUM (
    'IN',
    'OUT'
);


ALTER TYPE public."MovementType" OWNER TO husain;

--
-- Name: PaymentMode; Type: TYPE; Schema: public; Owner: husain
--

CREATE TYPE public."PaymentMode" AS ENUM (
    'CASH',
    'ACCOUNTS_RECEIVABLE',
    'CHEQUE'
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

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: husain
--

CREATE TYPE public."UserRole" AS ENUM (
    'USER',
    'ADMIN',
    'SUPERADMIN'
);


ALTER TYPE public."UserRole" OWNER TO husain;

--
-- Name: ValuationMethod; Type: TYPE; Schema: public; Owner: husain
--

CREATE TYPE public."ValuationMethod" AS ENUM (
    'FIFO',
    'WAC'
);


ALTER TYPE public."ValuationMethod" OWNER TO husain;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    name text NOT NULL,
    "accountType" public."AccountType" NOT NULL,
    "openingBalance" double precision DEFAULT 0.0,
    "currentBalance" double precision DEFAULT 0.0 NOT NULL,
    "parentAccountId" text,
    "mainAccount" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "companyId" text NOT NULL,
    "ifrcClassification" text,
    level integer,
    "nameAr" text,
    code text NOT NULL
);


ALTER TABLE public."Account" OWNER TO husain;

--
-- Name: AdditionalDocument; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."AdditionalDocument" (
    id text NOT NULL,
    "referenceId" text NOT NULL,
    "referenceUUID" text NOT NULL,
    "invoiceId" text NOT NULL,
    "companyId" text NOT NULL
);


ALTER TABLE public."AdditionalDocument" OWNER TO husain;

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
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "companyId" text NOT NULL
);


ALTER TABLE public."Asset" OWNER TO husain;

--
-- Name: BankDetails; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."BankDetails" (
    id text NOT NULL,
    "accountId" text NOT NULL,
    "bankName" text NOT NULL,
    "accountNumber" text NOT NULL,
    iban text,
    "swiftCode" text,
    "branchName" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "companyId" text NOT NULL
);


ALTER TABLE public."BankDetails" OWNER TO husain;

--
-- Name: BillingReference; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."BillingReference" (
    id text NOT NULL,
    "invoiceId" text NOT NULL,
    "originalInvoiceId" text NOT NULL,
    "originalUUID" text NOT NULL,
    description text,
    "companyId" text NOT NULL
);


ALTER TABLE public."BillingReference" OWNER TO husain;

--
-- Name: Buyer; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."Buyer" (
    id text NOT NULL,
    identification text NOT NULL,
    "schemeId" text NOT NULL,
    name text NOT NULL,
    "postalCode" text NOT NULL,
    "countryCode" text DEFAULT 'JO'::text NOT NULL,
    phone text,
    "companyId" text NOT NULL
);


ALTER TABLE public."Buyer" OWNER TO husain;

--
-- Name: Cheque; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."Cheque" (
    id text NOT NULL,
    "receiptId" text NOT NULL,
    "chequeNumber" text NOT NULL,
    "bankName" text NOT NULL,
    amount double precision NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "companyId" text NOT NULL
);


ALTER TABLE public."Cheque" OWNER TO husain;

--
-- Name: Company; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."Company" (
    id text NOT NULL,
    name text NOT NULL,
    address text,
    "whatsAppKey" text,
    phone text,
    email text NOT NULL,
    website text,
    "taxNumber" text,
    "logoImage" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "eInvoiceClientId" text,
    "eInvoiceSecretKey" text,
    "legalName" text,
    "eInvoiceLink" text,
    "legalId" text
);


ALTER TABLE public."Company" OWNER TO husain;

--
-- Name: Contract; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."Contract" (
    id text NOT NULL,
    "customerId" text NOT NULL,
    "totalValue" double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "companyId" text NOT NULL
);


ALTER TABLE public."Contract" OWNER TO husain;

--
-- Name: Customer; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."Customer" (
    id text NOT NULL,
    identification text DEFAULT 'Unknown'::text NOT NULL,
    name text NOT NULL,
    "postalCode" text,
    "countryCode" text DEFAULT 'JO'::text NOT NULL,
    phone text,
    email text,
    address text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone,
    "accountId" text NOT NULL,
    "companyId" text NOT NULL
);


ALTER TABLE public."Customer" OWNER TO husain;

--
-- Name: EINV; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."EINV" (
    id text NOT NULL,
    "EINV_RESULTS" text,
    "EINV_STATUS" text,
    "EINV_QR" text,
    "EINV_NUM" text,
    "EINV_INV_UUID" text,
    "invoiceId" text NOT NULL,
    "EINV_SINGED_INVOICE" text,
    "companyId" text NOT NULL
);


ALTER TABLE public."EINV" OWNER TO husain;

--
-- Name: Employee; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."Employee" (
    id text NOT NULL,
    "userId" text,
    "position" text,
    department text,
    "hireDate" timestamp(3) without time zone,
    salary double precision,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    name text,
    "companyId" text NOT NULL
);


ALTER TABLE public."Employee" OWNER TO husain;

--
-- Name: GeneralLedger; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."GeneralLedger" (
    id text NOT NULL,
    "accountId" text NOT NULL,
    balance double precision NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "companyId" text NOT NULL
);


ALTER TABLE public."GeneralLedger" OWNER TO husain;

--
-- Name: InventoryMovement; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."InventoryMovement" (
    id text NOT NULL,
    "productId" text NOT NULL,
    "warehouseId" text,
    "companyId" text NOT NULL,
    type public."MovementType" NOT NULL,
    quantity integer NOT NULL,
    "costPerUnit" double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."InventoryMovement" OWNER TO husain;

--
-- Name: Invoice; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."Invoice" (
    id text NOT NULL,
    uuid text DEFAULT gen_random_uuid() NOT NULL,
    "issueDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "invoiceTypeCode" text DEFAULT '388'::text NOT NULL,
    note text,
    "documentCurrency" text DEFAULT 'JOD'::text NOT NULL,
    "taxCurrency" text DEFAULT 'JOD'::text NOT NULL,
    "companyId" text NOT NULL,
    "customerId" text,
    "taxExclusiveAmount" double precision DEFAULT 0.0 NOT NULL,
    "taxInclusiveAmount" double precision DEFAULT 0.0 NOT NULL,
    "allowanceTotalAmount" double precision,
    "payableAmount" double precision DEFAULT 0.0 NOT NULL,
    "employeeId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone,
    "sellerId" text,
    "buyerId" text,
    "userId" text,
    "isSubmitted" boolean DEFAULT false NOT NULL,
    number integer NOT NULL,
    "InvoiceTypeCodeName" text DEFAULT '011'::text
);


ALTER TABLE public."Invoice" OWNER TO husain;

--
-- Name: InvoiceItem; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."InvoiceItem" (
    id text NOT NULL,
    "invoiceId" text NOT NULL,
    name text NOT NULL,
    quantity double precision NOT NULL,
    "unitPrice" double precision NOT NULL,
    "discountAmount" double precision,
    "lineExtensionAmount" double precision NOT NULL,
    "taxAmount" double precision NOT NULL,
    "roundingAmount" double precision,
    "taxCategory" text NOT NULL,
    "taxPercent" double precision NOT NULL,
    "productId" text,
    "companyId" text NOT NULL
);


ALTER TABLE public."InvoiceItem" OWNER TO husain;

--
-- Name: JournalEntry; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."JournalEntry" (
    id text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "companyId" text NOT NULL
);


ALTER TABLE public."JournalEntry" OWNER TO husain;

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
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "companyId" text NOT NULL
);


ALTER TABLE public."Obligation" OWNER TO husain;

--
-- Name: Product; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."Product" (
    id text NOT NULL,
    barcode text,
    name text NOT NULL,
    description text,
    "costPrice" double precision DEFAULT 0.0 NOT NULL,
    "salesPrice" double precision DEFAULT 0.0 NOT NULL,
    "wholesalePrice" double precision DEFAULT 0.0 NOT NULL,
    "avgPrice" double precision DEFAULT 0.0,
    stock integer DEFAULT 0 NOT NULL,
    "reorderLevel" integer,
    "isActive" boolean DEFAULT true NOT NULL,
    origin text,
    family text,
    "subFamily" text,
    "taxRate" double precision DEFAULT 0.16 NOT NULL,
    "discountRate" double precision DEFAULT 0.0 NOT NULL,
    "profitMargin" double precision,
    location text,
    packaging text,
    "itemType" text,
    "imageUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "companyId" text NOT NULL,
    "valuationMethod" public."ValuationMethod" DEFAULT 'FIFO'::public."ValuationMethod" NOT NULL,
    category text,
    nrv double precision
);


ALTER TABLE public."Product" OWNER TO husain;

--
-- Name: PurchaseInvoice; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."PurchaseInvoice" (
    id text NOT NULL,
    uuid text DEFAULT gen_random_uuid() NOT NULL,
    "issueDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    note text,
    "documentCurrency" text DEFAULT 'JOD'::text NOT NULL,
    "taxCurrency" text DEFAULT 'JOD'::text NOT NULL,
    "companyId" text NOT NULL,
    "supplierId" text NOT NULL,
    "taxExclusiveAmount" double precision DEFAULT 0.0 NOT NULL,
    "taxInclusiveAmount" double precision DEFAULT 0.0 NOT NULL,
    "allowanceTotalAmount" double precision,
    "payableAmount" double precision DEFAULT 0.0 NOT NULL,
    "employeeId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone,
    "isSubmitted" boolean DEFAULT false NOT NULL,
    number integer NOT NULL
);


ALTER TABLE public."PurchaseInvoice" OWNER TO husain;

--
-- Name: PurchaseInvoiceItem; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."PurchaseInvoiceItem" (
    id text NOT NULL,
    "purchaseInvoiceId" text NOT NULL,
    name text NOT NULL,
    quantity double precision NOT NULL,
    "unitPrice" double precision NOT NULL,
    "companyId" text NOT NULL,
    "discountAmount" double precision,
    "lineExtensionAmount" double precision NOT NULL,
    "taxAmount" double precision NOT NULL,
    "taxCategory" text NOT NULL,
    "taxPercent" double precision NOT NULL,
    "productId" text
);


ALTER TABLE public."PurchaseInvoiceItem" OWNER TO husain;

--
-- Name: Receipt; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."Receipt" (
    id text NOT NULL,
    "receiptNumber" integer NOT NULL,
    "accountId" text NOT NULL,
    "customerId" text NOT NULL,
    "accountManagerId" text,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "paymentMode" public."PaymentMode" NOT NULL,
    "TransactionAccountId" text,
    "totalAmount" double precision NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" text,
    "companyId" text NOT NULL
);


ALTER TABLE public."Receipt" OWNER TO husain;

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
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "companyId" text NOT NULL
);


ALTER TABLE public."Salary" OWNER TO husain;

--
-- Name: Seller; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."Seller" (
    id text NOT NULL,
    "companyId" text NOT NULL,
    name text NOT NULL,
    "countryCode" text DEFAULT 'JO'::text NOT NULL
);


ALTER TABLE public."Seller" OWNER TO husain;

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
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "companyId" text NOT NULL
);


ALTER TABLE public."Transaction" OWNER TO husain;

--
-- Name: User; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "phoneNumber" text NOT NULL,
    "userName" text NOT NULL,
    name text NOT NULL,
    "fcmToken" text,
    "profileImage" text DEFAULT 'https://firebasestorage.googleapis.com/v0/b/gixatco.firebasestorage.app/o/settings%2Fshared%2Fdownload.jpeg?alt=media&'::text NOT NULL,
    role public."UserRole" DEFAULT 'USER'::public."UserRole" NOT NULL,
    "companyId" text,
    "position" text,
    department text,
    "hireDate" timestamp(3) without time zone,
    salary double precision,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantId" integer
);


ALTER TABLE public."User" OWNER TO husain;

--
-- Name: UserCompany; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."UserCompany" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "companyId" text NOT NULL,
    "position" text,
    department text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."UserCompany" OWNER TO husain;

--
-- Name: Warehouse; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."Warehouse" (
    id text NOT NULL,
    name text NOT NULL,
    location text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "companyId" text NOT NULL
);


ALTER TABLE public."Warehouse" OWNER TO husain;

--
-- Name: WarehouseStock; Type: TABLE; Schema: public; Owner: husain
--

CREATE TABLE public."WarehouseStock" (
    id text NOT NULL,
    "warehouseId" text NOT NULL,
    "productId" text NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "companyId" text NOT NULL
);


ALTER TABLE public."WarehouseStock" OWNER TO husain;

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

COPY public."Account" (id, name, "accountType", "openingBalance", "currentBalance", "parentAccountId", "mainAccount", "createdAt", "updatedAt", "companyId", "ifrcClassification", level, "nameAr", code) FROM stdin;
01e04536-df38-4b3f-a26b-33f0fb5d3d9d	Assets	ASSET	0	0	\N	t	2024-12-24 12:37:21.738	2024-12-24 12:37:21.738	d6663167-e873-4ab3-87de-6ec72595005d	\N	1	الموجودات	1
667e89b2-e372-4782-b7f2-048ba550b832	Liabilities	LIABILITY	0	0	\N	t	2024-12-24 12:37:21.748	2024-12-24 12:37:21.748	d6663167-e873-4ab3-87de-6ec72595005d	\N	1	المطلوبات	2
5a28760c-97da-4d82-b99c-79d4e9d61072	Equity	EQUITY	0	0	\N	t	2024-12-24 12:37:21.75	2024-12-24 12:37:21.75	d6663167-e873-4ab3-87de-6ec72595005d	\N	1	حقوق الملكية	3
f08f4f0b-787a-4b95-9905-00a420ce970b	Revenue	REVENUE	0	0	\N	t	2024-12-24 12:37:21.753	2024-12-24 12:37:21.753	d6663167-e873-4ab3-87de-6ec72595005d	\N	1	الإيرادات	4
00fd06f4-2df0-414b-8d24-b1bdeb6cfa7c	Expenses	EXPENSE	0	0	\N	t	2024-12-24 12:37:21.755	2024-12-24 12:37:21.755	d6663167-e873-4ab3-87de-6ec72595005d	\N	1	المصروفات	5
dbc78ee1-a405-4861-8565-eccaaebdaae1	Current Assets	ASSET	0	0	01e04536-df38-4b3f-a26b-33f0fb5d3d9d	t	2024-12-24 12:37:21.762	2024-12-24 12:37:21.762	d6663167-e873-4ab3-87de-6ec72595005d	\N	2	موجودات متداولة	1.1
57e1432a-a385-40d4-867f-f2e3587553b0	Non Current Assets	ASSET	0	0	01e04536-df38-4b3f-a26b-33f0fb5d3d9d	t	2024-12-24 12:37:21.766	2024-12-24 12:37:21.766	d6663167-e873-4ab3-87de-6ec72595005d	\N	2	موجودات غير متداولة	1.2
2a71cf34-25b0-42d4-a2af-6aeee9c87b6f	Other Assets	ASSET	0	0	01e04536-df38-4b3f-a26b-33f0fb5d3d9d	t	2024-12-24 12:37:21.77	2024-12-24 12:37:21.77	d6663167-e873-4ab3-87de-6ec72595005d	\N	2	أصول أخرى	1.3
ab832927-978b-4702-a0a7-04af9ec09da9	Current Liabilities	LIABILITY	0	0	667e89b2-e372-4782-b7f2-048ba550b832	t	2024-12-24 12:37:21.774	2024-12-24 12:37:21.774	d6663167-e873-4ab3-87de-6ec72595005d	\N	2	مطلوبات متداولة	2.1
2f5c1b2a-0ffb-4318-abfb-f2ea84d0dd57	Long-Term Liabilities	LIABILITY	0	0	667e89b2-e372-4782-b7f2-048ba550b832	t	2024-12-24 12:37:21.777	2024-12-24 12:37:21.777	d6663167-e873-4ab3-87de-6ec72595005d	\N	2	مطلوبات طويلة الأجل	2.2
735fbd65-c6cb-45b4-8207-f39925796440	Capital	EQUITY	0	0	5a28760c-97da-4d82-b99c-79d4e9d61072	t	2024-12-24 12:37:21.781	2024-12-24 12:37:21.781	d6663167-e873-4ab3-87de-6ec72595005d	\N	2	رأس المال	3.1
bdd18987-1630-497d-9cf0-be95a360b526	Sales Revenue	REVENUE	0	0	f08f4f0b-787a-4b95-9905-00a420ce970b	t	2024-12-24 12:37:21.784	2024-12-24 12:37:21.784	d6663167-e873-4ab3-87de-6ec72595005d	\N	2	إيرادات المبيعات	4.1
5f70d110-17fb-46b1-ba05-b5a305e51e0b	Other Income	REVENUE	0	0	bdd18987-1630-497d-9cf0-be95a360b526	t	2024-12-24 12:37:21.788	2024-12-24 12:37:21.788	d6663167-e873-4ab3-87de-6ec72595005d	\N	3	إيرادات أخرى	4.2
8c501ad9-088f-457c-99bd-33565d9745c7	Cost of Goods Sold (COGS)	EXPENSE	0	0	00fd06f4-2df0-414b-8d24-b1bdeb6cfa7c	t	2024-12-24 12:37:21.791	2024-12-24 12:37:21.791	d6663167-e873-4ab3-87de-6ec72595005d	\N	2	تكلفة البضاعة المباعة	5.1
de4edd26-b3e6-46a6-ad9c-2a425764c2b4	General Administrative Expenses	EXPENSE	0	0	00fd06f4-2df0-414b-8d24-b1bdeb6cfa7c	t	2024-12-24 12:37:21.794	2024-12-24 12:37:21.794	d6663167-e873-4ab3-87de-6ec72595005d	\N	2	مصروفات إدارية وعمومية	5.2
2b110cef-39e2-495c-b4cd-b99e1247c7f6	Depreciation	EXPENSE	0	0	00fd06f4-2df0-414b-8d24-b1bdeb6cfa7c	t	2024-12-24 12:37:21.797	2024-12-24 12:37:21.797	d6663167-e873-4ab3-87de-6ec72595005d	\N	2	الاستهلاك	5.3
30067300-a09f-432f-a1fe-d0fb4297415a	Other Expensies	EXPENSE	0	0	00fd06f4-2df0-414b-8d24-b1bdeb6cfa7c	t	2024-12-24 12:37:21.8	2024-12-24 12:37:21.8	d6663167-e873-4ab3-87de-6ec72595005d	\N	2	مصروفات أخرى	5.4
5c18d7cf-7e97-41db-bcd8-ac241a256945	Cash	ASSET	0	0	dbc78ee1-a405-4861-8565-eccaaebdaae1	t	2024-12-24 12:37:21.803	2024-12-24 12:37:21.803	d6663167-e873-4ab3-87de-6ec72595005d	\N	3	النقدية	1.1.1
82794ac2-c2ba-44f3-ad47-ea96d26297db	Bank Accounts	ASSET	0	0	dbc78ee1-a405-4861-8565-eccaaebdaae1	t	2024-12-24 12:37:21.805	2024-12-24 12:37:21.805	d6663167-e873-4ab3-87de-6ec72595005d	\N	3	حسابات البنوك	1.1.2
a3fb1b4b-d258-410e-bf62-5f24594181da	Accounts Receivable	ASSET	0	0	dbc78ee1-a405-4861-8565-eccaaebdaae1	t	2024-12-24 12:37:21.808	2024-12-24 12:37:21.808	d6663167-e873-4ab3-87de-6ec72595005d	\N	3	ذمم مدينة	1.1.3
fa915957-67f6-497c-a59d-83628a33f380	Inventory	ASSET	0	0	dbc78ee1-a405-4861-8565-eccaaebdaae1	t	2024-12-24 12:37:21.81	2024-12-24 12:37:21.81	d6663167-e873-4ab3-87de-6ec72595005d	\N	3	المخزون	1.1.4
fd60f4a9-bdb3-49e8-b27b-0fd09eb9ffc3	Cheques	ASSET	0	0	dbc78ee1-a405-4861-8565-eccaaebdaae1	t	2024-12-24 12:37:21.813	2024-12-24 12:37:21.813	d6663167-e873-4ab3-87de-6ec72595005d	\N	3	الشيكات	1.1.5
3adab4ca-3a36-4e77-a3b5-b8ffeaf12b8f	Allowance for Doubtful Accounts	CONTRA_ASSET	0	0	dbc78ee1-a405-4861-8565-eccaaebdaae1	t	2024-12-24 12:37:21.815	2024-12-24 12:37:21.815	d6663167-e873-4ab3-87de-6ec72595005d	\N	3	مخصص الديون المشكوك في تحصيلها	1.1.6
91b484c7-54ae-4cb2-9344-542b4fffb6d7	Fixed Assets	ASSET	0	0	57e1432a-a385-40d4-867f-f2e3587553b0	t	2024-12-24 12:37:21.818	2024-12-24 12:37:21.818	d6663167-e873-4ab3-87de-6ec72595005d	\N	3	موجودات ثابتة	1.2.1
023c1af5-6569-4b63-a938-783dc41758de	Intangible Assets	ASSET	0	0	2a71cf34-25b0-42d4-a2af-6aeee9c87b6f	t	2024-12-24 12:37:21.82	2024-12-24 12:37:21.82	d6663167-e873-4ab3-87de-6ec72595005d	\N	3	الأصول غير الملموسة	1.3.1
282c8a06-1fc0-46cf-a2b4-ebfaae4ac277	Security Deposits	ASSET	0	0	2a71cf34-25b0-42d4-a2af-6aeee9c87b6f	t	2024-12-24 12:37:21.823	2024-12-24 12:37:21.823	d6663167-e873-4ab3-87de-6ec72595005d	\N	3	ودائع تأمينية	1.3.2
c13425ab-fbd6-4be9-a244-0c0a8e90f8af	Accounts Payable	LIABILITY	0	0	ab832927-978b-4702-a0a7-04af9ec09da9	t	2024-12-24 12:37:21.825	2024-12-24 12:37:21.825	d6663167-e873-4ab3-87de-6ec72595005d	\N	3	ذمم دائنة	2.1.1
99faa62b-585b-4559-8451-97e90144b99a	Accrued Expenses	LIABILITY	0	0	ab832927-978b-4702-a0a7-04af9ec09da9	t	2024-12-24 12:37:21.827	2024-12-24 12:37:21.827	d6663167-e873-4ab3-87de-6ec72595005d	\N	3	مصروفات مستحقة	2.1.2
e8a633d1-e617-4943-ba37-666b2c622522	Taxes Payable	LIABILITY	0	0	ab832927-978b-4702-a0a7-04af9ec09da9	t	2024-12-24 12:37:21.83	2024-12-24 12:37:21.83	d6663167-e873-4ab3-87de-6ec72595005d	\N	3	ضرائب مستحقة	2.1.3
cd498f5d-7d36-4dae-b96a-140cee5f07fd	Long-Term Loans	LIABILITY	0	0	2f5c1b2a-0ffb-4318-abfb-f2ea84d0dd57	t	2024-12-24 12:37:21.832	2024-12-24 12:37:21.832	d6663167-e873-4ab3-87de-6ec72595005d	\N	3	قروض طويلة الأجل	2.2.1
7c1b497e-9ee4-4b06-8ae6-69482dd8feb1	Deferred Revenue	LIABILITY	0	0	2f5c1b2a-0ffb-4318-abfb-f2ea84d0dd57	t	2024-12-24 12:37:21.834	2024-12-24 12:37:21.834	d6663167-e873-4ab3-87de-6ec72595005d	\N	3	إيرادات مؤجلة	2.2.2
a5ebcd09-efe4-4e1b-b797-bec839d63f20	Shareholder Contributions	EQUITY	0	0	735fbd65-c6cb-45b4-8207-f39925796440	t	2024-12-24 12:37:21.836	2024-12-24 12:37:21.836	d6663167-e873-4ab3-87de-6ec72595005d	\N	3	مساهمات المساهمين	3.1.1
a48c49d3-a26b-4e68-943e-2375acc5cc16	Retained Earnings	EQUITY	0	0	735fbd65-c6cb-45b4-8207-f39925796440	t	2024-12-24 12:37:21.838	2024-12-24 12:37:21.838	d6663167-e873-4ab3-87de-6ec72595005d	\N	3	الأرباح المحتجزة	3.1.2
caf6aae6-1fda-43b8-a8c5-61a8af506d73	Product Sales	REVENUE	0	0	bdd18987-1630-497d-9cf0-be95a360b526	t	2024-12-24 12:37:21.84	2024-12-24 12:37:21.84	d6663167-e873-4ab3-87de-6ec72595005d	\N	3	مبيعات المنتجات	4.1.1
feea0bdd-3a6c-42cf-ad40-c9b758888dc6	Service Revenue	REVENUE	0	0	bdd18987-1630-497d-9cf0-be95a360b526	t	2024-12-24 12:37:21.842	2024-12-24 12:37:21.842	d6663167-e873-4ab3-87de-6ec72595005d	\N	3	إيرادات الخدمات	4.1.2
500344fe-d037-4bcb-8736-896ea7787d1f	Init Stock	EXPENSE	0	0	8c501ad9-088f-457c-99bd-33565d9745c7	f	2024-12-24 12:37:21.844	2024-12-24 12:37:21.844	d6663167-e873-4ab3-87de-6ec72595005d	\N	3	بضاعة بداية المدة	5.1.1
e90610cc-46c5-4497-9b15-610da895fe40	Purchases	EXPENSE	0	0	8c501ad9-088f-457c-99bd-33565d9745c7	f	2024-12-24 12:37:21.846	2024-12-24 12:37:21.846	d6663167-e873-4ab3-87de-6ec72595005d	\N	3	المشتريات	5.1.2
c47342fd-746d-4013-ab65-456a59ae44c0	Purchases Expenses	EXPENSE	0	0	8c501ad9-088f-457c-99bd-33565d9745c7	f	2024-12-24 12:37:21.848	2024-12-24 12:37:21.848	d6663167-e873-4ab3-87de-6ec72595005d	\N	3	مصروف المشتريات	5.1.3
24e36781-5368-40ef-abea-2eb349a16c08	Ending Stock	EXPENSE	0	0	8c501ad9-088f-457c-99bd-33565d9745c7	f	2024-12-24 12:37:21.849	2024-12-24 12:37:21.849	d6663167-e873-4ab3-87de-6ec72595005d	\N	3	بضاعة اخر المدة	5.1.4
709dd193-c72a-491f-8474-727593dd28e7	Accumulated Depreciation	CONTRA_ASSET	0	0	91b484c7-54ae-4cb2-9344-542b4fffb6d7	t	2024-12-24 12:37:21.852	2024-12-24 12:37:21.852	d6663167-e873-4ab3-87de-6ec72595005d	\N	4	مجمع الاهلاك	1.2.1.1
\.


--
-- Data for Name: AdditionalDocument; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."AdditionalDocument" (id, "referenceId", "referenceUUID", "invoiceId", "companyId") FROM stdin;
\.


--
-- Data for Name: Asset; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Asset" (id, name, value, "heldForSale", "fairValue", "createdAt", "updatedAt", "companyId") FROM stdin;
\.


--
-- Data for Name: BankDetails; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."BankDetails" (id, "accountId", "bankName", "accountNumber", iban, "swiftCode", "branchName", "isActive", "createdAt", "updatedAt", "companyId") FROM stdin;
bb1522ac-0619-4c99-9b27-84e24d1c57dd	a2e167a9-76bf-4bc9-b75e-6fc8a694c8fb	Capital Bank	987654331	\N	\N	\N	t	2024-12-24 09:18:36.838	2024-12-24 09:18:36.838	d6663167-e873-4ab3-87de-6ec72595005d
7c03cc3c-4d3c-4170-b0a3-fd23c3a7288c	24dc6409-6193-4fee-9037-63a9ece93f4c	Capital Bank	987654332	\N	\N	\N	t	2024-12-24 09:18:36.842	2024-12-24 09:18:36.842	d6663167-e873-4ab3-87de-6ec72595005d
0e889464-a3dc-4ef9-8eba-785cae3d722b	99b1b871-48e9-4df5-91e6-b5cd5d10c414	Capital Bank	987654333	\N	\N	\N	t	2024-12-24 09:18:36.845	2024-12-24 09:18:36.845	d6663167-e873-4ab3-87de-6ec72595005d
2593f458-8359-4ccf-957a-e56ef8081dd2	d0c001a8-7eaa-4efb-b0b5-5aa86729b3be	Capital Bank	987654334	\N	\N	\N	t	2024-12-24 09:18:36.847	2024-12-24 09:18:36.847	d6663167-e873-4ab3-87de-6ec72595005d
238b58a6-6e77-4e26-9b30-29e191e7056d	0a7deb31-23f1-439f-84ac-fb5a0a1dc78d	Capital Bank	987654335	\N	\N	\N	t	2024-12-24 09:18:36.85	2024-12-24 09:18:36.85	d6663167-e873-4ab3-87de-6ec72595005d
3e18c7cd-c695-4e0b-a049-d406f991ce6d	93477751-555c-47c8-981d-8e9e354f5ef2	Capital Bank	987654336	\N	\N	\N	t	2024-12-24 09:18:36.853	2024-12-24 09:18:36.853	d6663167-e873-4ab3-87de-6ec72595005d
\.


--
-- Data for Name: BillingReference; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."BillingReference" (id, "invoiceId", "originalInvoiceId", "originalUUID", description, "companyId") FROM stdin;
\.


--
-- Data for Name: Buyer; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Buyer" (id, identification, "schemeId", name, "postalCode", "countryCode", phone, "companyId") FROM stdin;
\.


--
-- Data for Name: Cheque; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Cheque" (id, "receiptId", "chequeNumber", "bankName", amount, date, "createdAt", "updatedAt", "companyId") FROM stdin;
\.


--
-- Data for Name: Company; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Company" (id, name, address, "whatsAppKey", phone, email, website, "taxNumber", "logoImage", "createdAt", "updatedAt", "eInvoiceClientId", "eInvoiceSecretKey", "legalName", "eInvoiceLink", "legalId") FROM stdin;
0eacb1fe-7f64-4679-a5a3-251bda8e70a7	Lava Trading				Lava@lavatrading.com			https://firebasestorage.googleapis.com/v0/b/gixatco.firebasestorage.app/o/settings%2FpapayaTrading%2Fpapaya-logo.png?alt=media&token=5fe1e64b-cabf-4e10-bcc9-5aa54dfd2afe	2024-12-17 01:14:08.758	2024-12-17 07:33:22.412			lavattt		123
021e3356-df63-40c8-9397-2e0dfb3727da	Margo for medical equipment	\N	\N	\N	maria@margogroup.net	\N	\N	https://firebasestorage.googleapis.com/v0/b/gixatco.firebasestorage.app/o/settings%2Fmargo%2Fmargo-for-medical-equipment-logo.png?alt=media&	2024-12-22 09:19:13.789	2024-12-22 09:21:00.698	\N	\N	\N	\N	\N
d6663167-e873-4ab3-87de-6ec72595005d	Papaya Trading				al-hussein@papayatrading.com		12254475	https://firebasestorage.googleapis.com/v0/b/gixatco.firebasestorage.app/o/settings%2FpapayaTrading%2Fpapaya-logo.png?alt=media&token=5fe1e64b-cabf-4e10-bcc9-5aa54dfd2afe	2024-12-16 22:29:10.628	2024-12-22 10:40:45.742			123		000002gg
9010b439-276f-40d0-85d4-5ecb8b59d0e1	Al-Mussafah Trading	\N	\N	\N	x@x.com	\N	\N	https://firebasestorage.googleapis.com/v0/b/gixatco.firebasestorage.app/o/settings%2Falmussafah%2Fmussafah-logo.jpeg?alt=media&	2024-12-16 22:27:49.363	2024-12-22 10:43:15.273	\N	\N	\N	\N	\N
\.


--
-- Data for Name: Contract; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Contract" (id, "customerId", "totalValue", "createdAt", "updatedAt", "companyId") FROM stdin;
\.


--
-- Data for Name: Customer; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Customer" (id, identification, name, "postalCode", "countryCode", phone, email, address, "createdAt", "updatedAt", "accountId", "companyId") FROM stdin;
cm5297f3u00001rrcmvjt8u2r	Unknown	Test Client1	\N	JO	1234567890	[object Object]	Client Street1	2024-12-24 09:18:36.858	2024-12-24 09:18:36.858	e0827f3f-bc26-49bd-b590-b26654997ae9	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f3z00011rrcwotipw75	Unknown	Test Client2	\N	JO	1234567891	[object Object]	Client Street2	2024-12-24 09:18:36.863	2024-12-24 09:18:36.863	83ba32d4-dbcf-4803-8720-5511c7d4e353	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f4200021rrc63fe3jmq	Unknown	Test Client3	\N	JO	1234567892	[object Object]	Client Street3	2024-12-24 09:18:36.867	2024-12-24 09:18:36.867	421dd97a-880e-4032-901b-6cb208f47431	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f4500031rrcsg79y2f2	Unknown	Test Client4	\N	JO	1234567893	[object Object]	Client Street4	2024-12-24 09:18:36.869	2024-12-24 09:18:36.869	1447b314-2811-477f-9b38-9e12f5d20722	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f4800041rrcwg8lgldu	Unknown	Test Client5	\N	JO	1234567894	[object Object]	Client Street5	2024-12-24 09:18:36.872	2024-12-24 09:18:36.872	4848193c-1dee-4fdd-a36b-9c46bfb41902	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f4a00051rrcyoszn12r	Unknown	Test Client6	\N	JO	1234567895	[object Object]	Client Street6	2024-12-24 09:18:36.875	2024-12-24 09:18:36.875	91eb7118-4634-40d1-9366-0967ad4386b3	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f4d00061rrc0cc4io3b	Unknown	Test Client7	\N	JO	1234567896	[object Object]	Client Street7	2024-12-24 09:18:36.877	2024-12-24 09:18:36.877	90df649b-e790-437e-8f64-c92fedde9871	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f4g00071rrcpm16p833	Unknown	Test Client8	\N	JO	1234567897	[object Object]	Client Street8	2024-12-24 09:18:36.88	2024-12-24 09:18:36.88	3fd5b995-daa5-4d2e-9bca-e6c4d21d3bb3	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f4i00081rrc09pkxwzo	Unknown	Test Client9	\N	JO	1234567898	[object Object]	Client Street9	2024-12-24 09:18:36.883	2024-12-24 09:18:36.883	503d4cc9-1d82-4338-ad9a-6cb3fb7a8742	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f5300091rrcshoy73mw	Unknown	Test Client10	\N	JO	1234567899	[object Object]	Client Street10	2024-12-24 09:18:36.904	2024-12-24 09:18:36.904	514d8881-7110-49ad-8d4b-9fac8537f82e	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f56000a1rrc5fodhthf	Unknown	Test Client11	\N	JO	1234567900	[object Object]	Client Street11	2024-12-24 09:18:36.906	2024-12-24 09:18:36.906	f3318ee2-06b7-416d-86ee-3d230bf58683	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f58000b1rrcbpxegy51	Unknown	Test Client12	\N	JO	1234567901	[object Object]	Client Street12	2024-12-24 09:18:36.909	2024-12-24 09:18:36.909	8d93c87e-67bd-41c1-b0ba-62824b1bf542	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f5b000c1rrcnecaeijs	Unknown	Test Client13	\N	JO	1234567902	[object Object]	Client Street13	2024-12-24 09:18:36.912	2024-12-24 09:18:36.912	f9a99c59-6e99-4d6a-b15f-7df0b225da32	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f5e000d1rrcnooa5b9l	Unknown	Test Client14	\N	JO	1234567903	[object Object]	Client Street14	2024-12-24 09:18:36.914	2024-12-24 09:18:36.914	d8f5d7bd-0ab7-4b20-b142-f52b1c1bcb4a	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f5g000e1rrc78dquaxp	Unknown	Test Client15	\N	JO	1234567904	[object Object]	Client Street15	2024-12-24 09:18:36.917	2024-12-24 09:18:36.917	d66de33b-e76c-4423-9f88-e524c928a6fc	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f5j000f1rrcgyhe3r84	Unknown	Test Client16	\N	JO	1234567905	[object Object]	Client Street16	2024-12-24 09:18:36.919	2024-12-24 09:18:36.919	695c976d-558e-4aad-b25f-8162e2a1476b	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f5m000g1rrcidgl0ypa	Unknown	Test Client17	\N	JO	1234567906	[object Object]	Client Street17	2024-12-24 09:18:36.922	2024-12-24 09:18:36.922	4e60b319-3927-444d-ab98-3563e94ada99	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f5o000h1rrc5sw26f3l	Unknown	Test Client18	\N	JO	1234567907	[object Object]	Client Street18	2024-12-24 09:18:36.925	2024-12-24 09:18:36.925	6cde4230-771a-4af9-8738-b493d441c1e7	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f5r000i1rrcxti1es56	Unknown	Test Client19	\N	JO	1234567908	[object Object]	Client Street19	2024-12-24 09:18:36.927	2024-12-24 09:18:36.927	cb415c95-218a-40b2-88d3-5c9604c3d43d	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f5u000j1rrcsggjqqdg	Unknown	Test Client20	\N	JO	1234567909	[object Object]	Client Street20	2024-12-24 09:18:36.93	2024-12-24 09:18:36.93	7ba10a9f-f1f9-496c-94f7-fc44f9916320	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f5w000k1rrcscn48hmo	Unknown	Test Client21	\N	JO	1234567910	[object Object]	Client Street21	2024-12-24 09:18:36.933	2024-12-24 09:18:36.933	78de945d-6398-447e-91ea-f2a20ca9d718	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f5z000l1rrc754pzl0t	Unknown	Test Client22	\N	JO	1234567911	[object Object]	Client Street22	2024-12-24 09:18:36.935	2024-12-24 09:18:36.935	4a4484bf-0aa8-4175-8c58-86a661fa346d	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f61000m1rrcvbhfrzxo	Unknown	Test Client23	\N	JO	1234567912	[object Object]	Client Street23	2024-12-24 09:18:36.938	2024-12-24 09:18:36.938	e7609203-bf90-4c63-8576-c9a4a7dd47b5	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f64000n1rrc2yy8ckya	Unknown	Test Client24	\N	JO	1234567913	[object Object]	Client Street24	2024-12-24 09:18:36.94	2024-12-24 09:18:36.94	e4cec51c-afc0-403b-afd5-c9cef93e0963	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f66000o1rrcg9gg41ed	Unknown	Test Client25	\N	JO	1234567914	[object Object]	Client Street25	2024-12-24 09:18:36.943	2024-12-24 09:18:36.943	774f01e4-79c2-4706-9b8b-b55c95538be9	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f69000p1rrcbk0knold	Unknown	Test Client26	\N	JO	1234567915	[object Object]	Client Street26	2024-12-24 09:18:36.945	2024-12-24 09:18:36.945	608e86cb-405b-49c8-8183-9b420c226808	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f6b000q1rrc6gjvpvwr	Unknown	Test Client27	\N	JO	1234567916	[object Object]	Client Street27	2024-12-24 09:18:36.948	2024-12-24 09:18:36.948	ac240095-dbe2-4836-a70f-639eaa4a44d0	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f6e000r1rrceq4t3gsu	Unknown	Test Client28	\N	JO	1234567917	[object Object]	Client Street28	2024-12-24 09:18:36.95	2024-12-24 09:18:36.95	bc87906b-69de-46eb-b618-b04d9936436e	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f6g000s1rrcm4ko7hc7	Unknown	Test Client29	\N	JO	1234567918	[object Object]	Client Street29	2024-12-24 09:18:36.953	2024-12-24 09:18:36.953	915233d3-5bf4-4fdb-8386-1b775a0ef032	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f6j000t1rrc8xrhkrdd	Unknown	Test Client30	\N	JO	1234567919	[object Object]	Client Street30	2024-12-24 09:18:36.956	2024-12-24 09:18:36.956	18607627-ca81-4a34-95af-3ee472831fa7	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f6m000u1rrcncjrwuzq	Unknown	Test Client31	\N	JO	1234567920	[object Object]	Client Street31	2024-12-24 09:18:36.959	2024-12-24 09:18:36.959	ca6ec785-caca-4c41-8914-95045dd96336	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f6p000v1rrc2tmtwkee	Unknown	Test Client32	\N	JO	1234567921	[object Object]	Client Street32	2024-12-24 09:18:36.962	2024-12-24 09:18:36.962	8075f998-3cd3-42b4-a809-30698766a7f1	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f6t000w1rrchfov49ud	Unknown	Test Client33	\N	JO	1234567922	[object Object]	Client Street33	2024-12-24 09:18:36.966	2024-12-24 09:18:36.966	2f5c5484-4a30-4ad6-a303-e1b757b55776	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f6w000x1rrc6rzhyi6f	Unknown	Test Client34	\N	JO	1234567923	[object Object]	Client Street34	2024-12-24 09:18:36.969	2024-12-24 09:18:36.969	e537a4d7-7681-4beb-a4cd-486436129c65	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f71000y1rrcuvdh8syx	Unknown	Test Client35	\N	JO	1234567924	[object Object]	Client Street35	2024-12-24 09:18:36.973	2024-12-24 09:18:36.973	e3199f3f-9bf5-4992-81e4-ca5bb335704d	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f75000z1rrcq9d67pge	Unknown	Test Client36	\N	JO	1234567925	[object Object]	Client Street36	2024-12-24 09:18:36.977	2024-12-24 09:18:36.977	84a01af3-309d-4590-a897-a119b0b98312	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f7a00101rrczeex6dpy	Unknown	Test Client37	\N	JO	1234567926	[object Object]	Client Street37	2024-12-24 09:18:36.982	2024-12-24 09:18:36.982	5641575f-ff06-4591-bc7b-bc5c1a6b874e	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f7d00111rrcsroy6a6s	Unknown	Test Client38	\N	JO	1234567927	[object Object]	Client Street38	2024-12-24 09:18:36.986	2024-12-24 09:18:36.986	b57895b7-bc45-49a2-b0ea-ed7bb37302cc	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f7h00121rrcvghaigs4	Unknown	Test Client39	\N	JO	1234567928	[object Object]	Client Street39	2024-12-24 09:18:36.989	2024-12-24 09:18:36.989	2be3757e-2ab3-4869-9d0c-08b9b15b42de	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f7k00131rrc238nmvyy	Unknown	Test Client40	\N	JO	1234567929	[object Object]	Client Street40	2024-12-24 09:18:36.992	2024-12-24 09:18:36.992	0b9d0bff-37c6-40a7-ad52-ce5be4141ff2	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f7o00141rrchl3ujwxf	Unknown	Test Client41	\N	JO	1234567930	[object Object]	Client Street41	2024-12-24 09:18:36.996	2024-12-24 09:18:36.996	19b0c7ac-0e9a-439f-b857-e454dcb98bb7	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f7r00151rrc5r3s6qz1	Unknown	Test Client42	\N	JO	1234567931	[object Object]	Client Street42	2024-12-24 09:18:37	2024-12-24 09:18:37	9f9fbb3c-d67a-44e0-9e1e-9c2d74921196	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f7v00161rrc3yduzkqe	Unknown	Test Client43	\N	JO	1234567932	[object Object]	Client Street43	2024-12-24 09:18:37.003	2024-12-24 09:18:37.003	d5da7e51-de66-47f1-a7c6-3d2bdf26d6c6	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f7y00171rrcfgo04sag	Unknown	Test Client44	\N	JO	1234567933	[object Object]	Client Street44	2024-12-24 09:18:37.007	2024-12-24 09:18:37.007	48d9d0ce-ca49-4625-bcd7-a1bd5515a14a	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f8100181rrcprldsszi	Unknown	Test Client45	\N	JO	1234567934	[object Object]	Client Street45	2024-12-24 09:18:37.01	2024-12-24 09:18:37.01	7b198b7a-f5f0-4958-a7ff-9b0643bc49f0	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f8500191rrc67jowrwu	Unknown	Test Client46	\N	JO	1234567935	[object Object]	Client Street46	2024-12-24 09:18:37.013	2024-12-24 09:18:37.013	93ed6075-0b9c-4676-8c80-c5cd3fcb366d	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f88001a1rrcw9dn3vcx	Unknown	Test Client47	\N	JO	1234567936	[object Object]	Client Street47	2024-12-24 09:18:37.017	2024-12-24 09:18:37.017	36d49528-13b0-4d09-aeff-c548d62304f5	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f8c001b1rrcvuchh50e	Unknown	Test Client48	\N	JO	1234567937	[object Object]	Client Street48	2024-12-24 09:18:37.02	2024-12-24 09:18:37.02	1168a4e3-a87d-46ed-bbe5-5f29eb5a2e8e	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f8e001c1rrcz3mvndpk	Unknown	Test Client49	\N	JO	1234567938	[object Object]	Client Street49	2024-12-24 09:18:37.023	2024-12-24 09:18:37.023	5e844bad-766d-4346-a97f-32d49e855aeb	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f8h001d1rrcnfg4540a	Unknown	Test Client50	\N	JO	1234567939	[object Object]	Client Street50	2024-12-24 09:18:37.026	2024-12-24 09:18:37.026	153f424a-871b-4147-90a5-9478a72a115d	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f8k001e1rrclwrgrzir	Unknown	Test Client51	\N	JO	1234567940	[object Object]	Client Street51	2024-12-24 09:18:37.029	2024-12-24 09:18:37.029	ecbeb4c5-64bd-46af-92dd-462f2750e053	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f8n001f1rrcpmydmpkq	Unknown	Test Client52	\N	JO	1234567941	[object Object]	Client Street52	2024-12-24 09:18:37.031	2024-12-24 09:18:37.031	20428dad-6904-4d5f-a6d4-c66ef87d2a92	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f8p001g1rrcldi6zgon	Unknown	Test Client53	\N	JO	1234567942	[object Object]	Client Street53	2024-12-24 09:18:37.034	2024-12-24 09:18:37.034	f820c419-6d59-4ce4-9451-f816577f4bab	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f8s001h1rrcnrec8f6b	Unknown	Test Client54	\N	JO	1234567943	[object Object]	Client Street54	2024-12-24 09:18:37.037	2024-12-24 09:18:37.037	84fb9f6b-716a-4482-8b41-851a04317f27	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f8v001i1rrcqy2c82kc	Unknown	Test Client55	\N	JO	1234567944	[object Object]	Client Street55	2024-12-24 09:18:37.039	2024-12-24 09:18:37.039	fdde1f07-9a07-4775-8279-56f460f0a36c	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f8x001j1rrcwz5y2kon	Unknown	Test Client56	\N	JO	1234567945	[object Object]	Client Street56	2024-12-24 09:18:37.042	2024-12-24 09:18:37.042	b6e8fbd4-5df3-4897-ab7a-2b3e17f15db0	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f90001k1rrczpaolgy0	Unknown	Test Client57	\N	JO	1234567946	[object Object]	Client Street57	2024-12-24 09:18:37.044	2024-12-24 09:18:37.044	e8aaf0e0-e3a6-47d6-b5e7-9c06ea940d81	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f92001l1rrc8z1zmoj8	Unknown	Test Client58	\N	JO	1234567947	[object Object]	Client Street58	2024-12-24 09:18:37.047	2024-12-24 09:18:37.047	08e9a11d-9668-4475-b0fd-25086d1d9a5e	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f95001m1rrcau4raskr	Unknown	Test Client59	\N	JO	1234567948	[object Object]	Client Street59	2024-12-24 09:18:37.049	2024-12-24 09:18:37.049	558a5e8a-5be6-4db8-96b6-f2d01eccf692	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f98001n1rrcr64mcn38	Unknown	Test Client60	\N	JO	1234567949	[object Object]	Client Street60	2024-12-24 09:18:37.052	2024-12-24 09:18:37.052	e7db5dd4-034d-4e9f-badd-6e775d91aa4b	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f9b001o1rrcf0wz7nsw	Unknown	Test Client61	\N	JO	1234567950	[object Object]	Client Street61	2024-12-24 09:18:37.055	2024-12-24 09:18:37.055	3a58d7af-775a-4433-81f1-78660031b109	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f9d001p1rrckztx4ie6	Unknown	Test Client62	\N	JO	1234567951	[object Object]	Client Street62	2024-12-24 09:18:37.058	2024-12-24 09:18:37.058	8043e396-4eaa-422f-a6ef-b74abba6a407	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f9g001q1rrc9rxtng05	Unknown	Test Client63	\N	JO	1234567952	[object Object]	Client Street63	2024-12-24 09:18:37.06	2024-12-24 09:18:37.06	24284448-9089-4931-a4ef-cabe705bbf07	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f9i001r1rrcf1xwrabx	Unknown	Test Client64	\N	JO	1234567953	[object Object]	Client Street64	2024-12-24 09:18:37.063	2024-12-24 09:18:37.063	822472e9-3c6d-4913-9ed5-e6f8499c11d0	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f9l001s1rrcjm8oxr4o	Unknown	Test Client65	\N	JO	1234567954	[object Object]	Client Street65	2024-12-24 09:18:37.066	2024-12-24 09:18:37.066	48b08446-c7bb-4b99-990d-f06e154ca921	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f9o001t1rrc19avd7oy	Unknown	Test Client66	\N	JO	1234567955	[object Object]	Client Street66	2024-12-24 09:18:37.068	2024-12-24 09:18:37.068	281be905-255d-4fb4-a4bc-2270ecb519c1	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f9r001u1rrcibot9po2	Unknown	Test Client67	\N	JO	1234567956	[object Object]	Client Street67	2024-12-24 09:18:37.071	2024-12-24 09:18:37.071	094f9de5-3414-4b27-aec6-1246922e8841	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f9t001v1rrc4890f6xn	Unknown	Test Client68	\N	JO	1234567957	[object Object]	Client Street68	2024-12-24 09:18:37.074	2024-12-24 09:18:37.074	1cc5658c-5dda-4560-b62d-64fda48a2cc4	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f9w001w1rrcz0sf1bwu	Unknown	Test Client69	\N	JO	1234567958	[object Object]	Client Street69	2024-12-24 09:18:37.077	2024-12-24 09:18:37.077	36c93a23-7ebd-4361-96b1-527240415dad	d6663167-e873-4ab3-87de-6ec72595005d
cm5297f9z001x1rrcyw7zhgdc	Unknown	Test Client70	\N	JO	1234567959	[object Object]	Client Street70	2024-12-24 09:18:37.079	2024-12-24 09:18:37.079	3a2b76a2-94e6-41dc-86e1-087c84fa3d9a	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fa1001y1rrcqarqejh9	Unknown	Test Client71	\N	JO	1234567960	[object Object]	Client Street71	2024-12-24 09:18:37.082	2024-12-24 09:18:37.082	b82c2368-7b6b-4279-a507-dba05f22b9fb	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fa4001z1rrcu7x7zidz	Unknown	Test Client72	\N	JO	1234567961	[object Object]	Client Street72	2024-12-24 09:18:37.084	2024-12-24 09:18:37.084	9af40ded-a7cb-4ffd-9818-f98e9d938229	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fa700201rrchvecd1wq	Unknown	Test Client73	\N	JO	1234567962	[object Object]	Client Street73	2024-12-24 09:18:37.087	2024-12-24 09:18:37.087	a8efa465-0d37-4225-9a2d-e70309741b99	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fa900211rrcefohct72	Unknown	Test Client74	\N	JO	1234567963	[object Object]	Client Street74	2024-12-24 09:18:37.09	2024-12-24 09:18:37.09	cd5f6a9c-b3dd-4f30-ad23-a527f04308a1	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fac00221rrc3m5qd127	Unknown	Test Client75	\N	JO	1234567964	[object Object]	Client Street75	2024-12-24 09:18:37.092	2024-12-24 09:18:37.092	0133fa53-95e3-4c1b-adf7-ac039c38f383	d6663167-e873-4ab3-87de-6ec72595005d
cm5297faf00231rrc09tp0cvl	Unknown	Test Client76	\N	JO	1234567965	[object Object]	Client Street76	2024-12-24 09:18:37.095	2024-12-24 09:18:37.095	21eed3b2-8be2-42c3-8f5b-32be2839d410	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fai00241rrclb6baaux	Unknown	Test Client77	\N	JO	1234567966	[object Object]	Client Street77	2024-12-24 09:18:37.098	2024-12-24 09:18:37.098	0d2c5470-5f0e-46c1-a6a8-e39d9c5e2bc0	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fak00251rrc4ncu5eew	Unknown	Test Client78	\N	JO	1234567967	[object Object]	Client Street78	2024-12-24 09:18:37.101	2024-12-24 09:18:37.101	ea4c9d8f-7153-4d6b-aded-62274a516063	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fan00261rrcr3k784x3	Unknown	Test Client79	\N	JO	1234567968	[object Object]	Client Street79	2024-12-24 09:18:37.104	2024-12-24 09:18:37.104	a48d5717-4a3c-4264-bbc5-295faf69678b	d6663167-e873-4ab3-87de-6ec72595005d
cm5297faq00271rrcrthi3bfo	Unknown	Test Client80	\N	JO	1234567969	[object Object]	Client Street80	2024-12-24 09:18:37.106	2024-12-24 09:18:37.106	14b1efba-d6fd-4c8a-aaac-7597584fc20e	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fat00281rrcacr9r8ht	Unknown	Test Client81	\N	JO	1234567970	[object Object]	Client Street81	2024-12-24 09:18:37.109	2024-12-24 09:18:37.109	fef5c8d4-c39d-4560-9e42-96768b39be94	d6663167-e873-4ab3-87de-6ec72595005d
cm5297faw00291rrcrnze6ax3	Unknown	Test Client82	\N	JO	1234567971	[object Object]	Client Street82	2024-12-24 09:18:37.112	2024-12-24 09:18:37.112	f21945bb-e277-4c62-a078-8a754a33e2ac	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fay002a1rrc7fl2fyyy	Unknown	Test Client83	\N	JO	1234567972	[object Object]	Client Street83	2024-12-24 09:18:37.115	2024-12-24 09:18:37.115	08343676-cccb-4444-a7ed-64d354518075	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fb1002b1rrck689a44n	Unknown	Test Client84	\N	JO	1234567973	[object Object]	Client Street84	2024-12-24 09:18:37.117	2024-12-24 09:18:37.117	43586d68-8e5d-4556-b225-2252588396f2	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fb4002c1rrcg74ovzqu	Unknown	Test Client85	\N	JO	1234567974	[object Object]	Client Street85	2024-12-24 09:18:37.12	2024-12-24 09:18:37.12	6a68a299-852c-4860-9911-6d9071920150	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fb6002d1rrcdnbjhsf8	Unknown	Test Client86	\N	JO	1234567975	[object Object]	Client Street86	2024-12-24 09:18:37.123	2024-12-24 09:18:37.123	d5663e66-96a8-48f3-be0a-29a3b6ff1686	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fb9002e1rrcdb3sursq	Unknown	Test Client87	\N	JO	1234567976	[object Object]	Client Street87	2024-12-24 09:18:37.125	2024-12-24 09:18:37.125	0d93cb6d-9c9f-49db-b80f-258c68a8cc7f	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fbc002f1rrc99207yzl	Unknown	Test Client88	\N	JO	1234567977	[object Object]	Client Street88	2024-12-24 09:18:37.128	2024-12-24 09:18:37.128	4bf7993a-d447-4245-9e9f-86407f46719c	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fbf002g1rrc2562h2ex	Unknown	Test Client89	\N	JO	1234567978	[object Object]	Client Street89	2024-12-24 09:18:37.131	2024-12-24 09:18:37.131	8171a063-e115-4e4f-a11f-c5bbb5a3d1a8	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fbi002h1rrcg0c5xcmg	Unknown	Test Client90	\N	JO	1234567979	[object Object]	Client Street90	2024-12-24 09:18:37.134	2024-12-24 09:18:37.134	080cd3d5-3ab9-468f-a83e-b0b8c46a6c5f	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fbl002i1rrcygtt9t7b	Unknown	Test Client91	\N	JO	1234567980	[object Object]	Client Street91	2024-12-24 09:18:37.137	2024-12-24 09:18:37.137	22b59fc7-ba14-4b55-84a4-a95ee0e97fae	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fbn002j1rrcnx3u5ueb	Unknown	Test Client92	\N	JO	1234567981	[object Object]	Client Street92	2024-12-24 09:18:37.139	2024-12-24 09:18:37.139	b07a661e-25ed-494f-b310-659f9ce5fa1c	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fbq002k1rrcx97sca20	Unknown	Test Client93	\N	JO	1234567982	[object Object]	Client Street93	2024-12-24 09:18:37.142	2024-12-24 09:18:37.142	73a60fa9-eca6-45b7-93a2-ca3464b0c86e	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fbs002l1rrcbjo7fjod	Unknown	Test Client94	\N	JO	1234567983	[object Object]	Client Street94	2024-12-24 09:18:37.144	2024-12-24 09:18:37.144	15e1cda2-cccb-4bd9-a3b2-f26fa673afac	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fbu002m1rrchq2qqwid	Unknown	Test Client95	\N	JO	1234567984	[object Object]	Client Street95	2024-12-24 09:18:37.147	2024-12-24 09:18:37.147	8bab33f0-a492-4298-a618-88c40f6196b3	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fbx002n1rrc6lgk8fdq	Unknown	Test Client96	\N	JO	1234567985	[object Object]	Client Street96	2024-12-24 09:18:37.15	2024-12-24 09:18:37.15	a7d5baf7-a3ab-4935-8d2a-8f756a3cb9db	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fc1002o1rrc6ke3azi3	Unknown	Test Client97	\N	JO	1234567986	[object Object]	Client Street97	2024-12-24 09:18:37.153	2024-12-24 09:18:37.153	e5d47a99-8910-4e2b-99e0-766dae5278fd	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fc4002p1rrcuzewuvay	Unknown	Test Client98	\N	JO	1234567987	[object Object]	Client Street98	2024-12-24 09:18:37.156	2024-12-24 09:18:37.156	13b42501-7da8-486b-97ce-583502f64b30	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fc7002q1rrca7oahxpf	Unknown	Test Client99	\N	JO	1234567988	[object Object]	Client Street99	2024-12-24 09:18:37.159	2024-12-24 09:18:37.159	c8f60144-8a81-4303-ad86-cd3f0ba73d25	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fdq002r1rrc73ftv4wo	Unknown	Test Client100	\N	JO	1234567989	[object Object]	Client Street100	2024-12-24 09:18:37.214	2024-12-24 09:18:37.214	5802b810-5874-4db3-bc17-118a87054bce	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fdt002s1rrcupbb418o	Unknown	Test Client101	\N	JO	1234567990	[object Object]	Client Street101	2024-12-24 09:18:37.217	2024-12-24 09:18:37.217	bf97c2e6-087c-4138-b506-8a7b2341f125	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fdv002t1rrcrpx7mhfw	Unknown	Test Client102	\N	JO	1234567991	[object Object]	Client Street102	2024-12-24 09:18:37.22	2024-12-24 09:18:37.22	891ec9ae-0d3d-4892-80d2-0b57fa13edea	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fdy002u1rrc44pcyjug	Unknown	Test Client103	\N	JO	1234567992	[object Object]	Client Street103	2024-12-24 09:18:37.223	2024-12-24 09:18:37.223	70b89782-abaa-4db6-ab63-14afc6a73510	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fe2002v1rrcavl4gbia	Unknown	Test Client104	\N	JO	1234567993	[object Object]	Client Street104	2024-12-24 09:18:37.226	2024-12-24 09:18:37.226	507798dc-4e9f-43d6-8ef1-01dcbf061455	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fe4002w1rrc7zekysi1	Unknown	Test Client105	\N	JO	1234567994	[object Object]	Client Street105	2024-12-24 09:18:37.229	2024-12-24 09:18:37.229	d455482d-71b4-4ac4-93a1-d4c297d5ff96	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fe7002x1rrcccfmnr83	Unknown	Test Client106	\N	JO	1234567995	[object Object]	Client Street106	2024-12-24 09:18:37.232	2024-12-24 09:18:37.232	6235d48b-343e-4821-8a9a-55499fe06e57	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fea002y1rrcizj6qbki	Unknown	Test Client107	\N	JO	1234567996	[object Object]	Client Street107	2024-12-24 09:18:37.234	2024-12-24 09:18:37.234	de2afd96-4015-4300-94ce-ba7874cd23af	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fed002z1rrcvkjpfe5k	Unknown	Test Client108	\N	JO	1234567997	[object Object]	Client Street108	2024-12-24 09:18:37.237	2024-12-24 09:18:37.237	85e5efd2-6e15-4e6f-9abc-22a1c7f33e74	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fef00301rrc68huj5o4	Unknown	Test Client109	\N	JO	1234567998	[object Object]	Client Street109	2024-12-24 09:18:37.24	2024-12-24 09:18:37.24	0fd81814-9e6e-4bee-8649-a0c0dea6a012	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fej00311rrcx780zfkr	Unknown	Test Client110	\N	JO	1234567999	[object Object]	Client Street110	2024-12-24 09:18:37.243	2024-12-24 09:18:37.243	85c492bf-bd49-47a2-a5dc-51b9c9cb248a	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fem00321rrcz6ta3wrj	Unknown	Test Client111	\N	JO	1234568000	[object Object]	Client Street111	2024-12-24 09:18:37.246	2024-12-24 09:18:37.246	e1558262-11b7-4216-bf02-298276517a6d	d6663167-e873-4ab3-87de-6ec72595005d
cm5297feo00331rrce9uplo8i	Unknown	Test Client112	\N	JO	1234568001	[object Object]	Client Street112	2024-12-24 09:18:37.249	2024-12-24 09:18:37.249	9d856f55-4827-4b09-b996-d34597315a35	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fer00341rrcluxd7coc	Unknown	Test Client113	\N	JO	1234568002	[object Object]	Client Street113	2024-12-24 09:18:37.251	2024-12-24 09:18:37.251	0de2a261-ced8-4f0c-97fc-b9ced9da6b15	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fet00351rrcz1o15scx	Unknown	Test Client114	\N	JO	1234568003	[object Object]	Client Street114	2024-12-24 09:18:37.254	2024-12-24 09:18:37.254	a7fc4540-8bd0-4740-896b-b584d50651a5	d6663167-e873-4ab3-87de-6ec72595005d
cm5297few00361rrchkztoepm	Unknown	Test Client115	\N	JO	1234568004	[object Object]	Client Street115	2024-12-24 09:18:37.256	2024-12-24 09:18:37.256	0aa55fde-b2c1-4032-9009-e7a332a8d940	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fey00371rrctl78r5q6	Unknown	Test Client116	\N	JO	1234568005	[object Object]	Client Street116	2024-12-24 09:18:37.259	2024-12-24 09:18:37.259	62523ce9-9cd0-4e0b-91fc-fd539ccfc687	d6663167-e873-4ab3-87de-6ec72595005d
cm5297ff100381rrcjh031lcn	Unknown	Test Client117	\N	JO	1234568006	[object Object]	Client Street117	2024-12-24 09:18:37.261	2024-12-24 09:18:37.261	0c27e8df-00fa-470f-9a80-2363b3fc34b6	d6663167-e873-4ab3-87de-6ec72595005d
cm5297ff300391rrc9kz9yvpa	Unknown	Test Client118	\N	JO	1234568007	[object Object]	Client Street118	2024-12-24 09:18:37.264	2024-12-24 09:18:37.264	7002a130-621c-4525-a053-61e8e6a3ce8a	d6663167-e873-4ab3-87de-6ec72595005d
cm5297ff6003a1rrc88yctnrd	Unknown	Test Client119	\N	JO	1234568008	[object Object]	Client Street119	2024-12-24 09:18:37.266	2024-12-24 09:18:37.266	fc26094d-1b63-41c4-b20f-8deae1d41ed1	d6663167-e873-4ab3-87de-6ec72595005d
cm5297ffd003b1rrcwm0l7ro0	Unknown	Test Client120	\N	JO	1234568009	[object Object]	Client Street120	2024-12-24 09:18:37.273	2024-12-24 09:18:37.273	0e6ad387-68c6-48f5-ba11-101a390549e8	d6663167-e873-4ab3-87de-6ec72595005d
cm5297ffg003c1rrcp70n33da	Unknown	Test Client121	\N	JO	1234568010	[object Object]	Client Street121	2024-12-24 09:18:37.276	2024-12-24 09:18:37.276	df04557c-4bf8-45f5-9c8c-05b9394cd637	d6663167-e873-4ab3-87de-6ec72595005d
cm5297ffi003d1rrc8iww0hyc	Unknown	Test Client122	\N	JO	1234568011	[object Object]	Client Street122	2024-12-24 09:18:37.278	2024-12-24 09:18:37.278	6ddf8e7b-ec25-4cb5-90c2-dfdbde980a2d	d6663167-e873-4ab3-87de-6ec72595005d
cm5297ffk003e1rrckzshs08w	Unknown	Test Client123	\N	JO	1234568012	[object Object]	Client Street123	2024-12-24 09:18:37.281	2024-12-24 09:18:37.281	0fe7bca3-3a69-4a05-845c-f5770f6d4e2f	d6663167-e873-4ab3-87de-6ec72595005d
cm5297ffn003f1rrc5fjht8pg	Unknown	Test Client124	\N	JO	1234568013	[object Object]	Client Street124	2024-12-24 09:18:37.283	2024-12-24 09:18:37.283	fa7d93e1-246f-4e7f-a124-006d824517fe	d6663167-e873-4ab3-87de-6ec72595005d
cm5297ffp003g1rrc6sbwuyyk	Unknown	Test Client125	\N	JO	1234568014	[object Object]	Client Street125	2024-12-24 09:18:37.286	2024-12-24 09:18:37.286	37002b5c-f62f-4f73-bc7f-47eb10658c78	d6663167-e873-4ab3-87de-6ec72595005d
cm5297ffr003h1rrc4bn7n3h6	Unknown	Test Client126	\N	JO	1234568015	[object Object]	Client Street126	2024-12-24 09:18:37.288	2024-12-24 09:18:37.288	c2c4f559-7181-4c97-9794-2bc94e379659	d6663167-e873-4ab3-87de-6ec72595005d
cm5297ffu003i1rrc0n5sujb7	Unknown	Test Client127	\N	JO	1234568016	[object Object]	Client Street127	2024-12-24 09:18:37.291	2024-12-24 09:18:37.291	12485227-110c-42ca-bd7c-ea3e63132fb9	d6663167-e873-4ab3-87de-6ec72595005d
cm5297ffx003j1rrcvbc597e7	Unknown	Test Client128	\N	JO	1234568017	[object Object]	Client Street128	2024-12-24 09:18:37.293	2024-12-24 09:18:37.293	af07a31a-0c02-4a2f-8a8e-b556841ab4a6	d6663167-e873-4ab3-87de-6ec72595005d
cm5297ffz003k1rrc4ly2f72s	Unknown	Test Client129	\N	JO	1234568018	[object Object]	Client Street129	2024-12-24 09:18:37.296	2024-12-24 09:18:37.296	bab37763-d720-43e1-b4e3-3db32bb2b3b7	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fg2003l1rrc06vaxx04	Unknown	Test Client130	\N	JO	1234568019	[object Object]	Client Street130	2024-12-24 09:18:37.298	2024-12-24 09:18:37.298	fb4c625f-61a5-4d4f-9fea-145ac03aa300	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fg4003m1rrcj3555tle	Unknown	Test Client131	\N	JO	1234568020	[object Object]	Client Street131	2024-12-24 09:18:37.301	2024-12-24 09:18:37.301	dcc028d7-2a68-4484-bf2d-decf19b69bc1	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fg8003n1rrc93ola9du	Unknown	Test Client132	\N	JO	1234568021	[object Object]	Client Street132	2024-12-24 09:18:37.305	2024-12-24 09:18:37.305	019056ac-70b8-4ad7-8e8f-d65909236dbb	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fgb003o1rrckfd4qqw5	Unknown	Test Client133	\N	JO	1234568022	[object Object]	Client Street133	2024-12-24 09:18:37.307	2024-12-24 09:18:37.307	395e6af3-c173-448b-81be-8d36483fd9d0	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fgd003p1rrcsxffksna	Unknown	Test Client134	\N	JO	1234568023	[object Object]	Client Street134	2024-12-24 09:18:37.309	2024-12-24 09:18:37.309	2671c329-8c63-4bc4-95e5-faecb9e6ceb5	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fgg003q1rrcu86mo9ge	Unknown	Test Client135	\N	JO	1234568024	[object Object]	Client Street135	2024-12-24 09:18:37.312	2024-12-24 09:18:37.312	53dda409-19d5-442c-910a-5ef166e55a59	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fgi003r1rrcj6a6d1lp	Unknown	Test Client136	\N	JO	1234568025	[object Object]	Client Street136	2024-12-24 09:18:37.314	2024-12-24 09:18:37.314	b9ec072c-4f47-4538-83bb-ce7a480e762b	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fgl003s1rrc74gozcdn	Unknown	Test Client137	\N	JO	1234568026	[object Object]	Client Street137	2024-12-24 09:18:37.317	2024-12-24 09:18:37.317	14ce2c91-d4be-4585-8de2-beec3e728c46	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fgn003t1rrczola1a2r	Unknown	Test Client138	\N	JO	1234568027	[object Object]	Client Street138	2024-12-24 09:18:37.32	2024-12-24 09:18:37.32	1e5b9fa4-1d50-4083-95be-09e79c83d850	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fgq003u1rrc3q588bn9	Unknown	Test Client139	\N	JO	1234568028	[object Object]	Client Street139	2024-12-24 09:18:37.323	2024-12-24 09:18:37.323	907f7974-c525-42cd-8328-93adfe6aed37	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fgt003v1rrc5ag6u9wy	Unknown	Test Client140	\N	JO	1234568029	[object Object]	Client Street140	2024-12-24 09:18:37.325	2024-12-24 09:18:37.325	c6492d61-726d-4cc5-831f-e84735e307f9	d6663167-e873-4ab3-87de-6ec72595005d
cm5297fgv003w1rrci4qf7rqa	Unknown	Test Client141	\N	JO	1234568030	[object Object]	Client Street141	2024-12-24 09:18:37.328	2024-12-24 09:18:37.328	0db4220d-bc4b-4ccd-8886-903f39c49cd8	d6663167-e873-4ab3-87de-6ec72595005d
\.


--
-- Data for Name: EINV; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."EINV" (id, "EINV_RESULTS", "EINV_STATUS", "EINV_QR", "EINV_NUM", "EINV_INV_UUID", "invoiceId", "EINV_SINGED_INVOICE", "companyId") FROM stdin;
\.


--
-- Data for Name: Employee; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Employee" (id, "userId", "position", department, "hireDate", salary, "isActive", "createdAt", "updatedAt", name, "companyId") FROM stdin;
b495a6f7-9fbc-495a-b779-b4b08e16eeb1	\N	\N	\N	\N	\N	t	2024-12-17 00:06:07.225	2024-12-17 00:05:49.114	Test Account Manager	d6663167-e873-4ab3-87de-6ec72595005d
\.


--
-- Data for Name: GeneralLedger; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."GeneralLedger" (id, "accountId", balance, "updatedAt", "companyId") FROM stdin;
\.


--
-- Data for Name: InventoryMovement; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."InventoryMovement" (id, "productId", "warehouseId", "companyId", type, quantity, "costPerUnit", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Invoice; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Invoice" (id, uuid, "issueDate", "invoiceTypeCode", note, "documentCurrency", "taxCurrency", "companyId", "customerId", "taxExclusiveAmount", "taxInclusiveAmount", "allowanceTotalAmount", "payableAmount", "employeeId", "createdAt", "updatedAt", "sellerId", "buyerId", "userId", "isSubmitted", number, "InvoiceTypeCodeName") FROM stdin;
\.


--
-- Data for Name: InvoiceItem; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."InvoiceItem" (id, "invoiceId", name, quantity, "unitPrice", "discountAmount", "lineExtensionAmount", "taxAmount", "roundingAmount", "taxCategory", "taxPercent", "productId", "companyId") FROM stdin;
\.


--
-- Data for Name: JournalEntry; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."JournalEntry" (id, date, "createdAt", "updatedAt", "companyId") FROM stdin;
\.


--
-- Data for Name: Obligation; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Obligation" (id, "contractId", description, "revenueValue", fulfilled, "createdAt", "updatedAt", "companyId") FROM stdin;
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Product" (id, barcode, name, description, "costPrice", "salesPrice", "wholesalePrice", "avgPrice", stock, "reorderLevel", "isActive", origin, family, "subFamily", "taxRate", "discountRate", "profitMargin", location, packaging, "itemType", "imageUrl", "createdAt", "updatedAt", "companyId", "valuationMethod", category, nrv) FROM stdin;
a34de5a8-494b-49d2-8ae2-cb31677e4a1f	\N	Test Product	test product	0	2	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-17 00:00:01.388	2024-12-19 20:32:05.403	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
e9a5b198-1516-403c-9f33-a2ff6b838322	8006554020365	Barex Contempora For Colored Hair Conditioner	Barex	0	0.1	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
36642e1d-a9e5-43f5-8197-1f955205052d	8006554020268	Barex Contempora For Colored Hair Shampoo	Barex	0	0.1	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
1d0ed6f3-5227-4ea1-90d9-890f7439f700	8006554020312	Barex Contempora For Dry Hair Hydrating Mask	Barex	0	0.1	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
c63367d3-36c6-4a85-b778-94bec6bc080e	8006554020275	Barex Contempora For Dry Hair Hydrating Shampoo	Barex	0	0.1	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
2870d0db-0170-49d3-9e3e-83e6bdc7c3ed	8006554020329	Barex Contempora For Frequent Mask	Barex	0	0.1	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
bcc752e2-55d1-4816-8453-3ca4361ddce2	8006554020282	Barex Contempora For Frequent Use Shampoo	Barex	0	0.1	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
52f15b48-be00-4fb1-a021-a3463338c4f8	8006554020435	Barex Contempora For Frizzy Hair  Mask	Barex	0	0.1	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
3dbf1831-9672-4d64-b050-274559e8e9a4	8006554020428	Barex Contempora For Frizzy Hair Shampoo	Barex	0	0.1	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
7e0b6b7a-c748-4a75-9963-6d88985cf8a0	8006554018630	Barex Joc Color Protection Conditioner	Barex	0	0.1	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
962ac874-54fe-4d23-87f1-bb7393e412c0	8006554018616	Barex Joc Color Protection Shampoo	Barex	0	0.1	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
80b80b87-602c-4a7c-9823-24f84945bec3	8006554021388	Barex Joc Daily Defence Daily Wash Conditioner	Barex	0	0.1	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
ac253686-ca8b-463f-ad4c-5297c85bbd8e	8006554021364	Barex Joc Daily Defence Daily Wash Shampoo	Barex	0	0.1	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
6f345ac2-3267-4829-a450-3e4bf8754b6b	8006554021234	Barex Joc Re-Hydra Hydrating Conditioner	Barex	0	0.1	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
5eede2bb-b1f0-423d-8468-c45d1730e005	8006554021210	Barex Joc Re-Hydra Hydrating Shampoo	Barex	0	0.1	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
b76a0584-a248-4d40-8fb9-cb09e156001e	8006554021302	Barex Joc Satin Sleek Absolute Smoothness Cream	Barex	0	0.1	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
5b3fd995-b3fd-4026-89ec-8a81651a4942	8006554021272	Barex Joc Satin Sleek Smoothing Shampoo	Barex	0	0.1	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
67e858e7-e192-4867-844e-31a9929ab71f	7640137510046	Callys Serum Capilor 12 Ml	Callys	12.35	33.103	33.103	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
2317e017-70a7-4f14-ab50-c692f6c6d54a	306	Callys Serum Capilor 140 Ml	Callys	29.11	172.414	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
07b8e912-2a75-4d20-8e83-a2dd055974b5	7640137510039	Callys Serum Glycolagen 12 Ml	Callys	12.35	10	33	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
e9bff970-6f10-4707-a7cf-d1b1cb4bd006	307	Callys Serum Glycolagen 140 Ml	Callys	47.83	33.103	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
3a821819-24a8-411e-b2bf-eb3a4c1e2566	7640137510022	Callys Serum Hyaluron 12 Ml	Callys	12.35	10	33.103	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
c55766d3-eb4e-4c93-b351-0f4fdd759fa3	304	Callys Serum Hyaluron 140Ml	Callys	47.83	172.414	33.103	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
d1cb454d-0c15-473d-a226-2d7bba0040ad	7640137510138	Callys Serum Mist Hydra Booster 100Ml	Callys	0	48	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
11dca95e-3aac-45bc-bae5-8ef18e783623	7640137510015	Callys Serum Phytocell 12 Ml	Callys	12.35	10	33.103	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
42c82c3c-9e20-420b-ac21-e4333bf5ea3a	305	Callys Serum Phytocell 140 Ml	Callys	47.83	172.414	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
04075516-8826-4ea1-928f-df44916cece7	7640137510107	Callys Sublimize Eye Contour	Callys	7	10	25.862	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
8d6bae64-bc1d-4172-9f4b-c91c7250e72a	602	Dentrax Full Display	Dentrax	34	100	0.2	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
86af8590-c74b-4062-b6ca-8d594420de94	0631112765459	Dentrax Fx3 Water Flosser	Dentrax	30	60	55.172	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
dd420782-b23a-4c6d-b5ab-5c97b85feb9e	603	Dentrax Fx3 Water Flosser Offer	Dentrax	24.6	61.379	25	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
12976cc7-c9ff-41da-a8d0-16a92faefc15	001	Dentrax Stand	Dentrax	0	0.2	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
a340ebc5-4a5b-4000-96b4-e6a801db440c	0631112765497	Dentrax Tb3 Lite	Dentrax	0	26.9	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
d64d313c-61d4-47b6-abc4-cdee15c4d5b1	120813	Dentrax Tb3 Lite Offer	Dentrax	0	18.82	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
0e3064e4-2b5c-4243-a9bd-57f880f3d83b	0631112765480	Dentrax Tb3 Pro	Dentrax	0	61.379	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
c1478986-4871-4b29-9506-35ef0664b32e	120812	Dentrax Tb3 Pro Offer	Dentrax	0	42.96	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
996560a6-0d51-49ff-864a-b8f9ba9dbea2	3051	Ecodenta Bamboo Toothbrush Medium	Ecodenta	1.511	5.517	1.511	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
68f81962-0b4c-488c-9b07-8ee45315b75d	3052	Ecodenta Bamboo Toothbrush Soft	Ecodenta	1.511	5.517	1.511	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
ba95bb02-2e6a-4093-95af-bc9f5e2dbceb	250	Ecodenta Black Foam 150Ml	Ecodenta	2.58	4.821	7.5	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
fd9f4e18-dad1-4fbf-aae1-6a2fe7cbe3ff	201	Ecodenta Black Toothpaste	Ecodenta	3.3278	6.5	5	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
4ce5f022-ca0d-410b-b598-232c64a13675	205	Ecodenta Caris Toothpaste	Ecodenta	2.736	1.628	9	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
b25a58a5-f33d-4b26-a45f-ce61a8150b6c	501	Ecodenta Coconut Toothpaste	Ecodenta	2.48	4.821	8.5	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
b66ce599-1918-47e9-93dd-5c4fa9e93ec7	204	Ecodenta Enamel Toothpaste	Ecodenta	1.74	3.441	1.74	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
cfc0a10c-c302-4fe9-b4ad-b7e5eb0982f5	504	Ecodenta Juicy Fruits Kids Toothpaste	Ecodenta	2.232	1.5	7	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
dd3e3ade-1cbf-494a-b3b6-0449bd195ad6	203	Ecodenta Minty Toothpaste	Ecodenta	1.74	3.441	1.74	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
02466ca2-9a69-484c-b8d5-c1d65f60b585	503	Ecodenta Papaya Toothpaste	Ecodenta	2.48	4.821	9	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
3ace3701-0a71-4f84-a028-8edd3d8d2258	351	Ecodenta Refreshing Foam 150Ml	Ecodenta	2.58	4.131	7.5	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
3c1a8ab0-c0d3-4840-a14c-e81f74ba590d	350	Ecodenta Refreshing Foam 50Ml	Ecodenta	1.62	2.75	6.5	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
d4171dd0-0053-41d9-bece-58c34e68b895	502	Ecodenta Salt Toothpaste	Ecodenta	2.48	2.2	8.5	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
4408484f-23a2-454f-ba66-cb34a7e72460	550	Ecodenta Samples	Ecodenta	0.352	0.352	0.339	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
8f64783d-8d0c-46ab-8327-d668b10ad87b	202	Ecodenta Triple Force Toothpaste	Ecodenta	1.74	3.441	7	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
de32660a-10e5-41bb-9835-95f362120af6	8025337327127	Eslabondexx Color Maintainer Mask	Eslabondexx	0	16.552	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
582db7ed-d0d5-4196-8985-abc1ef9b1703	8025337326922	Eslabondexx No-Frizz Mask	Eslabondexx	0	16.552	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
ce929d95-ccc6-4091-9efa-273c45c0f13c	8025337326885	Eslabondexx No-Frizz Shampoo	Eslabondexx	0	13.448	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
a31bd1ea-e78b-42e4-af57-c3c32ef6fa0a	120804	Eslabondexx Restructuring Mask	Eslabondexx	29.7414	7.5	34.5	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
546cd21b-3d97-4161-b9d7-b933bcde9a0b	120803	Eslabondexx Restructuring Shampoo	Eslabondexx	16.8103	6.45	19.5	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
ba102d0f-163a-4ed6-82b2-5a98db0c0878	8025337316541	Guudcure Age Balance Bedtime Mask 50Ml	Guudcure	7.56	12.5	7.655	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
5ec985ba-a09b-4165-97c8-a638df85cdc5	116	Guudcure Age Balance Boosting Concentrate 15Ml	Guudcure	7	12.5	7.088	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
108c609d-0cdc-41ed-a422-cf627c42faef	8025337316442	Guudcure Age Balance Boosting Essence 150Ml	Guudcure	6.58	12.5	6.662	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
a87b9bc0-6329-4b99-beff-85a8a9c8d997	8025337316602	Guudcure Age Balance Duo Cleanser Toner 150Ml	Guudcure	4.06	9.35	3.827	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
2517181f-4399-4d9d-8419-45394733db5b	8025337317234	Guudcure Age Balance Duo Cleansing Micellar Gel 150Ml	Guudcure	3.78	7.5	4.109	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
8378bf01-6c77-4d75-b5f0-014ab5d2d69c	8025337316466	Guudcure Age Balance Eye Cream Gel 15Ml	Guudcure	5.46	12.5	5.528	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
bc200137-f6a2-4fc4-89b4-700269495593	8025337316503	Guudcure Age Balance Gravity Day Cream 50Ml	Guudcure	7.7	36	7.796	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
5e4b986c-b324-4b38-9957-6aa98d088245	8025337316480	Guudcure Age Balance Lift Serum 30Ml	Guudcure	6.86	12.5	6.946	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
eb2dd0f6-5116-4be1-a61e-2bb071592031	114	Guudcure Age Balance Night Oil 15Ml	Guudcure	5.55	12.5	6.033	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
f97d7b18-601d-4a9d-a923-828f9634abe8	8025337316527	Guudcure Age Balance Regenerating Night Cream 50Ml	Guudcure	7.56	12.5	7.655	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
457eb4c5-1ffa-4d60-8aa9-88238b6c26a8	8025337330233	Guudcure Make You Bb 10 Light	Guudcure	3.456	17.5	4.5	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
3c02c79d-5b29-49d2-b6cb-eabb48519a79	8025337330257	Guudcure Make You Bb 11 Medium	Guudcure	3.456	17.5	4.5	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
9bbade1c-30a4-45f1-ab49-f14ebcc8fda5	123	Guudcure Make You Glow Primer	Guudcure	2.808	12.5	2.826	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
06a58061-1350-41b9-9110-db74e93e3c0d	126	Guudcure Make You Glowing Volumizing Lips	Guudcure	3.024	12.5	3.044	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
b4df8ee5-93f9-4eb0-8450-4cca87b5cb1d	100032	Guudcure Make You Glowing Volumizing Lips	Guudcure	9.99	9.99	8.612	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
d9ae90d7-ee75-41f3-9478-2c5837488233	121	Guudcure Make You Lashes-Long	Guudcure	3.672	12.5	4.35	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
de102f81-f1ea-44a8-93d9-284b58890c89	120	Guudcure Make You Lashes-Up	Guudcure	3.456	12.5	4.35	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
40a14225-b43b-42e8-be6c-83d4135fc071	127	Guudcure Make You Luxe Drops	Guudcure	3.7512	12.069	5.388	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
eed76bdf-eba1-4040-827e-4d0866c09be4	122	Guudcure Make You Supreme Fixer	Guudcure	8.2758	12.5	8.276	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
fab8492e-6c8e-4b6b-9b06-0556a008158b	133	Guudcure Make You Vinyl Chroma Lips Blueberry	Guudcure	3.334	3.334	3.334	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
19b79a66-12ac-41b4-b043-65dcb2d71c61	130	Guudcure Make You Vinyl Chroma Lips Coral	Guudcure	3.334	3.334	3.334	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
e141798c-9c79-474c-b0b3-d78aee631cff	128	Guudcure Make You Vinyl Chroma Lips Nude	Guudcure	3.334	3.334	3.334	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
3c0b5479-83c0-46b7-bfc7-bef26105c07d	129	Guudcure Make You Vinyl Chroma Lips Peach	Guudcure	3.3344	3.3344	3.334	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
0ef10377-359a-49b0-aefe-55653f3f3328	132	Guudcure Make You Vinyl Chroma Lips Pruin	Guudcure	3.334	3.334	3.334	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
8cd94932-47ac-4e99-9580-f53fdbd97e24	131	Guudcure Make You Vinyl Chroma Lips Red	Guudcure	3.334	3.334	3.334	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
95f58c7b-59fc-4dc7-b5c8-e25122bf3428	106	Guudcure Pollution Free City Spray Solution 100Ml	Guudcure	3.36	8.276	3.427	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
41f44324-9970-411a-b9e8-b1d4da479568	8025337304579	Guudcure Pollution Free Cleansing Milk 150Ml	Guudcure	3.64	14.5	0.01	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
1b2681f8-97b5-4acf-ba7a-cfe349cb56d9	107	Guudcure Pollution Free Face Urban Shield 100Ml	Guudcure	3.92	16.552	3.998	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
2236e08c-8adf-4731-998c-0d6615cb1861	8025337304530	Guudcure Pollution Free Hair &Body Shower Gel	Guudcure	0	15	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
dad85fee-c183-4eb4-9624-a914f89cf40b	8025337304609	Guudcure Pollution Free Micellar Water 150Ml	Guudcure	3.36	14.5	1.826	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
d5f245f2-458f-4f2f-aba0-b91e040dc10f	108	Guudcure Pollution Free Open Air Cream 50Ml	Guudcure	4.2	26.5	4.376	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
227b8514-b596-4fdf-90c3-cf86fea89b49	103	Guudcure Pollution Free Peeling Mask 150Ml	Guudcure	4.06	18	7.55	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
4258fea2-a428-4b16-84dd-144b47a7ea24	119	Guudcure Pollution Free Presentation Box	Guudcure	25	100	25.5	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
fe92216f-8ecf-445f-9e51-78924cc63d63	101	Guudcure Pollution Free Restoring Night Serum 30Ml	Guudcure	4.9	16.897	2.663	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
23ad5a0a-3cbe-44da-8d41-03ab8fb6233a	102	Guudcure Pollution Free Urban Cream H24 50Ml	Guudcure	4.9	25	2.663	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
2b6366d3-180a-4af0-a7f9-f9b512396476	8025337339663	Guudcure Sani Honey Conditioner	Guudcure	2.446	14.5	7.5	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
8fdf5365-062f-4f71-aef0-0b517afd5b7c	804	Guudcure Sani Honey Face Cream	Guudcure	4.348	24	5.65	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
cdcf3238-fd73-4dbb-baaf-68a9ed05ebf4	120809	Guudcure Sani Honey Face Fluid 50Ml	Guudcure	0	24	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
de1d2d6d-6ce0-46fe-97df-88e521709872	805	Guudcure Sani Honey Face Liquid	Guudcure	3.804	12.5	5.65	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
f1711a25-a96b-4fd1-be05-fbbc75cee8f0	803	Guudcure Sani Honey Hand Spray	Guudcure	1.631	10	1.9	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
4cf2824e-6a3e-4b5e-9733-04ac842d775d	8025337339786	Guudcure Sani Honey Liquid Soup	Guudcure	1.989	12.5	2.5	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
544aa5bc-5f15-4667-8164-cf231e02ef11	8025337339649	Guudcure Sani Honey Shampoo	Guudcure	2.359	14.5	7.5	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
f0f109b1-2473-45a8-a3b2-db82113f3309	8025337339724	Guudcure Sani Honey Shower Gel	Guudcure	2.174	12.5	4.5	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
3e6fa93b-d4f6-4d8b-a2a7-2bca37e435a1	710	Hollywood Fashion Boot Straps	Hollywood	2.75	3.017	2	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
61b36849-9d68-4ae9-965a-303126e46f3a	714	Hollywood Fashion Bra Converting Clip 2Ct	Hollywood	1.4	4.48	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
17a52a68-3d8d-4177-a8d1-70a78661020b	719	Hollywood Fashion Bra Converting Clip 4Ct	Hollywood	2.25	6.2	3	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
dae0f506-4746-4ef8-8fe8-aac415db4f8e	715	Hollywood Fashion Breast Lift Tape	Hollywood	3.5	3.448	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
3adcafcb-aacb-489d-bb41-9cc615bf6dac	712	Hollywood Fashion Clear Bra Straps	Hollywood	1.5	3.535	1.5	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
fe99cb20-cf17-4373-82a1-bd93f90e9292	706	Hollywood Fashion Deodorant Removing Sponge	Hollywood	2	2.155	1.5	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
d4b9fb09-4ca6-4830-a875-9bd99fa82ea9	704	Hollywood Fashion Garment Shields	Hollywood	2.5	6.2	2.5	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
0a99fdb6-666a-4810-941c-abce6ad768cf	708	Hollywood Fashion Hip Hugger Black	Hollywood	2.15	6.2	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
84b3229a-d231-4f6a-b580-f87d2a844d92	709	Hollywood Fashion Hip Hugger Navy	Hollywood	2.15	6.2	3.5	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
a9fddbef-2a02-4f64-8109-d5519052819b	705	Hollywood Fashion Lint Removing Sheets	Hollywood	1.2	1.724	1.25	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
74e73798-c3fb-4498-8e05-0137233f1670	720	Hollywood Fashion No Show Concealers	Hollywood	3.5	3.448	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
3b37393d-ffb6-4c71-a1d0-5c462c9fe6eb	722	Hollywood Fashion Shoe Comfort Kit	Hollywood	3.95	4.741	2.5	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
2412ed57-ad55-44b2-ba74-6e575c1dc12a	713	Hollywood Fashion Silicone Breast Enhancers	Hollywood	5.95	10.345	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
fa7c7a06-563a-4ca3-a4d4-2729a71cfd02	718	Hollywood Fashion Silicone Cover Dark	Hollywood	3.95	3.879	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
1761ce89-0f26-4f6b-bc72-9a592e53ef74	717	Hollywood Fashion Silicone Cover Light	Hollywood	3.95	8.62	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
30539d48-dbd8-4dfe-aaec-cddaf7357365	716	Hollywood Fashion Silicone Cover Med	Hollywood	3.95	8.62	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
ac45d273-9df2-46b7-b7c3-71718de228cb	721	Hollywood Fashion Style Emergency Kit	Hollywood	4.75	4.31	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
b70fd49f-2e81-4914-8207-3f481527994a	120810	Hollywood Fashion Stylette Black	Hollywood	0	8.621	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
bac894fc-ab2d-49b7-88ab-b60c8474c3ae	120811	Hollywood Fashion Stylette Pink	Hollywood	0	8.621	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
5c042340-b4ca-4207-87d8-60ee43e233ff	711	Hollywood Fashion Sweater Saver	Hollywood	1.3	2.155	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
687df59c-e48f-417e-958e-5e9f855c7d12	701	Hollywood Fashion Tape 18 Ct Flat	Hollywood	1.45	2.75	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
6bd79f6f-5e94-4a91-9183-ce0acda0992b	702	Hollywood Fashion Tape 36 Ct Flat	Hollywood	1.45	2.155	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
a833fd7f-1ac9-4b78-a2fa-1f65244b417e	703	Hollywood Fashion Tape Shapes	Hollywood	5.4	4.31	3	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
57fff1a7-8ad9-41cf-a210-bce579635db2	707	Hollywood Fashion Temporary Hem Tape	Hollywood	2.8	3.017	0	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
ad17eb21-8377-43ea-8e59-ee8397b5c123	4770001004494	Kili.G Anti Acne Face Cream	Kili.G	1.7	2.228	2.228	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
158bbff2-7d5b-44a0-a5a2-1d1b544e0c68	4770001004500	Kili.G Anti Acne Face Wash Foam	Kili.G	1.67	3.37	15	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
70b01f38-7bac-42d2-9dbb-c40da15d47f6	4770001004418	Kili.G Anti Acne Micellar Water	Kili.G	0.01	2.575	8.276	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
2e47a237-5874-49aa-ba93-8a6619f1634c	4770001000243	Kili.G Clean & Fresh Cleansing Gel	Kili.G	1.41	8	1.849	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
4e913245-7b75-4d4d-b197-228d4170a89f	4770001000250	Kili.G Clean & Fresh Face Scrub	Kili.G	1.06	1.391	1.391	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
37a60da6-0660-4b05-a1b0-5079bbbf153e	4770001005200	Kili.G Clean & Fresh Micellar Water	Kili.G	1.61	1.62	1.62	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
1e980f12-573b-4b32-9c55-978651aac68d	4770001004791	Kili.G Vitamin Bomb Face Serum	Kili.G	3.68	4.968	20	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
72ef6149-7b30-4217-a0df-2140590aa774	4770001005545	Kili.G Vitamin Bomb Face Serum Sample	Kili.G	0	0.01	0.01	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
2b799272-2e77-4733-a09c-35deec12f033	4770001004821	Kili.G Vitamin C 2 In 1 Face Wash/Mask With Aha	Kili.G	2.31	3.038	3.038	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
9e887bbb-95bc-4e4d-abf0-aadcf8da0184	4770001000120	Kili.G Vitamin C Eye Gel	Kili.G	1.7	2.228	15	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
5e1a8e39-2c7c-4c1e-a204-00d45f84fab9	4770001000106	Kili.G Vitamin C Face Cream	Kili.G	12.5	2.228	2.228	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
2e44ee13-1184-4839-b843-f1ac9d570562	4770001000113	Kili.G Vitamin C Face Serum	Kili.G	1.7	2.228	10	0	0	\N	f	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
4d85798d-fba8-4ba0-b60a-0e38887c0e46	667820024007	Toppik Brow Fibers Dark Brown	Toppik	6.5	17.241	17.5	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
956be697-f01e-4201-be99-b800644c10ad	667820024021	Toppik Brow Fibers Light Brown	Toppik	6.5	17.241	8.082	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
66c24b6e-c9c1-4a61-8817-3ebbf31444f1	667820024014	Toppik Brow Fibers Medium Brown	Toppik	6.5	17.241	17.5	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
5ece6ece-8e0e-4f70-91ba-72d8b7eaebbf	667820200074	Toppik Conditioner	Toppik	5.25	9.655	14	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
81fca861-8b6a-48d9-ab77-10522dc37be8	667820112001	Toppik Fiberhold Spray	Toppik	4	11.035	11.034	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
ce0d48fe-7c4d-4569-9a30-ffe66a7e2885	667820011007	Toppik Hair Building Fibers Auburn 12 G	Toppik	5.2	22.069	16	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
eaebd6eb-9104-4c81-9799-491b67bcce20	667820012004	Toppik Hair Building Fibers Auburn 27.5 G	Toppik	5.23	34.482	25	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
e087bdd9-6c06-402b-a61b-7622a731027c	667820011014	Toppik Hair Building Fibers Black 12 G	Toppik	5.248	22.069	22.5	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
00d67db6-09a8-44f0-8d9d-f69c4ad60711	667820012011	Toppik Hair Building Fibers Black 27.5 G	Toppik	8.57	35	35	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
5306def5-8993-498f-bea7-7a412529ea17	667820013018	Toppik Hair Building Fibers Black 55 G	Toppik	14.51	59	42.5	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
e8c61947-78f6-499a-8bd6-b1217628dca3	667820011021	Toppik Hair Building Fibers Dark Brown 12 G	Toppik	5.248	22.069	27.586	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
557a92e3-9da4-4796-8e52-c173e6591d76	667820012028	Toppik Hair Building Fibers Dark Brown 27.5 G	Toppik	8.57	34.483	35	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
f7acf64c-3c20-472f-93a3-6efbd6824e66	667820013025	Toppik Hair Building Fibers Dark Brown 55G	Toppik	13.996	70	59	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
2f51dc20-3f5a-46da-893b-a1a6a14d1576	667820011069	Toppik Hair Building Fibers Gray 12 G	Toppik	5.2	22.069	10.78	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
df1bb85c-a396-4918-96cf-add37ba68a68	667820011052	Toppik Hair Building Fibers Light Blonde 12 G	Toppik	5.2	22.069	22.4	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
7f5a54aa-2b96-49ca-9e39-1d7028ee3611	667820011045	Toppik Hair Building Fibers Light Brown 12 G	Toppik	5.062	22.069	11.494	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
c900640f-e021-450f-8867-25fe6658fe83	667820012042	Toppik Hair Building Fibers Light Brown 27.5 G	Toppik	8.5	40	30.172	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
cb720ca6-b331-4ad1-b1c4-7ef1ca74273c	667820013049	Toppik Hair Building Fibers Light Brown 55 G	Toppik	14.5	58.621	73.276	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
a73d3e47-b730-45c3-9c51-9d021786a16f	667820011083	Toppik Hair Building Fibers Medium Blonde 12 G	Toppik	5.2	22.069	11.494	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
064997dd-a12c-4cfa-b5bd-d891600ee023	667820011038	Toppik Hair Building Fibers Medium Brown 12 G	Toppik	5.062	22.069	22	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
1898db27-5988-4f13-a5ff-98212d3217d3	667820012035	Toppik Hair Building Fibers Medium Brown 27.5 G	Toppik	8.267	34.4835	28.594	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
2392087a-03af-464c-9aca-092260ab7bff	667820013032	Toppik Hair Building Fibers Medium Brown 55 G	Toppik	13.996	58.62	43.103	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
d92eac5b-8de5-452c-aee7-bc67ddbd9d5a	667820200098	Toppik Hair Fattener Serum	Toppik	3.8	14	10	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
8494fcac-6d34-4196-b089-d60abdb3f925	667820200272	Toppik Hair Perfecting Duo Kit	Toppik	3.354	12.069	3.259	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
33647e32-5002-4f4e-9b02-f0c0c725bd56	667820025011	Toppik Root Touch Up Spray Black 50Ml	Toppik	0	0	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
ddbcf294-b22b-439a-ab3d-88820858e58f	667820200623	Toppik Root Touch Up Spray Black 98Ml	Toppik	0	0	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
72be5b2c-9ec8-457e-b016-12b5cf5aaa8b	667820025028	Toppik Root Touch Up Spray Dark Brown 50Ml	Toppik	0	0	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
40b8e084-5f66-4387-940f-553c767740bc	667820200630	Toppik Root Touch Up Spray Dark Brown 98Ml	Toppik	0	0	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
52d1f3b9-b0fa-4016-9dae-faf7deb5833d	667820025035	Toppik Root Touch Up Spray Med Brown 50Ml	Toppik	6	0	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
0b2a1341-c627-47e6-81da-30f23a961a29	120808	Toppik Root Touch Up Spray Med Brown 98Ml	Toppik	0	0	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
f4509e3e-9237-4805-bf0b-a5794ee5c21f	667820200067	Toppik Shampoo	Toppik	6	9.654	10.775	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
c4aaa348-967f-4021-91bc-48b17e7aa114	55	Toppik Stand	Toppik	0	120	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
e71ac50e-3592-4747-aaac-26e87dd5a717	00667820810006	Toppik Tester Black	Toppik	1.6827	0	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
42f1c1bb-f1cf-417f-9165-918481486027	00667820800021	Toppik Tester Dark Brown	Toppik	1.6827	0	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
b757663f-7491-4a76-8231-d1caa0a6655a	0067820800052	Toppik Tester Light Brown	Toppik	1.6827	0	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
e1b0e4f0-5b89-41c0-a7e9-3f945f8b9174	00667820800069	Toppik Tester Med Brown	Toppik	1.6827	0	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 09:14:15.913	2024-12-22 09:14:15.913	d6663167-e873-4ab3-87de-6ec72595005d	FIFO	\N	\N
0c5e9d3b-6320-4fb5-a91d-ea433bb7f80c	700	Ecodenta Bamboo Toothbrush Soft	Ecodenta	2.5	1.5	3.448	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:33:00.408	2024-12-22 10:33:00.408	0eacb1fe-7f64-4679-a5a3-251bda8e70a7	FIFO	\N	\N
1e14165f-b90f-4e3e-a170-eea9f7b7d59b	4770001007204	Ecodenta Black Cinnamon Whitening Toothpaste	Ecodenta	0	5.172	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:33:00.408	2024-12-22 10:33:00.408	0eacb1fe-7f64-4679-a5a3-251bda8e70a7	FIFO	\N	\N
abd71a86-df03-4ebe-bc35-a6751558fb84	631112765473	Ecodenta Black Offer	Ecodenta	5.172	5.172	2.08	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:33:00.408	2024-12-22 10:33:00.408	0eacb1fe-7f64-4679-a5a3-251bda8e70a7	FIFO	\N	\N
5432a1b1-3f90-40f5-8fe9-b9c546068439	4770001003367	Ecodenta Black Orange Whitening Toothpaste 	Ecodenta	0	5.172	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:33:00.408	2024-12-22 10:33:00.408	0eacb1fe-7f64-4679-a5a3-251bda8e70a7	FIFO	\N	\N
8e161a52-96d7-46b3-aefb-04161371a9dc	4770001336991	Ecodenta Black Toothpaste	Ecodenta	1.8	5.1724	7.5	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:33:00.408	2024-12-22 10:33:00.408	0eacb1fe-7f64-4679-a5a3-251bda8e70a7	FIFO	\N	\N
a2e886a4-3ba2-4895-9ffb-b8294d3883ea	4770001000731	Ecodenta Caries Fighting Toothpaste	Ecodenta	0	4.828	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:33:00.408	2024-12-22 10:33:00.408	0eacb1fe-7f64-4679-a5a3-251bda8e70a7	FIFO	\N	\N
58ce199c-c2c0-4f59-b087-c99ef6dc26ec	4770001336762	Ecodenta Coconut Toothpaste	Ecodenta	0	0	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:33:00.408	2024-12-22 10:33:00.408	0eacb1fe-7f64-4679-a5a3-251bda8e70a7	FIFO	\N	\N
170342a5-2acf-48a6-842f-56eaf561caab	301	Ecodenta Coconut Toothpaste	Ecodenta	2.235	5.172	6.466	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:33:00.408	2024-12-22 10:33:00.408	0eacb1fe-7f64-4679-a5a3-251bda8e70a7	FIFO	\N	\N
682c825a-0794-492e-9966-a5dca68d7649	4770001001400	Ecodenta Juicy Fruits Kids Toothpaste	Ecodenta	2.232	5.1724	5.172	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:33:00.408	2024-12-22 10:33:00.408	0eacb1fe-7f64-4679-a5a3-251bda8e70a7	FIFO	\N	\N
56ca6618-ac7c-422d-90a2-861b42d6ed72	4770001336465	Ecodenta Melon Toothpaste	Ecodenta	0	0	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:33:00.408	2024-12-22 10:33:00.408	0eacb1fe-7f64-4679-a5a3-251bda8e70a7	FIFO	\N	\N
e6c480bf-52b2-4522-a8fb-301b515bed43	4770001337011	Ecodenta Minty Toothpaste	Ecodenta	2	5.172	3.017	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:33:00.408	2024-12-22 10:33:00.408	0eacb1fe-7f64-4679-a5a3-251bda8e70a7	FIFO	\N	\N
e36bbeed-d185-4b76-ae8d-1c740c37ce4a	4770001336779	Ecodenta Papaya Toothpaste	Ecodenta	0	0	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:33:00.408	2024-12-22 10:33:00.408	0eacb1fe-7f64-4679-a5a3-251bda8e70a7	FIFO	\N	\N
ee7f21e2-d6dd-4202-9ee9-4233519c1704	4770001002117	Ecodenta Probiotics Toothpaste	Ecodenta	0	0	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:33:00.408	2024-12-22 10:33:00.408	0eacb1fe-7f64-4679-a5a3-251bda8e70a7	FIFO	\N	\N
e90eb7cb-1f07-4473-9b26-178bf184bfbb	4770001334591	Ecodenta Raspberry Toothpaste Kids  75Ml	Ecodenta	5.172	5.172	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:33:00.408	2024-12-22 10:33:00.408	0eacb1fe-7f64-4679-a5a3-251bda8e70a7	FIFO	\N	\N
41fde36a-2229-4d29-a3fb-3e4a43d97342	151	Ecodenta Refreshing Foam 150Ml	Ecodenta	2.5	2	5.603	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:33:00.408	2024-12-22 10:33:00.408	0eacb1fe-7f64-4679-a5a3-251bda8e70a7	FIFO	\N	\N
ec790a36-0a7c-442c-8d8c-dcbf848b27d2	150	Ecodenta Refreshing Foam 50 Ml	Ecodenta	2.25	4.138	6	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:33:00.408	2024-12-22 10:33:00.408	0eacb1fe-7f64-4679-a5a3-251bda8e70a7	FIFO	\N	\N
728a11db-5074-456a-b2f0-957c92037e2a	4770001334706	Ecodenta Refreshing Wihtening Toothpaste	Ecodenta	0	0	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:33:00.408	2024-12-22 10:33:00.408	0eacb1fe-7f64-4679-a5a3-251bda8e70a7	FIFO	\N	\N
3da52a2a-5d32-4491-a5d6-5f93fed506a6	4770001002179	Ecodenta Salt Toothpaste	Ecodenta	0	5.172	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:33:00.408	2024-12-22 10:33:00.408	0eacb1fe-7f64-4679-a5a3-251bda8e70a7	FIFO	\N	\N
a0cde8cf-2b02-46f3-80a2-3365a826aae5	4770001331743	Ecodenta Straberry Kids Thoothpaste	Ecodenta	0	5.172	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:33:00.408	2024-12-22 10:33:00.408	0eacb1fe-7f64-4679-a5a3-251bda8e70a7	FIFO	\N	\N
78f40821-2052-465b-840f-1c5c70adb1c1	4770001331903	Ecodenta Triple Force Toothpaste	Ecodenta	0	5.172	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:33:00.408	2024-12-22 10:33:00.408	0eacb1fe-7f64-4679-a5a3-251bda8e70a7	FIFO	\N	\N
4e4e2539-afa8-49a9-8315-0d58d5f5af7f	4770001000999	Kili.G Vitamin C Gift Set	Kili.G	0	27.4	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:33:00.408	2024-12-22 10:33:00.408	0eacb1fe-7f64-4679-a5a3-251bda8e70a7	FIFO	\N	\N
104ff1d3-94da-4388-88fe-e85df9622463	5943000072255	Aslavital Anti-Wrinkle Treatment Serum	Aslavital	4.488	24.828	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
a5060ca0-a900-49ce-b9e2-0a116c5e46cb	5943000103393	Aslavital Clay Powder Treatment	Aslavital	2.074	10.34	9.052	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
c5ded3c3-d07e-4282-9023-d4be2615fa2f	5943000103379	Aslavital Colagen Ampoules	Aslavital	8.687	33.793	8.293	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
9a3b6a7e-99e8-4713-b90c-a3efd5cdeb04	100037	Aslavital Deep Purifying Mask	Aslavital	8.687	12.069	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
1f5bacd1-2747-48f7-bef2-fbaf61efda50	5943000072217	Aslavital Eyes And Lips Cream	Aslavital	3.927	24.828	21.552	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
eba00eca-1304-4d1c-adae-760eeb6b1ecd	5943000072231	Aslavital Ultra-Active Lift Cream	Aslavital	5.44	24.828	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
cd9e4144-c3a6-481d-849a-be7f433cdd47	5201580920909	Coverderm Camouflage Classic No 0	Coverderm	6.204	26	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
d2265a7f-6d38-4d6a-9dbe-ee222ed2a53b	5201580921906	Coverderm Camouflage Classic No 1	Coverderm	6.204	17.931	15.517	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
9f933600-0681-4649-9949-0652bcb5215c	5201580922903	Coverderm Camouflage Classic No 2	Coverderm	6.204	17.931	7.744	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
df80d090-00a9-4a03-8ac8-187abc54e427	5201580923900	Coverderm Camouflage Classic No 3	Coverderm	6.204	17.931	7.744	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
51f91af4-60a3-4df1-a781-7be07c2f243c	5201580243909	Coverderm Camouflage Classic No 3A	Coverderm	6.204	17.931	12.931	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
e3d9b579-f43d-45d8-9994-80d2f269222c	5201580924907	Coverderm Camouflage Classic No 4	Coverderm	6.204	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
352f8de1-9d0e-4f78-9cc2-cb7498830533	5201580925904	Coverderm Camouflage Classic No 5	Coverderm	6.204	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
fe37cf42-f09a-483a-ac9c-fe74b7c97d33	5201580243930	Coverderm Camouflage Classic No 5A	Coverderm	6.204	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
858b7218-94ed-4a6d-bcc6-80246093dd6f	5201580926901	Coverderm Camouflage Classic No 6	Coverderm	6.204	17.931	17.241	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
03b834ef-a4c5-4e9e-8a95-7649cee779ac	5201580927908	Coverderm Camouflage Classic No 7	Coverderm	6.204	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
b490d2a6-b59a-4909-9413-a16713136df2	5201580928905	Coverderm Camouflage Classic No 8	Coverderm	6.204	17.931	6.34	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
eeff85dd-458e-4e28-83b4-d98adafb2df1	5201580929902	Coverderm Camouflage Classic No 9	Coverderm	6.204	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
0c1d626a-2314-4718-88b1-60b734f26002	5201580941232	Coverderm Camouflage Compact Powder D1	Coverderm	6.127	15.862	13.793	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
f018d163-5e7b-471f-9354-dd08d5201954	5201580945230	Coverderm Camouflage Compact Powder D1A	Coverderm	6.127	15.862	11.494	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
49d6e42f-00cd-41b2-9abe-66543997c19c	5201580942239	Coverderm Camouflage Compact Powder D2	Coverderm	6.127	15.862	9.914	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
9e5cd921-96b6-480c-8033-315446110df5	5201580943236	Coverderm Camouflage Compact Powder D3	Coverderm	6.127	15.862	6.127	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
31fbb7f8-eae7-49e7-9732-45ad9481dd3a	5201580944233	Coverderm Camouflage Compact Powder D4	Coverderm	6.127	15.862	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
73c64121-f3e4-4496-a229-986b5cbc1c0f	5201580946237	Coverderm Camouflage Compact Powder D4A	Coverderm	6.127	15.862	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
293bf0a0-1516-40fd-a405-1dcba9330765	5201580931233	Coverderm Camouflage Compact Powder N1	Coverderm	6.127	15.862	9.914	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
e6c7e498-71f9-47ff-92ad-f9d30447cbca	5201580935231	Coverderm Camouflage Compact Powder N1A	Coverderm	6.127	15.862	9.914	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
457bbd6d-952e-4754-9d3a-60f67000a0b0	5201580932230	Coverderm Camouflage Compact Powder N2	Coverderm	6.127	15.862	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
1e7676ad-4ba0-410b-8417-1941fb3c9acf	5201580933237	Coverderm Camouflage Compact Powder N3	Coverderm	6.127	15.862	12.575	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
a90fa7b9-5ce5-40fa-9d78-687427928f0a	5201580934234	Coverderm Camouflage Compact Powder N4	Coverderm	6.127	15.862	12.931	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
a566a976-5955-4708-88af-5f13e4c03a02	5201580936238	Coverderm Camouflage Compact Powder N4A	Coverderm	6.127	15.862	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
057457fe-21c2-4aa6-b3cc-fa4ca8d6c028	5201580951231	Coverderm Camouflage Compact Powder O1	Coverderm	6.127	15.862	13.793	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
e0bc99eb-9e2a-4eaa-9f57-b69515bbc33f	5201580955239	Coverderm Camouflage Compact Powder O1A	Coverderm	6.127	15.862	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
d7e3f4f0-0928-4d9a-a7a2-84a2e5be714b	5201580952238	Coverderm Camouflage Compact Powder O2	Coverderm	6.127	15.862	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
019cfc9e-75f1-494d-9905-d543b032e7be	5201580953235	Coverderm Camouflage Compact Powder O3	Coverderm	6.127	15.862	6.127	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
e8379721-9c45-4155-9321-cac121dfe6c8	5201580954232	Coverderm Camouflage Compact Powder O4	Coverderm	6.127	15.862	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
e886df7b-3a83-4c14-8749-03d7dbd0baac	2222	Coverderm Camouflage Compact Powder O4A	Coverderm	6.127	15.862	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
8e426c7d-7d9d-40c0-bb4c-ed66bf435c7a	5201580921203	Coverderm Camouflage Concealer No 1	Coverderm	3.916	11.724	9.914	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
58eb9e3e-ad94-4c9a-b793-0b7f890c5597	5201580922200	Coverderm Camouflage Concealer No 2	Coverderm	2.433	11.724	3.916	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
baa1668a-810d-430a-b0c3-2e2ee0c0e2d5	5201580923207	Coverderm Camouflage Concealer No 3	Coverderm	3.916	11.724	10.991	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
c8c714e5-6e04-4989-bc74-4a5a33e5e332	5201580924204	Coverderm Camouflage Concealer No 4	Coverderm	3.916	11.724	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
d1bb38e1-3f67-4108-b704-b068a1a347a6	5201580925201	Coverderm Camouflage Concealer No 5	Coverderm	3.916	11.724	3.916	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
65436ea8-2d20-47a8-b26e-ac2a1977946a	5201580926208	Coverderm Camouflage Concealer No 6	Coverderm	3.916	11.724	3.34	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
92160414-6d68-428c-93e8-a9eeccfda35b	5201580246009	Coverderm Camouflage Extra Care Lotion No 1	Coverderm	4.383	15.173	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
683d64ac-5ea0-4151-bcef-9cce1a7356ca	5201580247006	Coverderm Camouflage Extra Care Lotion No 2	Coverderm	4.383	15.173	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
8b816aa4-4628-4c69-9f23-c4ed8cfbead7	5201580254004	Coverderm Camouflage Finishing Powder	Coverderm	6.358	16.207	23.5	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
c1b5c314-7117-48a5-82f8-53cca3c29aad	5201580264010	Coverderm Camouflage Maskara	Coverderm	4.499	12.413	12.069	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
ddc8c646-c3d2-4f4a-bc3a-94a83b066d32	5201580901915	Coverderm Camouflage Perfect Face No 1	Coverderm	4.781	22.759	14.224	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
e893612f-af9b-4c9c-b952-99eae434bbf4	5201580902912	Coverderm Camouflage Perfect Face No 2	Coverderm	4.781	22.759	22.759	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
81af7caf-c134-43a1-b95f-aaa479ad1acd	5201580244289	Coverderm Camouflage Perfect Face No 28	Coverderm	7.744	22.759	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
287cfab9-564a-4045-802c-9791e133d891	5201580903919	Coverderm Camouflage Perfect Face No 3	Coverderm	4.781	22.759	12.931	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
feb4a037-2bad-4598-a4d0-a79802be3c77	5201580244302	Coverderm Camouflage Perfect Face No 30	Coverderm	7.744	22.759	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
c8dcab45-e09a-4640-8763-29436b643a8a	5201580244906	Coverderm Camouflage Perfect Face No 3A	Coverderm	4.781	22.759	6.6	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
1b20dda6-34fb-4112-b5f3-03e7ce3b48b6	5201580904916	Coverderm Camouflage Perfect Face No 4	Coverderm	7.744	22.759	7.744	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
d63fd946-5205-47e1-8354-11e06639ac0a	5201580905913	Coverderm Camouflage Perfect Face No 5	Coverderm	7.744	22.759	28.448	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
b2cd48a3-d914-43cd-9e6d-f6f5c2b4aa8f	5201580244937	Coverderm Camouflage Perfect Face No 5A	Coverderm	7.744	22.759	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
7441467a-1d5f-4f7b-b00a-2ed3e49d0ccc	5201580906910	Coverderm Camouflage Perfect Face No 6	Coverderm	7.744	22.759	28.448	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
c6ca7cde-4629-40e3-96c8-b619be7b6603	5201580907917	Coverderm Camouflage Perfect Face No 7	Coverderm	7.744	22.759	28.448	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
b0e1e3fb-c556-401a-9645-1a975dd70fd0	5201580908914	Coverderm Camouflage Perfect Face No 8	Coverderm	7.744	22.759	9.914	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
b7a0c35f-e602-40c2-a66c-f00371a5f35b	5201580909911	Coverderm Camouflage Perfect Face No 9	Coverderm	7.744	22.759	14.224	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
74256516-5b63-4e2a-b1a9-1c7753139daa	5201580265505	Coverderm Camouflage Perfect Legs Fluid No 50	Coverderm	9.955	26.206	9.955	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
fa72abaa-dc42-4c1e-9b01-9248fc54d683	5201580265536	Coverderm Camouflage Perfect Legs Fluid No 53	Coverderm	9.955	26.206	18.103	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
138c7f8f-3810-47e0-8d29-2edb1b99e2e7	5201580265567	Coverderm Camouflage Perfect Legs Fluid No 56	Coverderm	9.955	26.206	26.206	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
540db989-6bdd-42d5-81d8-0b81fd6df576	5201580265598	Coverderm Camouflage Perfect Legs Fluid No 59	Coverderm	9.955	26.206	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
8efc2424-92ab-4995-97c2-5ada2e7335ac	5201580265628	Coverderm Camouflage Perfect Legs Fluid No 62	Coverderm	9.955	26.206	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
9b684624-5585-4f4a-9020-cb1812f719d4	5201580265659	Coverderm Camouflage Perfect Legs Fluid No 65	Coverderm	9.955	26.206	9.955	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
9eaa0c37-c658-4a46-af70-da39a5ada7ac	5201580901922	Coverderm Camouflage Perfect Legs No 1	Coverderm	7.326	20	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
981c2c0e-85ee-41cc-be05-8b8b3f0702cd	5201580902929	Coverderm Camouflage Perfect Legs No 2	Coverderm	7.326	20	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
2fa798f7-82ea-4793-a0be-09dee7702843	5201580903926	Coverderm Camouflage Perfect Legs No 3	Coverderm	7.326	20	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
6d423e12-7353-4fd6-ac33-db7e55ec88a8	5201580904923	Coverderm Camouflage Perfect Legs No 4	Coverderm	7.326	20	17.241	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
e04f47e9-4d4c-4d02-b646-b8b6b8a44ba7	5201580905920	Coverderm Camouflage Perfect Legs No 5	Coverderm	7.326	20	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
dfd41cb2-4939-4861-b00f-2c56c69be4d5	5201580906927	Coverderm Camouflage Perfect Legs No 6	Coverderm	7.326	20	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
4e76fd51-0a49-47e7-ad93-224eb41919ef	5201580907924	Coverderm Camouflage Perfect Legs No 7	Coverderm	7.326	20	7.326	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
cad58967-f3a0-427f-b98c-b97770fe5d18	5201580908921	Coverderm Camouflage Perfect Legs No 8	Coverderm	4.508	20	18.966	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
65970177-78ed-436a-8675-9562acb813d1	5201580909928	Coverderm Camouflage Perfect Legs No 9	Coverderm	4.508	20	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
365f7f76-8cba-4af9-9cfd-244042f89184	5201580912140	Coverderm Camouflage Removing Cream 200Ml	Coverderm	4.815	15.862	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
a33f52bb-976d-42e6-8cd1-dd18f7d21c8f	5201580245019	Coverderm Camouflage Removing Cream 75Ml	Coverderm	2.34	9.655	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
e666c328-fdce-4e1c-b39d-cf4d0ed1ea7d	100034	Coverderm Camouflage Skin Basics	Coverderm	5.526	14.828	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
705e011e-5fa8-460b-bf45-07992a3c10b7	5201580912164	Coverderm Camouflage Skin Protector	Coverderm	4.329	14.828	9.914	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
51833f1e-3a05-47ea-8071-c798ab398aae	5201580268100	Coverderm Cc Cream For Eyes L Beige	Coverderm	5.423	13.793	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
ca220312-a982-4427-aca8-558f7ff073c7	5201580268117	Coverderm Cc Cream For Eyes S Brown	Coverderm	5.423	13.793	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
b7931bf7-db21-486d-8cb6-2f4c828f1610	5201580268018	Coverderm Cc Cream For Face L Beige	Coverderm	7.117	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
e7c3c7cf-1ba6-4d6b-88b5-59275e3be230	5201580268025	Coverderm Cc Cream For Face S Brown	Coverderm	7.117	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
daeb1bc1-bd79-4841-992e-a9c87834ac89	5201580439104	Coverderm Cc Cream Pack L Beige	Coverderm	7.117	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
36ee5b3d-1cb3-4a89-888b-9f6c9215dad3	5201580439111	Coverderm Cc Cream Pack S Brown	Coverderm	7.117	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
239320e8-a3f0-4f29-a3b3-d60ba1b48118	5201580242056	Coverderm Filteray After Sun	Coverderm	2.971	11.111	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
6f6aba2c-95e0-42da-94ea-845f45e9f224	5201580242322	Coverderm Filteray Body Plus Deep Tan Spray Spf 30	Coverderm	2.9214	11.111	9.746	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
db6ae530-5752-4374-a5af-30e5cd2f44f5	5201580242353	Coverderm Filteray Body Plus For Kids Spf 50+	Coverderm	3.207	11.65	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
5ead77ac-23d6-45c8-baef-31dedd5d808d	5201580242230	Coverderm Filteray Body Plus Milk Spf 50+	Coverderm	2.691	11.111	9.746	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
d434926d-edc7-4431-a878-c4e53c951835	5201580242438	Coverderm Filteray Body Plus Spray Spf 50+	Coverderm	3.034	11.655	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
07c82eb6-e9a0-41f7-874c-c9a58fa74c5e	5201580241639	Coverderm Filteray Face Plus Dry/Sensitive Spf 50+	Coverderm	2.784	13.333	11.494	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
85586b0b-c729-4c20-8f02-347744a9e018	5201580241646	Coverderm Filteray Face Plus Dry/Sensitive Spf 50+ Tinted	Coverderm	2.784	13.333	11.677	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
5d15de58-4c24-46b2-9382-5dd438fdd992	5201580241608	Coverderm Filteray Face Plus Normal Spf 50+	Coverderm	2.784	13.333	19.35	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
fc045c3f-6cb6-4932-be0a-ed61c30dbab5	5201580241615	Coverderm Filteray Face Plus Normal Spf 50+ Tinted	Coverderm	2.784	13.333	19.267	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
210eac97-f353-414a-bd8a-efa11eda2f92	5201580241660	Coverderm Filteray Face Plus Oily Spf 50+	Coverderm	2.784	13.333	19.35	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
7184d9c3-836c-4164-a9b4-9dd8ec3effd3	5201580241677	Coverderm Filteray Face Plus Oily Spf 50+ Tinted	Coverderm	2.784	13.333	19.35	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
0c30cf00-3aa2-4bb7-9cb8-cd9c1b2f5420	5201580241035	Coverderm Filteray Face Spf 60	Coverderm	4.672	16.551	24	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
76de2944-4353-4146-a6e3-9b933cea1bed	5201580241127	Coverderm Filteray Face Spf 60 Tinted	Coverderm	4.672	16.551	24	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
1e6609d4-5ae5-48ad-943c-0dae7a7ae307	5201580241042	Coverderm Filteray Face Spf 80	Coverderm	4.89	17.586	25.5	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
b4113dbc-b098-4df1-b8d7-fcc19775a628	5201580241134	Coverderm Filteray Face Spf 80 Tinted	Coverderm	4.89	17.586	25.5	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
901b92ef-03e0-41bb-8925-e71608a99d85	5201580267004	Coverderm Filteray Skin Repair	Coverderm	3.753	11.111	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
7e72d60b-1f6a-4615-a5a0-d9c6aed87e7d	5201580255018	Coverderm Luminous	Coverderm	11.628	43.448	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
3e557788-0904-4e83-a5cd-f4db17bad2a6	5201580233511	Coverderm Luminous Compact Powder No 1	Coverderm	4.485	17.241	25	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
14c48a95-4e75-43dc-ac73-80538a67fd4c	5201580233016	Coverderm Luminous Compact Powder No 1-New	Coverderm	7.315	17.241	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
f31a11c3-f664-4f69-a0d7-624d809275c0	5201580233023	Coverderm Luminous Compact Powder No 2	Coverderm	7.315	17.241	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
192f35ec-8f72-49f7-910e-ccdc8f2b1dcf	5201580233528	Coverderm Luminous Compact Powder No 2-New	Coverderm	7.315	17.241	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
35d77de8-05ec-4e5d-963a-a472344b48f6	5201580233535	Coverderm Luminous Compact Powder No 3-New	Coverderm	7.315	17.241	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
20e2f8a6-379a-4a42-b7d0-9a0bc5c2c703	5201580233047	Coverderm Luminous Compact Powder No 4	Coverderm	7.315	17.241	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
c89184f8-d19b-4aa8-834f-9e6e1a726cad	5201580233542	Coverderm Luminous Compact Powder No 4-New	Coverderm	0	17.241	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
aaacf587-cf08-4af6-9db5-13e5db7937a4	5201580233054	Coverderm Luminous Compact Powder No 5	Coverderm	7.315	17.241	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
27ec0eb3-20ec-4b0d-b674-4d80d0495865	5201580233559	Coverderm Luminous Compact Powder No 5-New	Coverderm	7.315	17.241	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
648a401a-1ff9-48e4-9ed9-9808d9b3b019	5201580233061	Coverderm Luminous Compact Powder No 6	Coverderm	7.315	17.241	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
14969fab-cc2f-4dab-a51a-cd288509fc3b	5201580240007	Coverderm Luminous Duo Pack	Coverderm	13.725	43.448	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
c791457d-9cd7-4bb6-bf69-7326a16551c3	5201580912287	Coverderm Luminous Exfolia	Coverderm	2.714	13.793	9.806	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
5232ae32-3551-4e62-b52e-fd7530bae476	5201580255049	Coverderm Luminous Eye	Coverderm	10.611	37.241	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
bb9f5df0-e500-427b-bbe1-45db26aad979	100019	Coverderm Luminous Gift Set	Coverderm	10.611	47.586	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
9a672a1c-58b5-42ab-ad12-e631e0db6337	5201580232019	Coverderm Luminous Make-Up No 1	Coverderm	7.117	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
543e4326-7764-4511-af32-970c302929ba	5201580232118	Coverderm Luminous Make-Up No 11	Coverderm	7.117	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
607061fa-b444-4651-bc57-53580036ed60	5201580232613	Coverderm Luminous Make-Up No 11-New	Coverderm	7.117	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
7ff65775-efb2-4139-8a06-8d97bc3d3664	5201580232125	Coverderm Luminous Make-Up No 12	Coverderm	7.117	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
eebb0d3d-09e3-4ff5-a80f-9be607d2b05a	5201580232620	Coverderm Luminous Make-Up No 12-New	Coverderm	7.117	17.931	6.259	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
be178b12-a773-462e-b414-2a6d99610963	5201580232132	Coverderm Luminous Make-Up No 13	Coverderm	7.117	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
eb77a3ca-f116-4ae3-b815-dbd11fac591f	5201580232637	Coverderm Luminous Make-Up No 13-New	Coverderm	7.117	17.931	12.931	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
9b7cb1a1-4717-4853-a797-4bd98924779b	5201580232514	Coverderm Luminous Make-Up No 1-New	Coverderm	7.117	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
a9bf7f7e-33f9-4789-8413-f1ced42b5fc3	5201580232026	Coverderm Luminous Make-Up No 2	Coverderm	7.117	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
6944a999-4f87-4471-b9ea-dc5cb1ece6e3	5201580232521	Coverderm Luminous Make-Up No 2-New	Coverderm	7.117	17.931	6.07	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
75abd022-1d5f-49ee-8473-90a561cd2f3c	5201580232033	Coverderm Luminous Make-Up No 3	Coverderm	7.117	17.931	11.207	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
4ce651de-ec2d-44a1-993e-add7b0e1763c	5201580232538	Coverderm Luminous Make-Up No 3-New	Coverderm	7.117	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
3f53678b-9d7e-487e-a273-aabc1e3ccfac	5201580232040	Coverderm Luminous Make-Up No 4	Coverderm	7.117	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
79980bd6-79ba-4e9a-9597-1cbd827e598d	5201580232545	Coverderm Luminous Make-Up No 4-New	Coverderm	7.711	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
8d11f4a0-a063-44bc-9283-28513a849471	5201580232057	Coverderm Luminous Make-Up No 5	Coverderm	7.117	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
d34d00dd-668c-4952-a62e-69cafd45a19f	5201580232064	Coverderm Luminous Make-Up No 6	Coverderm	7.117	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
7d3f1b1b-07ca-44f7-b561-a752863f23a0	5201580255032	Coverderm Luminous Serum	Coverderm	12.429	43.448	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
65d34d62-1b68-4a84-b818-caffc2abc42b	5201580257012	Coverderm Luminous Supreme	Coverderm	12.726	47	29.741	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
98d94650-9aba-4561-8e6a-dadfca0a03a6	5201580257043	Coverderm Luminous Supreme Eye	Coverderm	11.061	39.31	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
d6a10116-1811-405e-bc51-4cadc5420987	5201580257036	Coverderm Luminous Supreme Serum	Coverderm	12.834	47.586	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
99cf8a30-12b6-4e2d-9efa-a53a70a81e45	5201580257029	Coverderm Luminous Supreme Tri-Actif	Coverderm	13.797	47.586	16.863	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
453d44d2-335c-4c03-8701-7cb9e474b393	5201580255025	Coverderm Luminous Tri-Actif	Coverderm	10.522	43.448	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
5be8fae9-6dfe-4f48-bac1-be6d87c57be4	5201580249000	Coverderm Maxidrat Eye	Coverderm	7.83	25.862	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
ec1af6f3-7ff9-4eb1-89c4-bd2788692226	5201580250006	Coverderm Maxidrat Serum	Coverderm	8.37	27.586	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
874cdcc5-b918-4a85-91a9-866c5ccfb0aa	100033	Coverderm Maxidrat Visage Dry Skin	Coverderm	8.496	27.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
6bd8e376-e924-4d43-a696-cfd9e155eeca	5201580248027	Coverderm Maxidrat Visage Oily Skin	Coverderm	8.496	20	25.862	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
f7d015cf-3bed-4791-8b9f-c2771539594f	5201580248010	Coverderm Maxidrat Visgae Normal Skin	Coverderm	8.496	27.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
930b5303-afa0-4ecc-ac2d-6bd0d1a35fa6	5201580262511	Coverderm Peptumax Compact Powder No 1-New	Coverderm	7.117	17.241	10.345	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
657b2efc-b847-459b-8306-84f10d8cfe04	5201580262023	Coverderm Peptumax Compact Powder No 2	Coverderm	7.117	12.5	6.765	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
c2b09e80-7502-4742-8681-90715e6a335e	5201580262528	Coverderm Peptumax Compact Powder No 2-New	Coverderm	7.117	15	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
26af4dd2-e92a-46cf-9000-9157f055d103	5201580262030	Coverderm Peptumax Compact Powder No 3	Coverderm	7.117	17.241	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
7dec0ab2-29d4-458f-b2bb-72164e0e1d05	5201580262535	Coverderm Peptumax Compact Powder No 3-New	Coverderm	7.117	17.241	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
a0719ee0-79a0-44c0-93b0-61c5e46aa95d	5201580262047	Coverderm Peptumax Compact Powder No 4	Coverderm	7.117	17.241	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
d02d5d4c-4343-46a6-a7d3-e2aa83440327	5201580262054	Coverderm Peptumax Compact Powder No 5	Coverderm	7.117	17.241	14.655	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
d8067902-6b82-4115-9d2c-a5cb7ed0540d	5201580262061	Coverderm Peptumax Compact Powder No 6	Coverderm	7.117	17.241	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
e53baffa-3296-4733-9906-ac5b72306607	5201580263013	Coverderm Peptumax Concealer No 1	Coverderm	4.51	11.724	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
7de25192-1dd7-4011-94e7-860ff71951f3	5201580263518	Coverderm Peptumax Concealer No 1-New	Coverderm	4.51	11.724	9.914	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
c31c90c8-6074-43a1-8906-053dabde0120	5201580263020	Coverderm Peptumax Concealer No 2	Coverderm	4.51	11.724	14.655	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
b4f6df13-9c5b-439b-afcd-863f047619ab	5201580263525	Coverderm Peptumax Concealer No 2-New	Coverderm	4.51	11.724	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
6968f57c-a595-4779-9ef1-e3f1b7ce79bc	5201580263037	Coverderm Peptumax Concealer No 3	Coverderm	4.51	11.724	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
61a0168c-d1ad-45bf-b399-720a62ed5490	5201580263532	Coverderm Peptumax Concealer No 3-New	Coverderm	4.51	11.724	9.052	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
47f486c5-a9d2-4626-a94e-5594755a285f	5201580263044	Coverderm Peptumax Concealer No 4	Coverderm	4.51	11.724	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
ca51fe6c-0a90-43a1-b7a5-20b82747e7e7	5201580263549	Coverderm Peptumax Concealer No 4-New	Coverderm	4.51	11.724	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
c6a2d014-b385-4c3c-b6f1-a04a731e200d	5201580260029	Coverderm Peptumax Eye	Coverderm	9.441	34.483	13.649	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
761b13f1-9c24-4263-b45f-dc3c6b98e630	5201580260111	Coverderm Peptumax Eye E-Aging	Coverderm	7.632	34.483	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
0cbde14a-b39f-4f6b-9c4b-25aedaac8534	5201580260067	Coverderm Peptumax Eye E-Aging Tube	Coverderm	7.632	25.5	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
e493121d-9fe5-4a0f-a77b-529787f03d21	5201580261019	Coverderm Peptumax Make-Up No 1	Coverderm	6.941	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
97e71cec-4fa1-481b-9ee8-0834aa5137f0	5201580261613	Coverderm Peptumax Make-Up No 11-New	Coverderm	6.941	17.931	6.457	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
e46290e6-c0d9-43a9-809c-ac39ba0530aa	5201580261125	Coverderm Peptumax Make-Up No 12	Coverderm	6.941	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
85017627-dcf0-4020-a1ac-9a75e71d5faf	5201580261132	Coverderm Peptumax Make-Up No 13	Coverderm	6.941	17.931	15.517	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
10c96762-06a7-482f-b7c6-0c6b3a33c07a	5201580261514	Coverderm Peptumax Make-Up No 1-New	Coverderm	6.941	17.931	11.207	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
551179c8-ab1c-4820-ad3b-75668b92c576	5201580261521	Coverderm Peptumax Make-Up No 2-New	Coverderm	6.941	17.931	9.267	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
d85c17eb-f79b-4044-bb89-182a1d8d19fd	5201580261033	Coverderm Peptumax Make-Up No 3	Coverderm	6.941	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
d5017731-7c8f-467f-ae3c-f24ccab63ddb	5201580261538	Coverderm Peptumax Make-Up No 3-New	Coverderm	6.941	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
18748e16-72d5-4f23-a11a-aa7b2af74fc5	5201580261040	Coverderm Peptumax Make-Up No 4	Coverderm	6.941	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
bc6022ad-a19b-40d5-8af6-082498875179	5201580261057	Coverderm Peptumax Make-Up No 5	Coverderm	6.941	17.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
79d20445-0015-402f-8003-1be2b121b692	5201580261064	Coverderm Peptumax Make-Up No 6	Coverderm	6.941	17.931	26	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
66f039c4-3599-4a1e-87a9-7c58e57666b9	5201580260036	Coverderm Peptumax Serum	Coverderm	10.395	36.207	13.649	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
8a238013-744b-458f-b82b-03feaf1e3bde	5201580260128	Coverderm Peptumax Serum E-Aging	Coverderm	8.964	36.207	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
08e1c335-ec78-4427-b24e-0cb859894d41	5201580260074	Coverderm Peptumax Serum E-Aging Tube	Coverderm	7.632	30	3.698	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
94efc969-df55-4ac2-b8f0-7f3b1ce53a19	5201580260050	Coverderm Peptumax Visage E-Aging Tube	Coverderm	9.288	31	21.552	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
0229706d-9ee8-4858-9345-af55a7f7d475	5201580260012	Coverderm Peptumax Visage	Coverderm	10.845	39.31	13.649	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
fe22f2a7-b26d-49a0-9de4-6f57c1d260b5	5201580260104	Coverderm Peptumax Visage E-Aging	Coverderm	9.288	39.31	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
da754369-12bd-419e-94e2-d65281e8ec1d	5201580271001	Coverderm Skin Reverse Anti-Stress	Coverderm	5.148	20	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
2469f39a-519b-4f9e-bcce-885dbe5838d2	666	Coverderm Stand	Coverderm	0.1	0.1	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
561f7e44-a126-4b15-9ab7-f14e585a792c	5201580912263	Coverderm Vanish Day Cream	Coverderm	9.972	39.31	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
63315f75-272d-4a16-942f-416ac3e43bc8	5201580912270	Coverderm Vanish Eye	Coverderm	6.77	31.035	4.481	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
c85efd88-fd45-462f-9673-275080ec0156	100075	Coverderm Vanish Jam	Coverderm	8.991	0	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
79d3bf3d-0a19-4f91-80b0-1ee168440f68	5201580258002	Coverderm Vanish Night Cream	Coverderm	10.332	39.31	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
46519564-b662-418b-8b34-3487aefddaba	631112765459	Dentrax Fx3 Water Flosser	Coverderm	10.65	88.275	0.1	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
60e413d8-8eca-4810-acb2-cf3310d84d51	0631112765466	Dentrax Fx3 Offer	Coverderm	10.65	61.3793	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
de1f9c5a-3242-4513-bca2-44796b673a6b	50	Dentrax Stand	Coverderm	0.1	0.01	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
b7c31725-23cd-4e5b-9afe-09c91f47113f	4099702000650	Dentrax Tb3 Lite Offer	Coverderm	0	18.83	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
6a3bd230-5848-4139-82a5-e87169dd3686	4099702002449	Dentrax Tb3 Pro Offer	Coverderm	0	43	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
17b989c3-957f-4d8d-a9b8-0588dde85b84	5943000111473	Farmec Freckles And Spots Corrector	Coverderm	2.389	10.34	10.5	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
c6b05bb0-e389-4dd0-82bd-e945a292ce7c	5943000110537	Farmec Hand And Nail Cream	Coverderm	1.632	4.37	6.5	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
ad9b7041-1c2b-4148-beb5-354c8b74e8c5	5943000095070	Farmec Natural Hand And Nail Cream With Argan	Coverderm	1.632	4.37	6.5	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
c4caab34-60dd-499c-ab4b-fcd9efbf18bd	5943000111589	Farmec Nourishing Cream	Coverderm	2.0448	10.35	15	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
7b9ab0aa-7595-466d-82bc-ff45819eafb3	5943000094899	Farmec Whitening Cream	Coverderm	2.389	10.34	10.5	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
84492f38-60f3-4525-8916-fd218c0348fe	5943000096152	Gerovital H3 Evolution Anti- Wrinkle Cream Concentrated With Hyaluronic Acid	Coverderm	8.126	27.58	21.552	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
ee7536a8-7579-4b64-a9f3-533180910320	5943000094554	Gerovital H3 Evolution Concentrated Serum With Hyaluronic	Coverderm	11.076	34.48	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
0b73f250-1ed0-43e5-883b-1630a9f09ec8	5943000075065	Gerovital H3 Evolution Dark Spots Corrector	Coverderm	6.732	25.17	21.983	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
8d40b8b1-6bbd-4e6d-a4f2-5cf42a76467e	100052	Gerovital H3 Evolution Day & Night Offer	Coverderm	8.2	25.173	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
41fc5970-57fd-4430-99cd-99e989b7c5c2	100065	Gerovital H3 Evolution Gift Box	Coverderm	7.2	0	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
6fc47f3a-01f0-4903-af08-6002006c8db6	5943000100309	Gerovital H3 Evolution Hyaluronic Acid Ampoules	Coverderm	9.631	32.41	6.98	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
46ec9b5b-1caa-4030-be55-42008b21a0cb	100053	Gerovital H3 Evolution Hyaluronic Acid Ampoules Offer	Coverderm	13.463	32.414	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
6600dec4-9054-4e8a-9acf-3deb387df43e	5943000074952	Gerovital H3 Evolution Moisturizing Lifting Cream	Coverderm	6.732	25.17	36.5	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
9b8986d8-f478-42dc-afc7-2c98bcf56dab	5943000075041	Gerovital H3 Evolution Perfect Anti - Aging Serum	Coverderm	6.732	25.17	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
f70490e6-998d-49b5-bce0-f46f85637b26	5943000074976	Gerovital H3 Evolution Regenerating Lifting Cream	Coverderm	6.732	25.17	21.552	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
cacecfd3-bd2c-4744-b882-af91e8f9b197	5943000110414	Gerovital H3 Evolution Regenerating Lifting Cream-New	Coverderm	6.732	25.172	36.5	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
2aff0a0b-9f04-47b0-acda-5893bb144bdd	5943000077038	Gerovital H3 Evolution Wrinkle Correction Teartment	Coverderm	6.732	25.17	4.878	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
a6b35ab4-76c0-41d8-adde-c9212282edd4	5943000110452	Gerovital H3 Evolution Wrinkle Correction Teartment Eye And Lips	Coverderm	6.732	25.17	9.914	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
e25bc7ea-5bae-4828-b8d7-30caaec25696	100059	Gerovital H3 Retinol Advanced Regenerating Cream	Coverderm	6.732	22.069	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
735621ff-eeb1-4eda-aaef-59591c324f2e	100041	Gerovital H3 Retinol Anti-Wrinkle Eye Contour Cream	Coverderm	6.732	20.69	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
8b6bd685-b438-4960-88b5-3e2a953adc80	100060	Gerovital H3 Retinol Wrinkle Prevention Cream	Coverderm	6.732	22.069	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
d7884d4f-aa63-4ed1-b4bc-5b9a82bb2d6b	5943000087181	Gerovital Happiness Dark Cc Cream	Coverderm	2.25	10.37	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
5fb4683f-373c-4c73-9862-a38fd5732e06	100043	Gerovital Happiness Face Cleansing Gel Normal Skin	Coverderm	2.25	5.926	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
74ade39f-9eb3-4aaf-a991-2b0842067c20	100046	Gerovital Happiness Foaming Gel Cleanser (Oily Skin)	Coverderm	2.25	5.926	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
49c228be-1ba2-4568-a8d9-16fe95755c3e	100045	Gerovital Happiness Light Cc Cream	Coverderm	2.25	10.37	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
ed4e7482-48dd-4f84-a89e-b277801943ff	100051	Gerovital Happiness Medium Cc Cream	Coverderm	2.25	10.37	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
3a6b884b-f64c-45cd-9842-977893ff7006	100048	Gerovital Happiness Moisturizing Cream (Oily Skin)	Coverderm	2.25	8.889	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
a0857317-4039-41a2-925e-dba05384bc12	100044	Gerovital Happiness Moisturizing Mask Normal Skin	Coverderm	2.25	5.556	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
b0fcba16-2786-457d-81cf-4d70d3ce04d8	100050	Gerovital Happiness Peeling Mask Dry Skin	Coverderm	2.25	5.556	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
c7329fcb-125f-423a-ac77-5b084ade6559	100047	Gerovital Happiness Serum Illumination Effect	Coverderm	2.25	10.37	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
8e01da18-9b1e-44b2-93f3-57793e95738b	5943000112302	Gerovital Must Have Anti-Wrinkle And Firming Serum 10% Peptide	Coverderm	5.27	24.828	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
6297f2ec-1cf3-4171-becf-8c9aae126f3e	5943000112289	Gerovital Must Have Eye Contour Serum 3% Caffeine	Coverderm	5.27	24.828	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
eacf50cc-2b28-41e0-a36d-ee7ef31b1449	5943000112340	Gerovital Must Have Moisturizing Cream 1% Peptide	Coverderm	6.205	24.828	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
1a4256f7-42aa-439a-b626-48295af57c13	5943000112265	Gerovital Must Have Moisturizing Serum 10% Niacinamide	Coverderm	5.27	24.828	16	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
39427af7-934c-48e9-85d0-535f9c7244c2	5943000112326	Gerovital Must Have Peeling Serum 10% Aha	Coverderm	5.27	24.828	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
cd14793f-1ca7-400d-8d82-6ea9faaa8143	5943000112364	Gerovital Must Have Sorbet-Cream 2% Niacinamide	Coverderm	6.205	24.828	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
1e83c217-c5e3-4332-845b-dfdf87b48198	5943000104802	Gerovital Plant Anti-Wrinkle Concealer Cream	Coverderm	3.077	10.344	15	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
c89327f9-c4ec-4d0a-a7b6-1766c14e7721	5943000092253	Gerovital Plant Anti-Wrinkle Cream	Coverderm	4.514	17.24	25	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
addca54e-e645-4426-b8a2-6be0c03d8876	5943000104741	Gerovital Plant Anti-Wrinkle Cream-New	Coverderm	4.514	17.241	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
526b2416-2b26-415a-a9b5-bfa63314d057	5943000104789	Gerovital Plant Cc Cream	Coverderm	3.077	12.0689	17.5	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
877e3ef2-e503-47b6-a9e1-bf78156a3d38	5943000104703	Gerovital Plant Cleansing Fluid	Coverderm	2.975	10.34	2.626	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
40faad8a-762a-440a-a565-18bf3c298482	5943000092277	Gerovital Plant Contour Serum Eyes And Lips	Coverderm	3.077	11.724	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
852981e3-9745-4cf0-9d88-d79b534f1d05	100067	Gerovital Plant Gift Box	Coverderm	8.2	0	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
5813de69-a84b-4523-8f6d-a331d92b498b	5943000109883	Gerovital Plant Micelar Water 400Ml	Coverderm	3.655	12	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
72e903a7-2506-483a-a2b7-bd649407327e	5943000104666	Gerovital Plant Micellar Water	Coverderm	2.975	14	14	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
7307c468-4038-4126-b00f-7cad82a09754	5943000104727	Gerovital Plant Moisturizing Cream	Coverderm	4.514	17.241	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
3c0b44d0-5ce1-426f-89c4-4b5cd98f1af0	5943000092239	Gerovital Plant Moisturizing Cream 50Ml	Coverderm	4.514	17.24	17.241	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
da18ceb9-4eb7-4bd6-a4db-00fc63b85c94	5943000092291	Gerovital Plant Nourishing Cream	Coverderm	4.514	17.241	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
6eb466bf-c855-4af3-9394-be2dbf2838c8	5943000096251	Gerovital Stop Acnee Antimicrobial Foaming Gel	Coverderm	3.086	10.34	2.29	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
dec13326-2e3e-4054-9876-d9358592847d	100036	Gerovital Stop Acnee Antiseptic Lotion	Coverderm	2.865	8.276	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
949eadf8-e519-4262-b4d3-a2a3082dc69b	5943000096350	Gerovital Stop Acnee Cc Cream	Coverderm	2.865	12.0689	17.5	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
bc3caf08-42c9-4a58-b79a-64790a1a3675	100054	Gerovital Stop Acnee Kit Tratament	Coverderm	9.875	24.138	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
92e73632-c7b4-481b-93f8-3629b679d419	5943000105663	Gerovital Stop Acnee Purifying Fluid	Coverderm	2.865	9.65	2.19	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
8cc984ea-a967-46c8-87bb-7e0200eec062	5943000096275	Gerovital Stop Acnee Purifying Peel-Off Mask	Coverderm	2.533	10.344	5.55	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
f6ea1cbe-aa93-41f0-b9a8-9c100fc7fd69	5943000096312	Gerovital Stop Acnee Sebum Control Cream	Coverderm	2.865	10.517	7.65	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
51863753-75c4-472e-b213-c31aa2ccda79	5943000096336	Gerovital Stop Acnee Ultra-Active Cream	Coverderm	2.533	8.99	1.89	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
a3f57812-912d-48b2-9172-b4b0546081e5	100042	Gerovital Tonic Lotion	Coverderm	2.533	7.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
cd966b32-aa60-4cdc-a6f1-dcb2736af51c	5943000089536	Gerovital Treatment Expert Anti-Hair Loss Serum	Coverderm	3.536	10.34	10.345	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
f0c3b94f-4e10-493d-a4f3-36e7383fa8b8	5943000089499	Gerovital Treatment Expert Anti-Hair Loss Shampoo	Coverderm	2.72	13.44	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
81cc0d23-80c1-49a6-b1bf-d56ac2d34d1a	5943000089598	Gerovital Treatment Expert Kit For Hair Regeneration Ampoules	Coverderm	8.789	33.793	24.5	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
5e9413de-a732-44be-84d3-7885936cd615	100040	Gerovital Treatment Expert Petroleum Regenerating Lotion	Coverderm	3.536	12.413	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
e4852af0-816c-4ea5-84d5-7343a1a21cdf	5943000089673	Gerovital Treatment Expert Serum For Split Hair Ends	Coverderm	3.536	7.214	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
30bec5cd-a983-4dbe-a8e8-add3ee28c986	100039	Gerovital Plant Vitamin Cleansing Milk	Coverderm	2.975	7.931	0	0	0	\N	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-22 10:44:30.039	2024-12-22 10:44:30.039	021e3356-df63-40c8-9397-2e0dfb3727da	FIFO	\N	\N
\.


--
-- Data for Name: PurchaseInvoice; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."PurchaseInvoice" (id, uuid, "issueDate", note, "documentCurrency", "taxCurrency", "companyId", "supplierId", "taxExclusiveAmount", "taxInclusiveAmount", "allowanceTotalAmount", "payableAmount", "employeeId", "createdAt", "updatedAt", "isSubmitted", number) FROM stdin;
\.


--
-- Data for Name: PurchaseInvoiceItem; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."PurchaseInvoiceItem" (id, "purchaseInvoiceId", name, quantity, "unitPrice", "companyId", "discountAmount", "lineExtensionAmount", "taxAmount", "taxCategory", "taxPercent", "productId") FROM stdin;
\.


--
-- Data for Name: Receipt; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Receipt" (id, "receiptNumber", "accountId", "customerId", "accountManagerId", date, "paymentMode", "TransactionAccountId", "totalAmount", notes, "createdAt", "updatedAt", "userId", "companyId") FROM stdin;
\.


--
-- Data for Name: Salary; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Salary" (id, "employeeId", amount, benefit, "paymentDate", "createdAt", "updatedAt", "companyId") FROM stdin;
\.


--
-- Data for Name: Seller; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Seller" (id, "companyId", name, "countryCode") FROM stdin;
\.


--
-- Data for Name: Transaction; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Transaction" (id, "accountId", "journalEntryId", debit, credit, currency, notes, "createdAt", "companyId") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."User" (id, email, password, "phoneNumber", "userName", name, "fcmToken", "profileImage", role, "companyId", "position", department, "hireDate", salary, "isActive", "createdAt", "updatedAt", "tenantId") FROM stdin;
f91f5acd-1b26-4d91-ae6a-b08a1d2ad941	yaser@papayatrading.com	$2b$10$lss.40mtfCvEioR6BRHH4OaGbiIznH7MVD.IfxysVziK.d/QtFmsy	0798818254	b	Yaser Othman	\N	https://firebasestorage.googleapis.com/v0/b/gixatco.firebasestorage.app/o/settings%2FpapayaTrading%2Fyaser.webp?alt=media&token=59020182-d9ec-44b2-90ec-c9609de58ecd	ADMIN	0eacb1fe-7f64-4679-a5a3-251bda8e70a7	\N	\N	\N	\N	t	2024-12-17 04:08:18.559	2024-12-22 09:21:38.694	\N
03eaf123-cc78-4dfd-840a-a276c41277e7	al-hussein@papayatrading.com	$2b$10$S58LHccsKN3/puIISR66q.2XDIDwDD/4w6flTyLNOvjsA5q6Daakm	0796026659	a	Al-hussein Abdullah	\N	https://firebasestorage.googleapis.com/v0/b/gixatco.firebasestorage.app/o/settings%2FpapayaTrading%2Falhussein.webp?alt=media&token=8b1a38ee-fc39-403a-b111-d4515044e56c	SUPERADMIN	d6663167-e873-4ab3-87de-6ec72595005d	\N	\N	\N	\N	t	2024-12-16 22:33:57.315	2024-12-24 08:16:52.885	\N
2794c959-a320-4b52-906b-55f2ebe1b5a2	maria@margogroup.net	$2b$10$XptsyHNoZCFwaPFahgnYPu.3Zwt8Xg2ay46rH3xFRoLIfR..uocP2	0797757023	m	maria fatol	\N	https://firebasestorage.googleapis.com/v0/b/gixatco.firebasestorage.app/o/settings%2Fshared%2Fdownload.jpeg?alt=media&	ADMIN	021e3356-df63-40c8-9397-2e0dfb3727da	\N	\N	\N	\N	t	2024-12-23 06:00:09.714	2024-12-23 06:03:36.458	\N
\.


--
-- Data for Name: UserCompany; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."UserCompany" (id, "userId", "companyId", "position", department, "isActive", "createdAt", "updatedAt") FROM stdin;
faeb613f-1602-4efd-ad58-ac1daf3f520a	03eaf123-cc78-4dfd-840a-a276c41277e7	9010b439-276f-40d0-85d4-5ecb8b59d0e1	\N	\N	t	2024-12-17 08:14:27.45	2024-12-17 08:14:11.495
ebd4b776-bcb7-437f-b5f9-6b8478c6deaf	03eaf123-cc78-4dfd-840a-a276c41277e7	0eacb1fe-7f64-4679-a5a3-251bda8e70a7	\N	\N	t	2024-12-17 08:14:55.269	2024-12-17 08:14:31.22
99ba4d28-2e54-4bff-b956-9ac674c95b69	03eaf123-cc78-4dfd-840a-a276c41277e7	d6663167-e873-4ab3-87de-6ec72595005d	\N	\N	t	2024-12-17 08:15:26.015	2024-12-17 08:15:17.504
80f42692-3cea-493e-be6f-d6558f2bc477	f91f5acd-1b26-4d91-ae6a-b08a1d2ad941	d6663167-e873-4ab3-87de-6ec72595005d	\N	\N	t	2024-12-17 08:15:44.184	2024-12-17 08:15:29.516
92a478f8-85de-4ec7-89fe-f5d3b124c1b3	f91f5acd-1b26-4d91-ae6a-b08a1d2ad941	0eacb1fe-7f64-4679-a5a3-251bda8e70a7	\N	\N	t	2024-12-17 08:16:10.75	2024-12-17 08:15:46.516
836f2878-96e3-40be-9852-f52fcc65a225	03eaf123-cc78-4dfd-840a-a276c41277e7	021e3356-df63-40c8-9397-2e0dfb3727da	\N	\N	t	2024-12-22 09:22:33.103	2024-12-22 09:22:16.913
32c6f2b0-7c26-43ab-a0bb-fb109eb3e1fe	f91f5acd-1b26-4d91-ae6a-b08a1d2ad941	021e3356-df63-40c8-9397-2e0dfb3727da	\N	\N	t	2024-12-22 09:22:48.824	2024-12-22 09:22:36.185
\.


--
-- Data for Name: Warehouse; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Warehouse" (id, name, location, "createdAt", "updatedAt", "companyId") FROM stdin;
\.


--
-- Data for Name: WarehouseStock; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."WarehouseStock" (id, "warehouseId", "productId", stock, "createdAt", "updatedAt", "companyId") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
0d3d5b2d-265f-4e89-ba07-a8565988cac1	143aa2bef9c32a855a3bdf372080acf1063099a975fff6068b964eccd54bdf27	2024-12-16 21:42:31.635159+00	20241216214231_init	\N	\N	2024-12-16 21:42:31.411514+00	1
b2608133-53ad-445e-980f-3af654853efd	f1f3fdab8de9d4f83e1ee71debc72f63ad7b8050129567051b8c284ec7221226	2024-12-16 21:48:27.593329+00	20241216214827_fix_user_company_relation	\N	\N	2024-12-16 21:48:27.539991+00	1
2cc70048-df80-4ba5-b472-4f0d06f36114	458be93e76b46145a79e951bd8b819ed935d0c98770be53aff05d61c5b777d7a	2024-12-24 12:36:21.898787+00	20241224123621_	\N	\N	2024-12-24 12:36:21.882034+00	1
08d215bd-8469-46ac-a41e-c70408a1bd99	9b6b77a20b46ef3616d2969891d49659be4f3b01679586e5618d8a16d7d4d0f2	2024-12-16 21:51:29.430589+00	20241216215129_fix_user_company_relation	\N	\N	2024-12-16 21:51:29.389744+00	1
e054d077-e290-4a85-b963-9e1b497f71f4	bb5d809d3fc776a92b862d5d8d0d04d3fc18cfca28e382bd00a482f1ed1be60f	2024-12-16 23:34:02.693327+00	20241216233402_	\N	\N	2024-12-16 23:34:02.655625+00	1
81b7f092-4194-499c-b868-1e56c1f72ea3	b130b8c97e87e58a43b660253108774257becafd621431c30138e3b16cc64837	2024-12-17 00:03:31.25151+00	20241217000331_companyid_for_employees	\N	\N	2024-12-17 00:03:31.21465+00	1
a2ed5d78-86c4-4345-aa2d-b22e646c8256	53a02aaf1bbc618e7f9fd692138c23fc1e3f4a505bca13d64f65871e9f5468d3	2024-12-17 00:19:24.18387+00	20241217001924_invoice	\N	\N	2024-12-17 00:19:24.140981+00	1
654b9abd-d5b1-46a3-b8cb-d68c523d5ab8	61c47238969878cf13b144d33ae9ccf28cbbf0db23ba4f8d75f4e70cb525b3e1	2024-12-17 03:11:25.405439+00	20241217031125_indexing	\N	\N	2024-12-17 03:11:25.328111+00	1
4bd6637c-b3f0-4b5a-ac3f-99f32ed7f0d9	d5bf21a8d1916fd3d3b3473c6171e5a811dd1b76158136e05123d5256f731a03	2024-12-17 08:13:11.380585+00	20241217081311_user_company	\N	\N	2024-12-17 08:13:11.366221+00	1
89724fa0-fb80-4876-8f51-f7b436357104	c4865b44a73ca734cdb6482400e8f808f591fb425d423d4ea21e219809b4c019	2024-12-19 10:52:29.567497+00	20241219105229_valedation	\N	\N	2024-12-19 10:52:29.555393+00	1
aaf8196b-8be2-4ff6-8d60-d61153d4ed95	cb70b6e1b22a563df61718aceeeca66f24818081401bb8b64ee69d1537bfbf9b	2024-12-19 10:53:48.006253+00	20241219105347_validation	\N	\N	2024-12-19 10:53:48.001752+00	1
fc8f7d58-7976-4a96-b5c2-2f10e082774c	aa45709d7cfa25b1fdc16bf218b276819bbeb83835ad632464cc893edb791097	2024-12-19 11:00:43.532852+00	20241219110043_nrv	\N	\N	2024-12-19 11:00:43.52683+00	1
9bc9beeb-bc06-4ad8-aaae-cc796f134c55	463d8596d8c5eceacb248155da5b5b310727a1c6aa7e66aa88adb3d2ba508dfc	2024-12-19 20:40:06.748563+00	20241219204006_purchases	\N	\N	2024-12-19 20:40:06.684668+00	1
167b6c92-c305-428e-a3b8-82eca18f06eb	ca0d31468afd8a5e7f271dd7012a5d7ad283ba3fff653a971f07bf83508773b0	2024-12-24 10:40:49.740179+00	20241224104049_accounts	\N	\N	2024-12-24 10:40:49.735723+00	1
19a6996f-ff20-463b-801c-b5ce737320c8	0162c2b02f85ac30a69b766b765d624fc017d42b822b72d09c296553804c96ee	2024-12-24 10:42:57.900476+00	20241224104257_code	\N	\N	2024-12-24 10:42:57.884582+00	1
\.


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: AdditionalDocument AdditionalDocument_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."AdditionalDocument"
    ADD CONSTRAINT "AdditionalDocument_pkey" PRIMARY KEY (id);


--
-- Name: Asset Asset_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Asset"
    ADD CONSTRAINT "Asset_pkey" PRIMARY KEY (id);


--
-- Name: BankDetails BankDetails_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."BankDetails"
    ADD CONSTRAINT "BankDetails_pkey" PRIMARY KEY (id);


--
-- Name: BillingReference BillingReference_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."BillingReference"
    ADD CONSTRAINT "BillingReference_pkey" PRIMARY KEY (id);


--
-- Name: Buyer Buyer_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Buyer"
    ADD CONSTRAINT "Buyer_pkey" PRIMARY KEY (id);


--
-- Name: Cheque Cheque_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Cheque"
    ADD CONSTRAINT "Cheque_pkey" PRIMARY KEY (id);


--
-- Name: Company Company_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Company"
    ADD CONSTRAINT "Company_pkey" PRIMARY KEY (id);


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
-- Name: EINV EINV_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."EINV"
    ADD CONSTRAINT "EINV_pkey" PRIMARY KEY (id);


--
-- Name: Employee Employee_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT "Employee_pkey" PRIMARY KEY (id);


--
-- Name: GeneralLedger GeneralLedger_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."GeneralLedger"
    ADD CONSTRAINT "GeneralLedger_pkey" PRIMARY KEY (id);


--
-- Name: InventoryMovement InventoryMovement_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."InventoryMovement"
    ADD CONSTRAINT "InventoryMovement_pkey" PRIMARY KEY (id);


--
-- Name: InvoiceItem InvoiceItem_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."InvoiceItem"
    ADD CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY (id);


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
-- Name: Obligation Obligation_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Obligation"
    ADD CONSTRAINT "Obligation_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: PurchaseInvoiceItem PurchaseInvoiceItem_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."PurchaseInvoiceItem"
    ADD CONSTRAINT "PurchaseInvoiceItem_pkey" PRIMARY KEY (id);


--
-- Name: PurchaseInvoice PurchaseInvoice_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."PurchaseInvoice"
    ADD CONSTRAINT "PurchaseInvoice_pkey" PRIMARY KEY (id);


--
-- Name: Receipt Receipt_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Receipt"
    ADD CONSTRAINT "Receipt_pkey" PRIMARY KEY (id);


--
-- Name: Salary Salary_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Salary"
    ADD CONSTRAINT "Salary_pkey" PRIMARY KEY (id);


--
-- Name: Seller Seller_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Seller"
    ADD CONSTRAINT "Seller_pkey" PRIMARY KEY (id);


--
-- Name: Transaction Transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY (id);


--
-- Name: UserCompany UserCompany_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."UserCompany"
    ADD CONSTRAINT "UserCompany_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: WarehouseStock WarehouseStock_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."WarehouseStock"
    ADD CONSTRAINT "WarehouseStock_pkey" PRIMARY KEY (id);


--
-- Name: Warehouse Warehouse_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Warehouse"
    ADD CONSTRAINT "Warehouse_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Account_code_companyId_key; Type: INDEX; Schema: public; Owner: husain
--

CREATE UNIQUE INDEX "Account_code_companyId_key" ON public."Account" USING btree (code, "companyId");


--
-- Name: Account_companyId_code_idx; Type: INDEX; Schema: public; Owner: husain
--

CREATE INDEX "Account_companyId_code_idx" ON public."Account" USING btree ("companyId", code);


--
-- Name: Account_companyId_idx; Type: INDEX; Schema: public; Owner: husain
--

CREATE INDEX "Account_companyId_idx" ON public."Account" USING btree ("companyId");


--
-- Name: BankDetails_accountId_key; Type: INDEX; Schema: public; Owner: husain
--

CREATE UNIQUE INDEX "BankDetails_accountId_key" ON public."BankDetails" USING btree ("accountId");


--
-- Name: Cheque_companyId_idx; Type: INDEX; Schema: public; Owner: husain
--

CREATE INDEX "Cheque_companyId_idx" ON public."Cheque" USING btree ("companyId");


--
-- Name: Company_email_key; Type: INDEX; Schema: public; Owner: husain
--

CREATE UNIQUE INDEX "Company_email_key" ON public."Company" USING btree (email);


--
-- Name: Company_legalId_key; Type: INDEX; Schema: public; Owner: husain
--

CREATE UNIQUE INDEX "Company_legalId_key" ON public."Company" USING btree ("legalId");


--
-- Name: Company_taxNumber_key; Type: INDEX; Schema: public; Owner: husain
--

CREATE UNIQUE INDEX "Company_taxNumber_key" ON public."Company" USING btree ("taxNumber");


--
-- Name: Customer_accountId_key; Type: INDEX; Schema: public; Owner: husain
--

CREATE UNIQUE INDEX "Customer_accountId_key" ON public."Customer" USING btree ("accountId");


--
-- Name: Customer_companyId_idx; Type: INDEX; Schema: public; Owner: husain
--

CREATE INDEX "Customer_companyId_idx" ON public."Customer" USING btree ("companyId");


--
-- Name: Employee_userId_key; Type: INDEX; Schema: public; Owner: husain
--

CREATE UNIQUE INDEX "Employee_userId_key" ON public."Employee" USING btree ("userId");


--
-- Name: GeneralLedger_accountId_key; Type: INDEX; Schema: public; Owner: husain
--

CREATE UNIQUE INDEX "GeneralLedger_accountId_key" ON public."GeneralLedger" USING btree ("accountId");


--
-- Name: GeneralLedger_companyId_accountId_idx; Type: INDEX; Schema: public; Owner: husain
--

CREATE INDEX "GeneralLedger_companyId_accountId_idx" ON public."GeneralLedger" USING btree ("companyId", "accountId");


--
-- Name: GeneralLedger_companyId_idx; Type: INDEX; Schema: public; Owner: husain
--

CREATE INDEX "GeneralLedger_companyId_idx" ON public."GeneralLedger" USING btree ("companyId");


--
-- Name: InventoryMovement_companyId_productId_idx; Type: INDEX; Schema: public; Owner: husain
--

CREATE INDEX "InventoryMovement_companyId_productId_idx" ON public."InventoryMovement" USING btree ("companyId", "productId");


--
-- Name: InvoiceItem_companyId_idx; Type: INDEX; Schema: public; Owner: husain
--

CREATE INDEX "InvoiceItem_companyId_idx" ON public."InvoiceItem" USING btree ("companyId");


--
-- Name: Invoice_companyId_idx; Type: INDEX; Schema: public; Owner: husain
--

CREATE INDEX "Invoice_companyId_idx" ON public."Invoice" USING btree ("companyId");


--
-- Name: Invoice_number_key; Type: INDEX; Schema: public; Owner: husain
--

CREATE UNIQUE INDEX "Invoice_number_key" ON public."Invoice" USING btree (number);


--
-- Name: Invoice_uuid_key; Type: INDEX; Schema: public; Owner: husain
--

CREATE UNIQUE INDEX "Invoice_uuid_key" ON public."Invoice" USING btree (uuid);


--
-- Name: JournalEntry_companyId_idx; Type: INDEX; Schema: public; Owner: husain
--

CREATE INDEX "JournalEntry_companyId_idx" ON public."JournalEntry" USING btree ("companyId");


--
-- Name: Product_barcode_key; Type: INDEX; Schema: public; Owner: husain
--

CREATE UNIQUE INDEX "Product_barcode_key" ON public."Product" USING btree (barcode);


--
-- Name: Product_companyId_idx; Type: INDEX; Schema: public; Owner: husain
--

CREATE INDEX "Product_companyId_idx" ON public."Product" USING btree ("companyId");


--
-- Name: PurchaseInvoiceItem_companyId_idx; Type: INDEX; Schema: public; Owner: husain
--

CREATE INDEX "PurchaseInvoiceItem_companyId_idx" ON public."PurchaseInvoiceItem" USING btree ("companyId");


--
-- Name: PurchaseInvoice_companyId_idx; Type: INDEX; Schema: public; Owner: husain
--

CREATE INDEX "PurchaseInvoice_companyId_idx" ON public."PurchaseInvoice" USING btree ("companyId");


--
-- Name: PurchaseInvoice_number_key; Type: INDEX; Schema: public; Owner: husain
--

CREATE UNIQUE INDEX "PurchaseInvoice_number_key" ON public."PurchaseInvoice" USING btree (number);


--
-- Name: PurchaseInvoice_uuid_key; Type: INDEX; Schema: public; Owner: husain
--

CREATE UNIQUE INDEX "PurchaseInvoice_uuid_key" ON public."PurchaseInvoice" USING btree (uuid);


--
-- Name: Receipt_companyId_idx; Type: INDEX; Schema: public; Owner: husain
--

CREATE INDEX "Receipt_companyId_idx" ON public."Receipt" USING btree ("companyId");


--
-- Name: Receipt_receiptNumber_key; Type: INDEX; Schema: public; Owner: husain
--

CREATE UNIQUE INDEX "Receipt_receiptNumber_key" ON public."Receipt" USING btree ("receiptNumber");


--
-- Name: Seller_companyId_key; Type: INDEX; Schema: public; Owner: husain
--

CREATE UNIQUE INDEX "Seller_companyId_key" ON public."Seller" USING btree ("companyId");


--
-- Name: Transaction_companyId_createdAt_idx; Type: INDEX; Schema: public; Owner: husain
--

CREATE INDEX "Transaction_companyId_createdAt_idx" ON public."Transaction" USING btree ("companyId", "createdAt");


--
-- Name: Transaction_companyId_idx; Type: INDEX; Schema: public; Owner: husain
--

CREATE INDEX "Transaction_companyId_idx" ON public."Transaction" USING btree ("companyId");


--
-- Name: UserCompany_userId_companyId_key; Type: INDEX; Schema: public; Owner: husain
--

CREATE UNIQUE INDEX "UserCompany_userId_companyId_key" ON public."UserCompany" USING btree ("userId", "companyId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: husain
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_userName_key; Type: INDEX; Schema: public; Owner: husain
--

CREATE UNIQUE INDEX "User_userName_key" ON public."User" USING btree ("userName");


--
-- Name: Account Account_parentAccountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_parentAccountId_fkey" FOREIGN KEY ("parentAccountId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: AdditionalDocument AdditionalDocument_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."AdditionalDocument"
    ADD CONSTRAINT "AdditionalDocument_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: BillingReference BillingReference_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."BillingReference"
    ADD CONSTRAINT "BillingReference_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Cheque Cheque_receiptId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Cheque"
    ADD CONSTRAINT "Cheque_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES public."Receipt"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Contract Contract_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Contract"
    ADD CONSTRAINT "Contract_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: EINV EINV_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."EINV"
    ADD CONSTRAINT "EINV_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GeneralLedger GeneralLedger_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."GeneralLedger"
    ADD CONSTRAINT "GeneralLedger_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: InventoryMovement InventoryMovement_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."InventoryMovement"
    ADD CONSTRAINT "InventoryMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: InvoiceItem InvoiceItem_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."InvoiceItem"
    ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: InvoiceItem InvoiceItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."InvoiceItem"
    ADD CONSTRAINT "InvoiceItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invoice Invoice_buyerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES public."Buyer"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invoice Invoice_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Invoice Invoice_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invoice Invoice_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invoice Invoice_sellerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES public."Seller"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invoice Invoice_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Obligation Obligation_contractId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Obligation"
    ADD CONSTRAINT "Obligation_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES public."Contract"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PurchaseInvoiceItem PurchaseInvoiceItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."PurchaseInvoiceItem"
    ADD CONSTRAINT "PurchaseInvoiceItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PurchaseInvoiceItem PurchaseInvoiceItem_purchaseInvoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."PurchaseInvoiceItem"
    ADD CONSTRAINT "PurchaseInvoiceItem_purchaseInvoiceId_fkey" FOREIGN KEY ("purchaseInvoiceId") REFERENCES public."PurchaseInvoice"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Receipt Receipt_accountManagerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Receipt"
    ADD CONSTRAINT "Receipt_accountManagerId_fkey" FOREIGN KEY ("accountManagerId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Receipt Receipt_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Receipt"
    ADD CONSTRAINT "Receipt_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Receipt Receipt_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."Receipt"
    ADD CONSTRAINT "Receipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


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
-- Name: UserCompany UserCompany_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."UserCompany"
    ADD CONSTRAINT "UserCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserCompany UserCompany_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."UserCompany"
    ADD CONSTRAINT "UserCompany_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: WarehouseStock WarehouseStock_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."WarehouseStock"
    ADD CONSTRAINT "WarehouseStock_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: WarehouseStock WarehouseStock_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: husain
--

ALTER TABLE ONLY public."WarehouseStock"
    ADD CONSTRAINT "WarehouseStock_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public."Warehouse"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

