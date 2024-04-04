import * as fs from 'fs'
import moment from 'moment'

export class MailSender {
    public static send(id: number, email: string): void {
        const fileName = `${__dirname}/../../mails/mail_for_${id}_${moment().format('YYYY-MM-DD_hh_mm_ss')}.txt`;
        fs.writeFileSync(fileName, email);
    }
}
