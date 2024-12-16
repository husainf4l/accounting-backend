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
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Account" (id, "hierarchyCode", name, "accountType", "openingBalance", "currentBalance", "parentAccountId", "mainAccount", "createdAt", "updatedAt") FROM stdin;
e6c12a0c-137a-467c-af88-c78f016b463d	1.1.1.2	Office Cash	ASSET	0	0.58	20a54393-fbb9-4f76-ae25-361bee95f22e	f	2024-12-11 20:30:08.178	2024-12-15 20:00:00.073
c9353cb3-ab39-46ba-b66d-8c28cfb36639	1.2	Fixed Assets	ASSET	0	0	af6163a6-8e76-4f6a-9a79-9627ab201fe1	t	2024-12-11 20:30:07.675	2024-12-15 21:00:00.066
717b30fa-8324-48e7-b855-f4d660f69b85	6	Expenses	EXPENSE	0	0	\N	t	2024-12-11 20:30:08.272	2024-12-15 21:00:00.041
270a0c40-c85e-47e0-8ab4-754e954060ef	5.5	COGS	TRADEEXPENSES	0	0.1	ec15f9bb-6fea-4f06-b465-38e7e79d586a	f	2024-12-11 22:13:46.317	2024-12-15 21:00:00.045
ec15f9bb-6fea-4f06-b465-38e7e79d586a	5	TRADE EXPENSES	EXPENSE	0	0.1	\N	t	2024-12-11 20:30:08.264	2024-12-15 21:00:00.047
c2dea18a-9c2c-4405-8d1f-a55280971de1	4.1	Sales Revenue	REVENUE	0	-0.5	961f4c20-aef1-4acd-8ef1-3d556a8b4dbc	f	2024-12-11 22:12:42.491	2024-12-15 21:00:00.049
961f4c20-aef1-4acd-8ef1-3d556a8b4dbc	4	Revenue	REVENUE	0	-0.5	\N	t	2024-12-11 20:30:08.255	2024-12-15 21:00:00.052
4023c471-7f50-4af4-bb80-cfb02f3ad56b	3.1	Capita	EQUITY	0	0	28c95119-9ecc-404e-bd89-20748bf53a01	f	2024-12-11 20:38:25.2	2024-12-15 21:00:00.054
28c95119-9ecc-404e-bd89-20748bf53a01	3	Equity	EQUITY	0	0	\N	t	2024-12-11 20:30:08.244	2024-12-15 21:00:00.056
c1bae4ec-2bec-444b-b77b-ff91d9ce7bc0	1.1.5	long term Cheques	ASSET	0	0	64a7df25-2687-4e36-af31-22440c48bdde	f	2024-12-11 20:30:07.71	2024-12-15 20:00:00.064
99d116cd-119e-46fc-b323-0be47a23b5c3	1.1.4	Stock	ASSET	0	-0.1	64a7df25-2687-4e36-af31-22440c48bdde	f	2024-12-11 20:30:07.73	2024-12-15 20:00:00.065
1fa257af-e960-404f-98cc-9cfb180f14f4	2.2	Long-Term Liabilities	LIABILITY	0	0	bbadba4f-b6f0-4838-9dcd-5c2b3d220daf	t	2024-12-11 20:30:08.234	2024-12-15 21:00:00.058
132fd96d-8ae9-4b7d-b128-a13c476c0c2a	1.1.3.2	Test Client 2	ASSET	0	0	f19d130f-9479-4582-abe9-964752c25500	f	2024-12-11 22:01:00.175	2024-12-15 20:00:00.067
b30ae6e3-e9bd-4d1c-869e-3187d71e6ea2	2.1.2	Sales Tax	LIABILITY	0	-0.08	b8885282-b20e-45c6-8d3e-3aac978ab223	f	2024-12-11 22:13:13.677	2024-12-15 21:00:00.059
c8363d94-42f8-4356-9d35-3266ce19f9a5	1.1.3.1	Test Client	ASSET	0	0	f19d130f-9479-4582-abe9-964752c25500	f	2024-12-11 21:19:18.511	2024-12-15 20:00:00.07
1d104a61-f36a-473b-9cb4-a604776dcc64	2.1.1.2	Supplier B	LIABILITY	0	0	\N	f	2024-12-11 20:30:08.214	2024-12-15 21:00:00.061
f19d130f-9479-4582-abe9-964752c25500	1.1.3	Accounts Receivable	ASSET	0	0	64a7df25-2687-4e36-af31-22440c48bdde	t	2024-12-11 20:30:07.751	2024-12-15 20:00:00.071
ff63a901-c783-4dc9-9224-17f7d1439e12	2.1.1	EmployeesLiability	LIABILITY	0	0	b8885282-b20e-45c6-8d3e-3aac978ab223	f	2024-12-11 21:39:02.257	2024-12-15 21:00:00.062
b8885282-b20e-45c6-8d3e-3aac978ab223	2.1	Current Liability	LIABILITY	0	-0.08	bbadba4f-b6f0-4838-9dcd-5c2b3d220daf	t	2024-12-11 21:35:36.244	2024-12-15 21:00:00.063
bbadba4f-b6f0-4838-9dcd-5c2b3d220daf	2	Liabilities	LIABILITY	0	-0.08	\N	t	2024-12-11 20:30:08.205	2024-12-15 21:00:00.065
b7ec4d5a-8bab-4d38-ada7-99bb23fc726e	1.1.1.1	Cash Aramex	ASSET	0	0	20a54393-fbb9-4f76-ae25-361bee95f22e	f	2024-12-11 20:30:08.196	2024-12-15 20:00:00.075
20a54393-fbb9-4f76-ae25-361bee95f22e	1.1.1	Cash	ASSET	0	0.58	64a7df25-2687-4e36-af31-22440c48bdde	t	2024-12-11 20:30:08.161	2024-12-15 20:00:00.077
64a7df25-2687-4e36-af31-22440c48bdde	1.1	Current Assets	ASSET	0	0.48	af6163a6-8e76-4f6a-9a79-9627ab201fe1	t	2024-12-11 20:30:07.693	2024-12-15 20:00:00.081
af6163a6-8e76-4f6a-9a79-9627ab201fe1	1	Assets	ASSET	0	0.48	\N	t	2024-12-11 20:30:07.635	2024-12-15 20:00:00.083
\.


