import * as Joi from 'joi';

export const configSchema = Joi.object({
  PORT: Joi.number().default(8080),
  DOMAIN: Joi.string().default('localhost'),

  DATABASE_URL: Joi.string().required(),
  DB_LOGGING: Joi.boolean().default(false),

  JWT_SECRET: Joi.string().required(),

  S3_ACCESS_KEY: Joi.string().required(),
  S3_SECRET_KEY: Joi.string().required(),
  S3_REGION: Joi.string().required(),
  S3_BUCKET_NAME: Joi.string().required(),
  S3_URL: Joi.string().required(),
  CLOUDFRONT_DOMAIN: Joi.string().required(),
  CLOUDFRONT_PUBLIC_KEY_ID: Joi.string().required(),

  STRIPE_SECRET_KEY: Joi.string().required(),
  STRIPE_PUBLISHABLE_KEY: Joi.string().required(),
  STRIPE_WEBHOOK_CONNECT_SECRET: Joi.string().required(),
  STRIPE_WEBHOOK_ACCOUNT_SECRET: Joi.string().required(),

  WEB_APP_URL: Joi.string().required(),

  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.number().required(),
  MAIL_USER: Joi.string().required(),
  MAIL_PASS: Joi.string().required(),

  GOOGLE_CLIENT_ID: Joi.string().required(),
});
