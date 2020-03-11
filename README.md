# olm2csv

This is for importing calendar events to google calendar with csv by way of converting olm into csv.

## Mapping olm elements to csv columns

| olm elements | csv columns |
| --- | --- |
| OPFCalendarEventCopySummary | Subject |  
| OPFCalendarEventCopyStartTime br OPFCalendarEventCopyEndTimeZone| Start Date |
| OPFCalendarEventCopyStartTime br OPFCalendarEventCopyStartTimeZone | Start Time |
| OPFCalendarEventCopyEndTime br OPFCalendarEventCopyEndTimeZone | End Date |
| OPFCalendarEventCopyEndTime br OPFCalendarEventCopyEndTimeZone | End Time |
| OPFCalendarEventGetIsAllDayEvent | All Day Event |
| OPFCalendarEventCopyDescriptionPlain | Description |
| OPFCalendarEventCopyLocation | Location |
| OPFCalendarEventGetIsPrivate | Private |