--
-- Data for Name: Buyer; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Buyer" (id, identification, "schemeId", name, "postalCode", "countryCode", phone) FROM stdin;
\.


--
-- Data for Name: Company; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Company" (id, name, address, "whatsAppKey", phone, email, website, "taxNumber", "logoImage", "createdAt", "updatedAt", "eInvoiceClientId", "eInvoiceSecretKey", "legalName", "eInvoiceLink", "legalId") FROM stdin;
45e858b6-ddc7-400b-b8ea-4ec63b6ebb9e	Al-Mussafah Trading	95 , Brothers Complex , yajous street		0796026659	al-hussein@papayatrading.com	www.almussafah.com	178103217	https://firebasestorage.googleapis.com/v0/b/gixatco.firebasestorage.app/o/settings%2Falmussafah%2Fmussafah-logo.jpeg?alt=media&	2024-12-11 20:34:53.898	2024-12-12 13:26:51.52	454e11a1-1a10-4212-b4b3-8e28fd9a75c8	Gj5nS9wyYHRadaVffz5VKB4v4wlVWyPhcJvrTD4NHtN9Z8Pl9XB+9O9xiTjI14ZTg/+1TpPX6hUagPbcqs8CBaDeq8LlqrnOFJCGq4QhZmMWs5xPcOifs6J/tEWwLY6dFp9atVEHylU8huJc766XqxmRUc8YoUHuwANR0owYYMgj/QrdBBcb/1Dr8eOdZKkUNf58lweIokCEmJJuBbrxHU+caKwp/EN9dp7/jolXX/b5FEc4FyOwW5W8sm/YbOMx+hzjg1Dn0cbgbJ6v3LZf5Q==	شركة المصفح التجاريه	https://backend.jofotara.gov.jo/core/invoices/	200163319
\.


