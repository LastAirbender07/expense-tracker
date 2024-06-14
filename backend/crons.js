import cron from 'cron';
import https from 'https';

const URL = "https://expense-tracker.onrender.com";

const job = new cron.CronJob('*/14 * * * *', function() {
    https.get(URL, (res) => {
        if (res.statusCode === 200) {
            console.log(`Successfully pinged ${URL}`);
        } else {
            console.error(`Failed to ping ${URL}`, res.statusCode);
        }
    }).on('error', (e) => {
        console.error(`Error while sending req to: ${URL}`, e);
    });
});