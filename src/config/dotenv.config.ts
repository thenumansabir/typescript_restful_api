import * as dotenv from 'dotenv';

const result = dotenv.config();

if (result.error) {
  console.error('Error loading .env file');
  throw result.error;
}