--
-- Data for Name: Customer; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Customer" (id, identification, "schemeId", name, "postalCode", "countryCode", phone, email, address, "createdAt", "updatedAt", "accountId") FROM stdin;
cm4kflvis00003s5e5511vrux	Unknown	Unknown	Test Client	\N	JO	0796026659	test@test.com	Amman	2024-12-11 21:57:57.844	2024-12-11 21:57:57.844	d10fd3dc-396d-41b8-9864-fcf89c04a1bc
cm4kfps7z00013s5e580kbenp	Unknown	Unknown	Test Client 2	\N	JO	079343232	test2@test.com	Irbid	2024-12-11 22:01:00.192	2024-12-11 22:01:00.192	132fd96d-8ae9-4b7d-b128-a13c476c0c2a
cm4kgakur00003slvjvcihsnl	Unknown	Unknown	Test Client	\N	JO	\N	\N	\N	2024-12-11 22:17:10.419	2024-12-11 22:17:10.419	c8363d94-42f8-4356-9d35-3266ce19f9a5
\.


--
-- Data for Name: Employee; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Employee" (id, "userId", "position", department, "hireDate", salary, "isActive", "createdAt", "updatedAt", name) FROM stdin;
79317529-4a20-4b5f-bef3-afc13495886e	\N	\N	\N	\N	\N	t	2024-12-11 21:42:22.433	2024-12-11 21:46:46.875	Al-hussein Test Employee
\.


--
-- Data for Name: Seller; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Seller" (id, "companyId", name, "countryCode") FROM stdin;
\.


--
-- Data for Name: Tenant; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Tenant" (id, name, "databaseUrl", region, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."User" (id, email, password, "phoneNumber", "userName", name, "fcmToken", "profileImage", role, "companyId", "position", department, "hireDate", salary, "isActive", "createdAt", "updatedAt", "tenantId") FROM stdin;
4c69e4b9-4c37-493d-845f-bac2f35b50da	1	$2b$10$1rPMNRawSYUGlwF5onNeVOPN5rEWoE3mLpJs.pjUwcooiVqzyWFQq	0796026659	1	husain	\N	https://firebasestorage.googleapis.com/v0/b/gixatco.firebasestorage.app/o/settings%2FpapayaTrading%2Falhussein.webp?alt=media	ADMIN	45e858b6-ddc7-400b-b8ea-4ec63b6ebb9e	\N	\N	\N	\N	t	2024-12-11 20:37:40.773	2024-12-15 06:17:05.634	\N
\.


--
-- Data for Name: Invoice; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Invoice" (id, uuid, "issueDate", "invoiceTypeCode", note, "documentCurrency", "taxCurrency", "companyId", "customerId", "taxExclusiveAmount", "taxInclusiveAmount", "allowanceTotalAmount", "payableAmount", "employeeId", "createdAt", "updatedAt", "sellerId", "buyerId", "userId", "isSubmitted", number, "InvoiceTypeCodeName") FROM stdin;
cm4laol9y00001ri49sk4iurx	8a227dae-a164-4e56-8c92-9c5cc36f373b	2024-12-12 00:00:00	388	\N	JOD	JOD	\N	cm4kfps7z00013s5e580kbenp	0.5	0.58	\N	0	79317529-4a20-4b5f-bef3-afc13495886e	2024-12-12 12:27:52.63	2024-12-14 13:18:27.56	\N	\N	\N	t	1	012
\.


--
-- Data for Name: AdditionalDocument; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."AdditionalDocument" (id, "referenceId", "referenceUUID", "invoiceId") FROM stdin;
\.


--
-- Data for Name: Asset; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Asset" (id, name, value, "heldForSale", "fairValue", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: BankDetails; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."BankDetails" (id, "accountId", "bankName", "accountNumber", iban, "swiftCode", "branchName", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: BillingReference; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."BillingReference" (id, "invoiceId", "originalInvoiceId", "originalUUID", description) FROM stdin;
\.


