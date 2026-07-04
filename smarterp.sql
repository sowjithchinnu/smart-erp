--
-- PostgreSQL database dump
--

\restrict 5SiPlPrmMRAIHxcbSlmsD49D24xFMTlNhnPQdRr5fde4cbq7Z2a6IOf7c2ZhCDw

-- Dumped from database version 17.10 (Homebrew)
-- Dumped by pg_dump version 17.10 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: companies; Type: TABLE; Schema: public; Owner: Sowjith
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    user_id integer,
    company_name character varying(255) NOT NULL,
    address text,
    gst_number character varying(20),
    financial_year character varying(20),
    state character varying(100),
    contact_person character varying(255),
    contact_email character varying(255),
    contact_phone character varying(15),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.companies OWNER TO "Sowjith";

--
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: Sowjith
--

CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.companies_id_seq OWNER TO "Sowjith";

--
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Sowjith
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- Name: ledgers; Type: TABLE; Schema: public; Owner: Sowjith
--

CREATE TABLE public.ledgers (
    id integer NOT NULL,
    company_id integer NOT NULL,
    ledger_name character varying(255) NOT NULL,
    ledger_type character varying(50) NOT NULL,
    contact_person character varying(255),
    email character varying(255),
    phone character varying(20),
    gst_number character varying(50),
    address text,
    opening_balance numeric(12,2) DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.ledgers OWNER TO "Sowjith";

--
-- Name: ledgers_id_seq; Type: SEQUENCE; Schema: public; Owner: Sowjith
--

CREATE SEQUENCE public.ledgers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ledgers_id_seq OWNER TO "Sowjith";

--
-- Name: ledgers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Sowjith
--

ALTER SEQUENCE public.ledgers_id_seq OWNED BY public.ledgers.id;


--
-- Name: purchase_voucher_items; Type: TABLE; Schema: public; Owner: Sowjith
--

CREATE TABLE public.purchase_voucher_items (
    id integer NOT NULL,
    purchase_voucher_id integer,
    stock_item_id integer,
    quantity numeric(12,2),
    rate numeric(12,2),
    amount numeric(12,2)
);


ALTER TABLE public.purchase_voucher_items OWNER TO "Sowjith";

--
-- Name: purchase_voucher_items_id_seq; Type: SEQUENCE; Schema: public; Owner: Sowjith
--

CREATE SEQUENCE public.purchase_voucher_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_voucher_items_id_seq OWNER TO "Sowjith";

--
-- Name: purchase_voucher_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Sowjith
--

ALTER SEQUENCE public.purchase_voucher_items_id_seq OWNED BY public.purchase_voucher_items.id;


--
-- Name: purchase_vouchers; Type: TABLE; Schema: public; Owner: Sowjith
--

CREATE TABLE public.purchase_vouchers (
    id integer NOT NULL,
    company_id integer,
    supplier_id integer,
    voucher_number character varying(50),
    voucher_date date,
    total_amount numeric(12,2),
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.purchase_vouchers OWNER TO "Sowjith";

--
-- Name: purchase_vouchers_id_seq; Type: SEQUENCE; Schema: public; Owner: Sowjith
--

CREATE SEQUENCE public.purchase_vouchers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_vouchers_id_seq OWNER TO "Sowjith";

--
-- Name: purchase_vouchers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Sowjith
--

ALTER SEQUENCE public.purchase_vouchers_id_seq OWNED BY public.purchase_vouchers.id;


--
-- Name: sales_voucher_items; Type: TABLE; Schema: public; Owner: Sowjith
--

CREATE TABLE public.sales_voucher_items (
    id integer NOT NULL,
    sales_voucher_id integer,
    stock_item_id integer,
    quantity numeric(12,2) NOT NULL,
    rate numeric(12,2) NOT NULL,
    amount numeric(12,2) NOT NULL
);


ALTER TABLE public.sales_voucher_items OWNER TO "Sowjith";

--
-- Name: sales_voucher_items_id_seq; Type: SEQUENCE; Schema: public; Owner: Sowjith
--

CREATE SEQUENCE public.sales_voucher_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sales_voucher_items_id_seq OWNER TO "Sowjith";

--
-- Name: sales_voucher_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Sowjith
--

ALTER SEQUENCE public.sales_voucher_items_id_seq OWNED BY public.sales_voucher_items.id;


--
-- Name: sales_vouchers; Type: TABLE; Schema: public; Owner: Sowjith
--

CREATE TABLE public.sales_vouchers (
    id integer NOT NULL,
    company_id integer,
    customer_id integer,
    voucher_number character varying(50) NOT NULL,
    voucher_date date NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sales_vouchers OWNER TO "Sowjith";

--
-- Name: sales_vouchers_id_seq; Type: SEQUENCE; Schema: public; Owner: Sowjith
--

CREATE SEQUENCE public.sales_vouchers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sales_vouchers_id_seq OWNER TO "Sowjith";

--
-- Name: sales_vouchers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Sowjith
--

ALTER SEQUENCE public.sales_vouchers_id_seq OWNED BY public.sales_vouchers.id;


--
-- Name: stock_groups; Type: TABLE; Schema: public; Owner: Sowjith
--

CREATE TABLE public.stock_groups (
    id integer NOT NULL,
    company_id integer NOT NULL,
    group_name character varying(255) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.stock_groups OWNER TO "Sowjith";

--
-- Name: stock_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: Sowjith
--

CREATE SEQUENCE public.stock_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_groups_id_seq OWNER TO "Sowjith";

--
-- Name: stock_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Sowjith
--

ALTER SEQUENCE public.stock_groups_id_seq OWNED BY public.stock_groups.id;


--
-- Name: stock_items; Type: TABLE; Schema: public; Owner: Sowjith
--

CREATE TABLE public.stock_items (
    id integer NOT NULL,
    company_id integer NOT NULL,
    item_name character varying(255) NOT NULL,
    sku character varying(100) NOT NULL,
    stock_group_id integer,
    unit_id integer,
    purchase_price numeric(12,2) DEFAULT 0,
    selling_price numeric(12,2) DEFAULT 0,
    quantity numeric(12,2) DEFAULT 0,
    gst_percentage numeric(5,2) DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.stock_items OWNER TO "Sowjith";

--
-- Name: stock_items_id_seq; Type: SEQUENCE; Schema: public; Owner: Sowjith
--

CREATE SEQUENCE public.stock_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_items_id_seq OWNER TO "Sowjith";

--
-- Name: stock_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Sowjith
--

ALTER SEQUENCE public.stock_items_id_seq OWNED BY public.stock_items.id;


--
-- Name: units_of_measure; Type: TABLE; Schema: public; Owner: Sowjith
--

CREATE TABLE public.units_of_measure (
    id integer NOT NULL,
    company_id integer NOT NULL,
    unit_name character varying(255) NOT NULL,
    symbol character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.units_of_measure OWNER TO "Sowjith";

--
-- Name: units_of_measure_id_seq; Type: SEQUENCE; Schema: public; Owner: Sowjith
--

CREATE SEQUENCE public.units_of_measure_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.units_of_measure_id_seq OWNER TO "Sowjith";

--
-- Name: units_of_measure_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Sowjith
--

ALTER SEQUENCE public.units_of_measure_id_seq OWNED BY public.units_of_measure.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: Sowjith
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO "Sowjith";

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: Sowjith
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO "Sowjith";

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Sowjith
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- Name: ledgers id; Type: DEFAULT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.ledgers ALTER COLUMN id SET DEFAULT nextval('public.ledgers_id_seq'::regclass);


--
-- Name: purchase_voucher_items id; Type: DEFAULT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.purchase_voucher_items ALTER COLUMN id SET DEFAULT nextval('public.purchase_voucher_items_id_seq'::regclass);


--
-- Name: purchase_vouchers id; Type: DEFAULT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.purchase_vouchers ALTER COLUMN id SET DEFAULT nextval('public.purchase_vouchers_id_seq'::regclass);


--
-- Name: sales_voucher_items id; Type: DEFAULT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.sales_voucher_items ALTER COLUMN id SET DEFAULT nextval('public.sales_voucher_items_id_seq'::regclass);


--
-- Name: sales_vouchers id; Type: DEFAULT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.sales_vouchers ALTER COLUMN id SET DEFAULT nextval('public.sales_vouchers_id_seq'::regclass);


--
-- Name: stock_groups id; Type: DEFAULT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.stock_groups ALTER COLUMN id SET DEFAULT nextval('public.stock_groups_id_seq'::regclass);


--
-- Name: stock_items id; Type: DEFAULT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.stock_items ALTER COLUMN id SET DEFAULT nextval('public.stock_items_id_seq'::regclass);


--
-- Name: units_of_measure id; Type: DEFAULT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.units_of_measure ALTER COLUMN id SET DEFAULT nextval('public.units_of_measure_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: Sowjith
--

COPY public.companies (id, user_id, company_name, address, gst_number, financial_year, state, contact_person, contact_email, contact_phone, created_at) FROM stdin;
3	3	Sowjith Technologies Pvt Ltd	IIIT Dharwad Campus,\nIttigatti Road,\nDharwad, Karnataka - 580009	29ABCDE1234F1Z5	2025-2026	Karnataka	\N	\N	\N	2026-06-30 15:31:23.387091
\.


--
-- Data for Name: ledgers; Type: TABLE DATA; Schema: public; Owner: Sowjith
--

COPY public.ledgers (id, company_id, ledger_name, ledger_type, contact_person, email, phone, gst_number, address, opening_balance, created_at) FROM stdin;
2	3	sgsdvbkb	CUSTOMER	joohn doo	joohn.deee7@gmail.com	7989279236	22AAAAAADGR298	bfgbdfgf	1000000.00	2026-07-01 14:33:17.101564
3	3	sgsdvbkb	SUPPLIER	fsfdsvfv	rgsdtfsdsc@gmail.com	798924543333	22AAAAAADGR2433	zawsxedcrfvtgbyhnujmi	-0.03	2026-07-01 14:34:28.292796
4	3	qweweeqwq	STOCK	teeeteee	brsbsrbvs@gmail.com	79892454443	22AAAAAADGR223	rfegfxdsgbfx	11111.00	2026-07-01 14:36:05.870892
\.


--
-- Data for Name: purchase_voucher_items; Type: TABLE DATA; Schema: public; Owner: Sowjith
--

COPY public.purchase_voucher_items (id, purchase_voucher_id, stock_item_id, quantity, rate, amount) FROM stdin;
3	4	1	10.00	150.00	1500.00
4	5	1	5.00	300.00	1500.00
5	6	1	10.00	300.00	3000.00
6	7	1	5.00	250.00	1250.00
\.


--
-- Data for Name: purchase_vouchers; Type: TABLE DATA; Schema: public; Owner: Sowjith
--

COPY public.purchase_vouchers (id, company_id, supplier_id, voucher_number, voucher_date, total_amount, notes, created_at) FROM stdin;
4	3	3	PUR-1783142087620	2026-07-04	1500.00	First Purchase	2026-07-04 10:44:47.619905
5	3	3	PUR-1783145861724	2026-07-04	1500.00	Steel purchase for inventory	2026-07-04 11:47:41.7216
6	3	3	PUR-1783146452951	2026-07-04	3000.00	more steel purchase	2026-07-04 11:57:32.946965
7	3	3	PUR-1783146765002	2026-07-04	1250.00	another steel purchase	2026-07-04 12:02:45.002213
\.


--
-- Data for Name: sales_voucher_items; Type: TABLE DATA; Schema: public; Owner: Sowjith
--

COPY public.sales_voucher_items (id, sales_voucher_id, stock_item_id, quantity, rate, amount) FROM stdin;
1	1	1	5.00	400.00	2000.00
\.


--
-- Data for Name: sales_vouchers; Type: TABLE DATA; Schema: public; Owner: Sowjith
--

COPY public.sales_vouchers (id, company_id, customer_id, voucher_number, voucher_date, total_amount, notes, created_at) FROM stdin;
1	3	2	SAL-1783172135512	2026-07-04	2000.00	First Sale	2026-07-04 19:05:35.507597
\.


--
-- Data for Name: stock_groups; Type: TABLE DATA; Schema: public; Owner: Sowjith
--

COPY public.stock_groups (id, company_id, group_name, description, created_at) FROM stdin;
1	3	electronics	metals, wires, hardware, etc.	2026-07-02 14:58:01.214516
\.


--
-- Data for Name: stock_items; Type: TABLE DATA; Schema: public; Owner: Sowjith
--

COPY public.stock_items (id, company_id, item_name, sku, stock_group_id, unit_id, purchase_price, selling_price, quantity, gst_percentage, created_at) FROM stdin;
1	3	steelll	ST-002	1	1	28000.00	36000.00	29535.00	4.00	2026-07-02 14:59:50.463305
\.


--
-- Data for Name: units_of_measure; Type: TABLE DATA; Schema: public; Owner: Sowjith
--

COPY public.units_of_measure (id, company_id, unit_name, symbol, created_at) FROM stdin;
1	3	kilogram	kg	2026-07-02 14:59:11.009973
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: Sowjith
--

COPY public.users (id, name, email, password, created_at) FROM stdin;
2	Test User	test@example.com	$2b$10$JLsI8/NO1PxzxLKF1PGCZuUlgZ5Mg9iQDF0OxgKQMm8YF6PWAWehi	2026-06-29 23:16:38.6907
3	sowjith	sowjith.vnalli7@gmail.com	$2b$10$zSbyC/KMMm2C/3NsA.hR9.p74ujo/eQX9j9EsIFMRS.OlFjtuj4Za	2026-06-29 23:18:14.01981
\.


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Sowjith
--

SELECT pg_catalog.setval('public.companies_id_seq', 3, true);


--
-- Name: ledgers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Sowjith
--

SELECT pg_catalog.setval('public.ledgers_id_seq', 4, true);


--
-- Name: purchase_voucher_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Sowjith
--

SELECT pg_catalog.setval('public.purchase_voucher_items_id_seq', 6, true);


--
-- Name: purchase_vouchers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Sowjith
--

SELECT pg_catalog.setval('public.purchase_vouchers_id_seq', 7, true);


--
-- Name: sales_voucher_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Sowjith
--

SELECT pg_catalog.setval('public.sales_voucher_items_id_seq', 1, true);


--
-- Name: sales_vouchers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Sowjith
--

SELECT pg_catalog.setval('public.sales_vouchers_id_seq', 1, true);


--
-- Name: stock_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Sowjith
--

SELECT pg_catalog.setval('public.stock_groups_id_seq', 1, true);


--
-- Name: stock_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Sowjith
--

SELECT pg_catalog.setval('public.stock_items_id_seq', 1, true);


--
-- Name: units_of_measure_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Sowjith
--

SELECT pg_catalog.setval('public.units_of_measure_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Sowjith
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: ledgers ledgers_pkey; Type: CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.ledgers
    ADD CONSTRAINT ledgers_pkey PRIMARY KEY (id);


--
-- Name: purchase_voucher_items purchase_voucher_items_pkey; Type: CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.purchase_voucher_items
    ADD CONSTRAINT purchase_voucher_items_pkey PRIMARY KEY (id);


--
-- Name: purchase_vouchers purchase_vouchers_pkey; Type: CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.purchase_vouchers
    ADD CONSTRAINT purchase_vouchers_pkey PRIMARY KEY (id);


--
-- Name: sales_voucher_items sales_voucher_items_pkey; Type: CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.sales_voucher_items
    ADD CONSTRAINT sales_voucher_items_pkey PRIMARY KEY (id);


--
-- Name: sales_vouchers sales_vouchers_pkey; Type: CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.sales_vouchers
    ADD CONSTRAINT sales_vouchers_pkey PRIMARY KEY (id);


--
-- Name: sales_vouchers sales_vouchers_voucher_number_key; Type: CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.sales_vouchers
    ADD CONSTRAINT sales_vouchers_voucher_number_key UNIQUE (voucher_number);


--
-- Name: stock_groups stock_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.stock_groups
    ADD CONSTRAINT stock_groups_pkey PRIMARY KEY (id);


--
-- Name: stock_items stock_items_pkey; Type: CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.stock_items
    ADD CONSTRAINT stock_items_pkey PRIMARY KEY (id);


--
-- Name: units_of_measure units_of_measure_pkey; Type: CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.units_of_measure
    ADD CONSTRAINT units_of_measure_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: companies companies_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: ledgers ledgers_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.ledgers
    ADD CONSTRAINT ledgers_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: purchase_voucher_items purchase_voucher_items_purchase_voucher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.purchase_voucher_items
    ADD CONSTRAINT purchase_voucher_items_purchase_voucher_id_fkey FOREIGN KEY (purchase_voucher_id) REFERENCES public.purchase_vouchers(id) ON DELETE CASCADE;


--
-- Name: purchase_voucher_items purchase_voucher_items_stock_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.purchase_voucher_items
    ADD CONSTRAINT purchase_voucher_items_stock_item_id_fkey FOREIGN KEY (stock_item_id) REFERENCES public.stock_items(id);


--
-- Name: purchase_vouchers purchase_vouchers_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.purchase_vouchers
    ADD CONSTRAINT purchase_vouchers_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: purchase_vouchers purchase_vouchers_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.purchase_vouchers
    ADD CONSTRAINT purchase_vouchers_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.ledgers(id);


--
-- Name: sales_voucher_items sales_voucher_items_sales_voucher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.sales_voucher_items
    ADD CONSTRAINT sales_voucher_items_sales_voucher_id_fkey FOREIGN KEY (sales_voucher_id) REFERENCES public.sales_vouchers(id) ON DELETE CASCADE;


--
-- Name: sales_voucher_items sales_voucher_items_stock_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.sales_voucher_items
    ADD CONSTRAINT sales_voucher_items_stock_item_id_fkey FOREIGN KEY (stock_item_id) REFERENCES public.stock_items(id);


--
-- Name: sales_vouchers sales_vouchers_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.sales_vouchers
    ADD CONSTRAINT sales_vouchers_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: sales_vouchers sales_vouchers_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.sales_vouchers
    ADD CONSTRAINT sales_vouchers_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.ledgers(id);


--
-- Name: stock_groups stock_groups_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.stock_groups
    ADD CONSTRAINT stock_groups_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: stock_items stock_items_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.stock_items
    ADD CONSTRAINT stock_items_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: stock_items stock_items_stock_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.stock_items
    ADD CONSTRAINT stock_items_stock_group_id_fkey FOREIGN KEY (stock_group_id) REFERENCES public.stock_groups(id) ON DELETE SET NULL;


--
-- Name: stock_items stock_items_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.stock_items
    ADD CONSTRAINT stock_items_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units_of_measure(id) ON DELETE SET NULL;


--
-- Name: units_of_measure units_of_measure_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Sowjith
--

ALTER TABLE ONLY public.units_of_measure
    ADD CONSTRAINT units_of_measure_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 5SiPlPrmMRAIHxcbSlmsD49D24xFMTlNhnPQdRr5fde4cbq7Z2a6IOf7c2ZhCDw

