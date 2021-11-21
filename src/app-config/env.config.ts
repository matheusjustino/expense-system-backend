import { join } from 'path';
import { config } from 'dotenv';
import { existsSync } from 'fs';

const envPath = join(process.cwd(), '.env');

if (existsSync(envPath)) {
	config({ path: envPath });
}
