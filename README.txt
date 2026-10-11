# NWH Log (NWH Boiler Log)

Offline web app (navy plant-safety theme) for the Northwest Hardwoods boiler operator job. No accounts, no tracking, no network: everything is stored on the device (localStorage, plus automatic snapshots in IndexedDB).

Install: open https://hoppb6-ai.github.io/nwh-boiler-log/ in Safari → Share → Add to Home Screen. PIN: 5295. The app locks itself after 5 minutes in the background.

Screens
- Home: calendar of logged days (checklist complete/partial, AOC and notes/boiler log markers), this month's days logged, full checklists and AOCs, today's checklist and open AOCs. Tap a day to edit everything for that day. A day counts as logged when it has checklist, boiler log, AOC or note data.
- Time of task: every checklist item and the boiler log have an editable Time (HH:MM). It fills in automatically when you check an item or enter a value, and you can change or clear it. AOCs keep their own time. Times appear in the spreadsheet cards, table, PNG/PDF and CSV. There is no clock in/out or shift/hours tracking.
- Checklist: the ordered 12-item daily checklist (Fill Evap Tank, Collect water samples, 7 meters, Boiler 1/2 system checks, Water sample check with 4 sections: Feed water, Condensate, Boiler 1, Boiler 2; each has its own tests (default Sulfite ppm, pH, Conductivity µS/cm), time and note. Tests, units and normal ranges are set per section in More → Checklist (add e.g. Hardness, remove or rename tests); out-of-range values show "!" in amber. Older Boiler 1/2 values move into their sections automatically). Meter fields take digits only (hour meters allow up to 2 decimals) and show the previous and current readings with their dates (MM/DD/YYYY: value). Hour meters show run time ("Ran 23.8 hrs", "since MM/DD/YYYY" over a gap); Gas, Boiler 2 Gas, Day bin and Water show the exact amount "Used 1,450". Spreadsheet totals show Total run / Total used; resource meters also get an Avg/day line. Negative differences are flagged "!" (rollover or typo). Entering a value checks the item. The checklist can be edited in More (order, names, value fields, units, normal ranges).
- Water sample notes: tap ⓘ next to the overall check, each section and each test for a short explanatory note (general guidance only). Edit them in More → Checklist (Reset to default restores the original text); new tests start with an empty note. Notes are stored in settings and backups, not in exports.
- Chemical additions (right after the water sample check): add as many entries per day as needed, each with chemical (editable list with ⓘ notes), amount + unit, applied to (Feed water or Feed steam; feed points are editable in More), time (auto-filled, editable), reason (optionally linked to an out-of-range reading) and a note. They show in the Checklist spreadsheet (Chemical additions column), PNG/PDF/CSV, Notes search, backups, and as an outlined dot on the calendar.
- Water test frequency: each water test has How often (Daily, Weekly + weekday, Monthly + day, As needed) in More → Checklist. Sulfite and Conductivity default to Daily, pH to As needed. Tests not due that day are hidden behind a small '+ pH' link; due ones show a 'Due' tag. Exports include a non-daily test column only when the range has values for it.
- Scheduled tasks / PM: More → Scheduled tasks to add/edit/delete/reorder recurring tests and maintenance (name, frequency: Daily, Weekly + weekday, Every N weeks, Monthly + day, Quarterly, Semi-annual, Annual, Every N days; start date; equipment; optional value with unit/range; ⓘ note; active). 'Load starter PM list' adds 5 common boiler tasks (skips duplicates). Next due is counted from the date a task was actually done (per task you can switch to fixed calendar dates). Due and overdue items ('! Overdue Xd', amber, red after 7 days) show in a 'Due today' card under the checklist with Done, time, value and note. The PM screen lists every task with last done, next due and status, with Editor/Spreadsheet and PNG/PDF/CSV exports. Calendar: green square = PM done, amber outline = PM due.
- Time fields are compact (🕒 Time + a 96px box, '--:--' when empty) on the checklist, water sections, chemical additions, PM and boiler log.
- Meters: history per meter with 7-day and 30-day averages.
- AOCs: Abnormal Operating Conditions (Probable vs Actual, equipment, severity, status, actions, tags), searchable and filterable.
- Boiler log (time, pressure, water level checks, fuel, incidents/maintenance, notes): from Home or More.
- Notes: search across notes, boiler log, checklist notes and AOCs.

