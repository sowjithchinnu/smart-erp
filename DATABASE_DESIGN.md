# Database Tables

## users

- id
- name
- email
- password

## companies

- id
- user_id
- name
- address
- gst_number
- state
- financial_year
- contact_number

## customers

- id
- company_id
- name
- phone
- address
- outstanding_balance

## suppliers

- id
- company_id
- name
- phone
- address
- gst_number
- outstanding_due

## stock_items

- id
- company_id
- name
- sku
- purchase_price
- selling_price
- quantity
- gst_percentage

## ledgers

- id
- company_id
- name
- type
- balance

## vouchers

- id
- company_id
- voucher_number
- voucher_type
- party_id
- total_amount
- voucher_date
- status

## voucher_items

- id
- voucher_id
- stock_item_id
- quantity
- rate
- amount
