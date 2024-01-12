import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CurrencyConfig } from '../Models/currency-config.model';
import JSONdb = require('simple-json-db');
import { ENV } from '../../../environment';
import { ForexService } from '../../Forex/Services/forex.service';

@Injectable()
export class ConfigService {
  private readonly configFilePath = ENV.config_file_path;

  private _config: JSONdb;

  public constructor(
    @Inject(forwardRef(() => ForexService))
    private readonly forexService: ForexService,
  ) {
    this._config = new JSONdb<CurrencyConfig>(this.configFilePath);
  }

  public async initializeConfig(): Promise<void> {
    const forexData = await this.forexService.getForexData(true);
    for (const [key, value] of Object.entries(forexData.rates)) {
      this.addCurrencyConfig({
        currency: key,
        latestRate: value,
        internalRate: value,
        upperLimit: 0.3,
        lowerLimit: 0.2,
      });
    }
  }

  public async getAllCurrenciesConfig(): Promise<CurrencyConfig[]> {
    let config = this._config.JSON();

    if (Object.keys(config).length === 0) {
      await this.initializeConfig();
      config = this._config.JSON();
    }

    const allCurrenciesConfig: CurrencyConfig[] = [];
    for (const [key, value] of Object.entries(config)) {
      allCurrenciesConfig.push(value);
    }

    return allCurrenciesConfig;
  }

  public getAllCurrencies(): string[] {
    const allCurrencies: string[] = [];

    const config = this._config.JSON();
    for (const [key, value] of Object.entries(config)) {
      allCurrencies.push(key);
    }

    return allCurrencies;
  }

  public getCurrencyConfig(currency: string): CurrencyConfig {
    return this._config.get(currency) as CurrencyConfig;
  }

  public addCurrencyConfig(currency: CurrencyConfig): void {
    if (this._config.has(currency.currency)) {
      return;
    }

    this._config.set(currency.currency, currency);
  }

  public updateCurrencyConfig(currency: CurrencyConfig): void {
    const config = this.getCurrencyConfig(currency.currency);

    if (currency.latestRate) {
      config.latestRate = currency.latestRate;
    }

    if (currency.internalRate) {
      config.internalRate = currency.internalRate;
    }

    if (currency.lowerLimit) {
      config.lowerLimit = currency.lowerLimit;
    }

    if (currency.upperLimit) {
      config.upperLimit = currency.upperLimit;
    }

    this._config.set(currency.currency, config);
  }
}
