create table if not exists resources (
  id text primary key,
  name text not null,
  category text not null,
  category_label text not null,
  parish text not null,
  description text not null default '',
  phone text not null default '',
  address text not null default '',
  hours text not null default '',
  eligibility text not null default '',
  next_step text not null default '',
  verified date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists resources_parish_idx on resources (parish);
create index if not exists resources_category_idx on resources (category);
