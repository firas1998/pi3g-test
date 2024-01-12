import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '../../CurrencyConfig/Modules/currency-config.module';
import { ForexService } from '../Services/forex.service';

@Module({
  imports: [HttpModule, forwardRef(() => ConfigModule)],
  providers: [ForexService],
  exports: [ForexService],
})
export class ForexModule {}
