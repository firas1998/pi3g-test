import { Module, forwardRef } from '@nestjs/common';
import { ConfigService } from '../Services/config.service';
import { CurrencyConfigController } from '../Controllers/currency-config.controller';
import { ForexModule } from '../../Forex/Modules/forex.module';

@Module({
  imports: [forwardRef(() => ForexModule)],
  controllers: [CurrencyConfigController],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