--
-- Data for Name: Receipt; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Receipt" (id, "receiptNumber", "accountId", "customerId", "accountManagerId", date, "paymentMode", "TransactionAccountId", "totalAmount", notes, "createdAt", "updatedAt", "userId") FROM stdin;
\.


--
-- Data for Name: Cheque; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Cheque" (id, "receiptId", "chequeNumber", "bankName", amount, date, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Contract; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Contract" (id, "customerId", "totalValue", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: EINV; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."EINV" (id, "EINV_RESULTS", "EINV_STATUS", "EINV_QR", "EINV_NUM", "EINV_INV_UUID", "invoiceId", "EINV_SINGED_INVOICE") FROM stdin;
\.


--
-- Data for Name: GeneralLedger; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."GeneralLedger" (id, "accountId", balance, "updatedAt") FROM stdin;
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Product" (id, barcode, name, description, "costPrice", "salesPrice", "wholesalePrice", "avgPrice", stock, "reorderLevel", "isActive", origin, family, "subFamily", "taxRate", "discountRate", "profitMargin", location, packaging, "itemType", "imageUrl", "createdAt", "updatedAt") FROM stdin;
48f39df0-ba58-4051-87c9-bec014fae07a	4657890ijh	test product	test product	0.1	0.5	0.4	0.2	947	10	t	\N	\N	\N	0.16	0	\N	\N	\N	\N	\N	2024-12-11 20:44:35.331	2024-12-12 13:38:51.799
\.


--
-- Data for Name: InvoiceItem; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."InvoiceItem" (id, "invoiceId", name, quantity, "unitPrice", "discountAmount", "lineExtensionAmount", "taxAmount", "roundingAmount", "taxCategory", "taxPercent", "productId") FROM stdin;
\.


--
-- Data for Name: JournalEntry; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."JournalEntry" (id, date, "createdAt", "updatedAt") FROM stdin;
b3d04ca0-64ce-4455-b351-431074e141bf	2024-12-12 12:27:52.614	2024-12-12 12:27:52.615	2024-12-12 12:27:52.615
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
3a0b87b7-011d-4f7e-8992-fb411f90cd4f	e6c12a0c-137a-467c-af88-c78f016b463d	b3d04ca0-64ce-4455-b351-431074e141bf	0.58	\N	JO	Invoice payment received	2024-12-12 12:27:52.615
32efad4f-0b6a-4cd5-b2b1-ddf5dfbd582e	b30ae6e3-e9bd-4d1c-869e-3187d71e6ea2	b3d04ca0-64ce-4455-b351-431074e141bf	\N	0.08	JO	Sales tax recorded	2024-12-12 12:27:52.615
35a08ef9-a0e2-41e1-8672-b4557b68124b	c2dea18a-9c2c-4405-8d1f-a55280971de1	b3d04ca0-64ce-4455-b351-431074e141bf	\N	0.5	JO	Revenue recognized	2024-12-12 12:27:52.615
6362602a-e7c2-4faf-8777-c90ee11d6d2e	270a0c40-c85e-47e0-8ab4-754e954060ef	b3d04ca0-64ce-4455-b351-431074e141bf	0.1	\N	JO	Cost of goods sold recorded	2024-12-12 12:27:52.615
842dd6fd-eabd-4f60-ae3f-52b0b5228395	99d116cd-119e-46fc-b323-0be47a23b5c3	b3d04ca0-64ce-4455-b351-431074e141bf	\N	0.1	JO	Inventory reduced for sold items	2024-12-12 12:27:52.615
\.


--
-- Data for Name: Warehouse; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."Warehouse" (id, name, location, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: WarehouseStock; Type: TABLE DATA; Schema: public; Owner: husain
--

COPY public."WarehouseStock" (id, "warehouseId", "productId", stock, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: Tenant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: husain
--

SELECT pg_catalog.setval('public."Tenant_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

