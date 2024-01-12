import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Put,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '../Services/config.service';
import { CurrencyConfig } from '../Models/currency-config.model';

@Controller()
export class CurrencyConfigController {
  public constructor(private readonly configService: ConfigService) {}

  @Get('/config/all')
  public async getAllConfig(@Res() res: Response): Promise<Response> {
    const config = await this.configService.getAllCurrenciesConfig();
    return res.status(HttpStatus.OK).json(config);
  }

  @Put('/config/update')
  public async updateCurrencyConfig(
    @Res() res: Response,
    @Body() currencyConfig: CurrencyConfig,
  ): Promise<Response> {
    this.configService.updateCurrencyConfig(currencyConfig);
    return res.status(HttpStatus.NO_CONTENT).json();
  }
}
