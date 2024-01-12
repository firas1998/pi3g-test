import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ENV } from '../../../environment';
import { ConfigService } from '../../CurrencyConfig/Services/config.service';
import { ForexDataDTO } from '../DTOs/forex-data.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class ForexService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => ConfigService))
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  public async getForexData(isInit: boolean = false): Promise<ForexDataDTO> {
    const resp = await this.httpService
      .get('http://data.fixer.io/api/latest', {
        params: {
          access_key: ENV.fixer_api_key,
          base: 'EUR',
          symbols: isInit
            ? 'USD,GBP'
            : this.configService.getAllCurrencies().toString(),
        },
      })
      .toPromise();

    if (resp.data.success) {
      if (!isInit) {
        const forexData: ForexDataDTO = resp.data;
        for (const [key, value] of Object.entries(forexData.rates)) {
          this.configService.updateCurrencyConfig({
            currency: key,
            latestRate: value,
          });

          const currencyConfig = this.configService.getCurrencyConfig(key);
          if (
            currencyConfig.latestRate >
            currencyConfig.internalRate + currencyConfig.upperLimit
          ) {
          } else if (
            currencyConfig.latestRate <
            currencyConfig.internalRate - currencyConfig.lowerLimit
          ) {
            //send notification
          }
          await this.mailerService.sendMail({
            to: ENV.email_receiver, // list of receivers
            from: 'noreply@nestjs.com', // sender address
            subject: `${currencyConfig.currency} price crossing the upper limit`, // Subject line
            text: `${
              currencyConfig.currency
            } price crossing the upper limit of ${
              currencyConfig.internalRate + currencyConfig.upperLimit
            } at ${currencyConfig.latestRate}`, // plaintext body
            html: '<b>welcome</b>', // HTML body content
          });
        }
      }
      return resp.data;
    }

    if (resp.data.error.code === 104) {
      console.log('max requests reached');
    }
  }
}
