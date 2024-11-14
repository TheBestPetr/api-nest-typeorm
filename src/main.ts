import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSettings } from './settings/apply.app.settings';
import { DB_SETTINGS, SETTINGS } from './settings/app.settings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  applyAppSettings(app);

  await app.listen(SETTINGS.PORT, () => {
    console.log(`App starting on port: ${SETTINGS.PORT}`);
    console.log(
      `App connect to db: ${DB_SETTINGS.USED_DB === 'PROD' ? 'Prod' : 'TEST'}`,
    );
  });
}

bootstrap();
