-- Optional Supabase migration. Run in your project's SQL Editor.
-- No visitor identifiers, IP addresses or raw search queries are stored.
begin;
create table if not exists public.metric_counts (
  day date not null,
  event text not null,
  target text not null,
  count bigint not null default 0 check (count >= 0),
  primary key (day, event, target)
);
alter table public.metric_counts enable row level security;
revoke all on public.metric_counts from public, anon, authenticated;
grant select, insert, update on public.metric_counts to service_role;

create or replace function public.increment_metric(
  metric_day date, metric_event text, metric_target text
) returns void
language sql security invoker set search_path = ''
as $$
  insert into public.metric_counts (day, event, target, count)
  values (metric_day, metric_event, metric_target, 1)
  on conflict (day, event, target)
  do update set count = public.metric_counts.count + 1;
$$;
revoke all on function public.increment_metric(date, text, text) from public, anon, authenticated;
grant execute on function public.increment_metric(date, text, text) to service_role;
commit;
