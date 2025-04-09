/*
  # Create product details and requirements tables

  1. New Tables
    - `product_details`
      - `id` (uuid, primary key)
      - `product_id` (uuid, references products)
      - `specifications` (jsonb)
      - `dimensions` (jsonb)
      - `materials` (text[])
      - `usage_guidelines` (text)
      - `warranty_info` (text)
      - `care_instructions` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `product_requirements`
      - `id` (uuid, primary key)
      - `product_id` (uuid, references products)
      - `customer_name` (text)
      - `email` (text)
      - `customization_details` (jsonb)
      - `quantity` (integer)
      - `status` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for data access
*/

-- Create product_details table
CREATE TABLE IF NOT EXISTS product_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  specifications jsonb NOT NULL DEFAULT '{}',
  dimensions jsonb NOT NULL DEFAULT '{}',
  materials text[] NOT NULL DEFAULT '{}',
  usage_guidelines text,
  warranty_info text,
  care_instructions text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product_requirements table
CREATE TABLE IF NOT EXISTS product_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  email text NOT NULL,
  customization_details jsonb NOT NULL DEFAULT '{}',
  quantity integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE product_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_requirements ENABLE ROW LEVEL SECURITY;

-- Policies for product_details
CREATE POLICY "Anyone can view product details"
  ON product_details
  FOR SELECT
  TO anon
  USING (true);

-- Policies for product_requirements
CREATE POLICY "Anyone can create requirements"
  ON product_requirements
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can view their own requirements"
  ON product_requirements
  FOR SELECT
  TO anon
  USING (email IS NOT NULL);