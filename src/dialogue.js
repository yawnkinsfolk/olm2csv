const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function wantToValidateQuestion() {
    return new Promise(resolve => {
        rl.question(`Do you want to validate with date? [Y]es/[N]o: `, (answer) => {
            rl.pause();
            if (answer.match(/^Y$/i) === null && answer.match(/^N$/i) === null) {
                console.log('plz correctly answer');
                wantToValidateQuestion();
            }
            resolve(answer.match(/^Y$/i) !== null);
        })
    });
}


async function validateDateFromQuestion(ymd) {
    return new Promise(resolve => {
        rl.question(`When ${ymd} do you want to get data FROM? If you don\'t want to specify from date, press ENTER: `, (answer) => {
            rl.pause();
            if (answer === '') {
                console.log('ok, we won\'t validate');
                return '';
            }
            if (isNaN(answer)) {
                rl.resume();
                console.log('plz num');
                validateDateFromQuestion(ymd)
            }
            resolve(answer);
        })
    })
}

async function getValidateYMD() {
    const year = await validateDateFromQuestion('YEAR');
    const month = await validateDateFromQuestion('MONTH');
    const day = await validateDateFromQuestion('DAY');
    if (year === '' || month === '' || day === '') {
        return '';
    }
    return moment(`${year}-${month}-${day}`, 'YYYY-MM-DD')
}

async function getExpireDate() {
    const isYes = await wantToValidateQuestion();
    if (isYes === false) {
        console.log('ok, we won\'t validate!');
        return '';
    }
    if (await getValidateYMD() === '') {
        console.log('All Date')
        return ''
    }
    while (!(await getValidateYMD()).isValid()) {
        console.log('plz correctly');
    }
    const ymd = await getValidateYMD();
    console.log(ymd);
}

getExpireDate()
    .then((result) => console.log(result));
