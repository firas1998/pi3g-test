import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ForexModule } from './Forex/Modules/forex.module';
import { ConfigModule } from './CurrencyConfig/Modules/currency-config.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { ENV } from '../environment';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: `smtps://${ENV.email}:${ENV.email_password}@${ENV.smtp_domain}`,
      defaults: {
        from: '"Pi3G" <pi3g@nestjs.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ScheduleModule.forRoot(),
    ForexModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
