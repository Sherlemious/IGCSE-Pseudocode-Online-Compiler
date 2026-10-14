# Measuring whether a hint change helps

Every hint event carries `hint_version` (`HINT_VERSION` in
`app/src/modules/interpreter/analytics.ts`) and `hint_detail` (which explanation
within the hint was shown). **Bump `HINT_VERSION` whenever a hint's wording or
detection changes**, then compare the rows below before and after. Events from
before the version existed have no `hint_version` and show as `before`.

HogQL, project filters test accounts by default. Change the `hint_id` list and
the interval as needed. Wait for at least ~100 `shown` per row before reading
anything into a difference.

## 1. Episodes: did they get to working code, and how fast?

`hint_resolved` fires once per error episode (first failed run → next success).
`hint_shown` fires on every errored run, so `resolved / shown` is not a pure
rate, but it is comparable between versions of the same hint.

```sql
SELECT ifNull(properties.hint_version, 'before') AS version,
       properties.hint_id AS hint,
       ifNull(properties.hint_detail, '-') AS detail,
       countIf(event = 'hint_shown') AS shown,
       countIf(event = 'hint_resolved') AS resolved,
       round(avgIf(properties.runs_to_fix, event = 'hint_resolved'), 1) AS avg_runs_to_fix,
       round(avgIf(properties.secs_to_fix, event = 'hint_resolved')) AS avg_secs_to_fix
FROM events
WHERE event IN ('hint_shown', 'hint_resolved')
  AND properties.hint_id IN ('undeclared_variable', 'array_out_of_bounds', 'stray_else', 'stray_endif')
  AND timestamp > now() - INTERVAL 14 DAY
GROUP BY version, hint, detail
ORDER BY hint, version
```

## 2. Next run: did the very next run work, or did they re-run unchanged?

`code_run` after an error carries the hint that was shown on the previous run.
Only exists from the version that introduced `prev_hint_id`.

```sql
SELECT properties.prev_hint_id AS hint,
       ifNull(properties.prev_hint_detail, '-') AS detail,
       properties.hint_version AS version,
       count() AS next_runs,
       round(100 * countIf(properties.outcome = 'success') / count(), 1) AS success_pct,
       round(100 * countIf(properties.code_changed = false) / count(), 1) AS unchanged_pct
FROM events
WHERE event = 'code_run' AND properties.after_error = true
  AND properties.prev_hint_id IS NOT NULL
  AND timestamp > now() - INTERVAL 14 DAY
GROUP BY hint, detail, version
ORDER BY next_runs DESC
```

## 3. One-click renames

`hint_shown.has_fix` → `error_fix_applied` → `hint_resolved.used_fix`, split by
`fix_id` (`rename_typo`, `rename_case_mismatch`).

## Baseline (14 days to 2026-10-14, before context-aware diagnoses)

| hint | shown | resolved | avg runs to fix | avg secs to fix |
|------|------:|---------:|----------------:|----------------:|
| undeclared_variable | 2244 | 719 | 3.8 | 693 |
| stray_else | 407 | 53 | 5.8 | 235 |
| stray_endif | 339 | 63 | 4.9 | 136 |
| array_out_of_bounds | 302 | 70 | 3.6 | 2634 |