Editor / Spreadsheet (on the phone: Cards or a scaled Fit-table preview; the page never scrolls sideways)
Checklist, Meters, AOCs, and Boiler log each have an Editor / Spreadsheet toggle. Spreadsheets have range pickers (This week, Last 7, Last 30, This month, All, Custom) and newest/oldest sorting. Exports:
- PNG: landscape US Letter at 300 dpi (3300 x 2550 px), one image per page.
- PDF: landscape US Letter, multi-page (made on the device, no libraries).
- CSV.

Backups
- Save / Save As (header or More), Restore (snapshots or a file), startup recovery if data is damaged, reminder after 3 days without a saved file.
- Restore also accepts a Hopp backup: work days, checklist template, meter readings, AOCs and work settings are imported; invoices, quotes, jobs, customers, personal and money settings are ignored.

Example data is only added from More → Example data, and can be removed there.

AOC library (AOCs tab): AOCs are a reference library separate from the daily log. Each entry has title, equipment, category, severity, status, Probable vs Actual, actions/resolution, tags, related AOCs and dated occurrences ("Seen N times"). Search and filter by equipment, category, tag, status and severity; the list is grouped by equipment. "Log occurrence again" adds a dated occurrence to the same entry (and reopens it if it was resolved) instead of creating a duplicate. The daily log shows only a link "AOCs logged today (n)". Older AOCs were converted to entries with one occurrence each. The AOC spreadsheet/exports list one row per occurrence.

Exports: PNG/PDF pages have the header, the table and the footer (initials / page X of Y); there is no Notes/AOC status box.

Hour-meter check (data is never changed): when both readings have a Time, the run hours are compared with the elapsed time between reads. "Ran 27 hrs (27 hrs between reads)" is fine; more run than elapsed is flagged amber "! Ran 27 hrs in 26.5 hrs elapsed, check reading". Without times, more than 24 hrs over a 1-day gap shows "! Check: >24 hrs between dated reads; add read times to confirm". Flags show in the app, cards, table, PNG/PDF and CSV.

Spreadsheet Cards: each card groups its values into mini blocks (e.g. one per meter, with the meter name as a small bold heading and Reading / Used or Ran (hrs) rows). Every label/value row has a thin divider and alternating shading; heavier lines separate the blocks.

Number format: all displayed numbers use thousands separators (8,965,770), in the app and PNG/PDF; CSV stays raw (no commas). Each meter has a Decimals setting in More → Checklist (defaults: Boiler 2 hour 2, Boiler 1 hour and Scrubber hour 1, other meters 0); readings and Ran/Used show exactly that many decimals. Stored values are unchanged, and inputs still accept up to 2 decimals.

v2.0 polish and power features
- Home dashboard: a progress ring for today's checklist, plus tiles for today's flags, PM due/overdue, open AOCs and days since the last backup file.
- Trends (Home, More): charts of meter Used/Ran per reading over 7/30/90 days, and water-test lines with the normal range shaded. Flags carry a '!' so they print in B&W. Export as landscape PNG/PDF.
- Daily report: a one-tap shift handoff sheet for any day (checklist with times, meters with Used/Ran, water tests with flags, chemical additions, PM, AOCs, boiler log and notes). Landscape letter PNG/PDF, multi-page when needed.
- Smart entry: Next/Enter moves to the next meter, and tapping a meter's readings shows its last 5. You're asked to confirm before saving a reading lower than the previous one. Meter inputs have larger tap targets.
- Round mode: a full-screen walk through the checklist, one item per screen with big inputs. It advances on Done/Enter and ends with a summary of missed items and flags.
- Dark mode: Auto (follows the phone), Light or Dark in More → Display. Exports always print light.
- Button press feedback, an offline-ready badge and the app version in More.

24-hour times and read timestamps
- Every time field is a 24-hour HH:MM text field with a Now button (no AM/PM picker). Typing 1345 becomes 13:45 and 930 becomes 09:30; anything outside 00:00–23:59 is rejected. All displays, sheets, exports and CSV use 24-hour time.
- Each meter reading has a "Read on" date (log day by default, Next day, or another date), so a 01:30 read logged on the previous shift day is stamped correctly. Readings show as MM/DD/YYYY HH:MM.
- Elapsed time comes from the full stamps, so midnight and multi-day gaps are handled. Hour meters show "Ran X hrs over Y hrs between reads" and are flagged only when Ran > elapsed + 0.1 hr. Without both times: "Ran X hrs (add read time to compare)", no flag. Resource meters show "Used N over Y hrs between reads".
- Auto check stamps are never used as read times. A one-time cleanup removes times that came from a bulk import.
