import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export const ENV = {
  config_file_path: process.env.CONFIG_FILE_PATH,
  fixer_api_key: process.env.FIXER_API_KEY,
  email: process.env.EMAIL,
  email_password: process.env.EMAIL_PASSWORD,
  smtp_domain: process.env.SMTP_DOMAIN,
  email_receiver: process.env.EMAIL_RECEIVER,
};
