# NWH Log (NWH Boiler Log)

Offline web app (navy plant-safety theme) for the Northwest Hardwoods boiler operator job. No accounts, no tracking, no network: everything is stored on the device (localStorage, plus automatic snapshots in IndexedDB).

Install: open https://hoppb6-ai.github.io/nwh-boiler-log/ in Safari → Share → Add to Home Screen. PIN: 5295. The app locks itself after 5 minutes in the background.

Screens
- Home: calendar of work days (worked, OT, PTO/Sick/Holiday, checklist, AOC and note markers), Clock in/out, month and pay-period hours (hours only), today's checklist and open AOCs. Tap a day to edit everything for that day.
- Checklist: the ordered 12-item daily checklist (Fill Evap Tank, Collect water samples, 7 meters, Boiler 1/2 system checks, Water sample check with optional sulfite/pH/conductivity per boiler). Meter fields take digits only (hour meters allow up to 2 decimals) and show previous / today / usage. Entering a value checks the item. The checklist can be edited in More (order, names, value fields, units, normal ranges).
- Meters: history per meter with 7-day and 30-day averages.
- AOCs: Abnormal Operating Conditions (Probable vs Actual, equipment, severity, status, actions, tags), searchable and filterable.
- Boiler log (pressure, water level checks, fuel, incidents/maintenance, notes) and Shifts & hours (shift, start/end, break, hours, OT flag): from Home or More.
- Notes: search across notes, boiler log, checklist notes and AOCs.

Editor / Spreadsheet (on the phone: Cards or a scaled Fit-table preview; the page never scrolls sideways)
Checklist, Meters, AOCs, Boiler log and Shifts each have an Editor / Spreadsheet toggle. Spreadsheets have range pickers (This week, Last 7, Last 30, This month, Pay period, All, Custom) and newest/oldest sorting. Exports:
- PNG: landscape US Letter at 300 dpi (3300 x 2550 px), one image per page.
- PDF: landscape US Letter, multi-page (made on the device, no libraries).
- CSV.
Each page has the title, date range, "Northwest Hardwoods — Boiler Operator", page numbers, an navy header strip and column headers, shaded rows, a Notes/AOC status box and an initials line. Flags also use symbols so they survive black-and-white printing: ✓ done, ✗ missed, ! out of range or attention, ‼ High open AOC. Wide tables shrink the font, then split column groups across pages (the Date column repeats). On iPhone the share sheet opens (Save to Files / Photos); otherwise files download.

Backups
- Save / Save As (header or More), Restore (snapshots or a file), startup recovery if data is damaged, reminder after 3 days without a saved file.
- Restore also accepts a Hopp backup: work days, checklist template, meter readings, AOCs and work settings are imported; invoices, quotes, jobs, customers, personal and money settings are ignored.

Example data is only added from More → Example data, and can be removed there.
