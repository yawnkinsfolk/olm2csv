const _ = require('lodash');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const fs = require('fs');
const moment = require('moment');
const tz = require('moment-timezone');
const readline = require('readline');
// const readlineSync = require('readline-sync');
const csvColumns = [
    'Subject',
    'Start Date',
    'Start Time',
    'End Date',
    'End Time',
    'All Day Event',
    'Description',
    'Location',
    'Private',
];

function get() {
    const fileName = 'tests';
    const xml = fs.readFileSync(`storage/${fileName}.xml`, "utf-8");

    const doc = new dom().parseFromString(xml);
    const nodes = xpath.select("//appointment", doc);
    let events = [];
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].childNodes === null) {
            continue;
        }
        var event = {};
        for (let j = 0; j < nodes[i].childNodes.length; j++) {
            if (nodes[i].childNodes === null) {
                continue;
            }

            if (nodes[i].childNodes[j].firstChild === null) {
                continue;
            }

            const value = nodes[i].childNodes[j].firstChild.data;
            switch (nodes[i].childNodes[j].nodeName) {
                case 'OPFCalendarEventCopySummary':
                    event['Subject'] = escape(value);
                    break;
                case 'OPFCalendarEventCopyStartTime':
                    event['index'] = moment(value).format('x');
                    event['Start Date'] = escape(dateFormat(value, 'date'));
                    event['Start Time'] = escape(dateFormat(value, 'time'));
                    break;
                case 'OPFCalendarEventCopyEndTime':
                    event['End Date']= escape(dateFormat(value, 'date'));
                    event['End Time']= escape(dateFormat(value, 'time'));
                    break;
                case 'OPFCalendarEventGetIsAllDayEvent':
                    event['All Day Event'] = escape(Boolean(parseInt(value)));
                    break;
                case 'OPFCalendarEventCopyDescriptionPlain':
                    event['Description'] = escape(value);
                    break;
                case 'OPFCalendarEventCopyLocation':
                    event['Location'] = escape(value);
                    break;
                case 'OPFCalendarEventGetIsPrivate':
                    event['Private'] = escape(Boolean(parseInt(value)));
                    break;
            }
        }
        if (Object.keys(event).length !== 0) {
            events[i] = event;
        }
    }

    events = _.orderBy(events, ['index'], ['asc']);

    log(events);

    fs.writeFileSync(
        `storage/${fileName}.csv`,
        `${makeHeader()}\n${makeRecords(events)}`
    );
}

function log(events) {
    const t = events[events.length - 1]['Subject'];
    const s = events[events.length - 1]['index'];
    const now = moment().format()
    appendExecutionDate("storage/execution.md", `| ${now} | ${t} | ${s} |\n`);
}

function escape(value) {
    if (typeof value === 'string') {
        value = value
            .replace(/"/g, '\\"')
            .replace(/,/g, '\\,');
    }
    return `"${value}"`;
}

function dateFormat(datetime, which = 'date') {
    let m = moment.utc(datetime, 'YYYY-MM-DDTHH:mm:ss');
    m.tz('Asia/Tokyo');
    switch (which) {
        case 'date':
            return m.format('MM/DD/YYYY');
        case 'time':
            return m.format('hh:mm A');
        default:
            return '';
    }
}


function appendExecutionDate(path, data) {
    fs.appendFile(path, data, function (err) {
        if (err) {
            throw err;
        }
    });
}

function makeHeader() {
    let header = '';
    let i = 1;
    Object.keys(csvColumns).map(function (index) {
        if (i === csvColumns.length) {
            header = `${header}${csvColumns[index]}`;
        } else {
            header = `${header}${csvColumns[index]},`;
        }
        i += 1;
    });
    return header;
}

function makeRecords(events) {
    let records = '';
    events.forEach((event) => {
        let record = '';
        csvColumns.forEach((csvColumn) => {
            let delimiter = csvColumn === csvColumns[csvColumns.length - 1] ? '' : ',';
            let val = typeof event[csvColumn] === "undefined" ? '' : event[csvColumn];
            record = `${record}${val}${delimiter}`
        });
        records = `${records}${record}\n`;
    });
    return records;
}

get();