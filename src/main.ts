import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSettings } from './settings/apply.app.settings';
import { SETTINGS } from './settings/app.settings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  applyAppSettings(app);

  await app.listen(SETTINGS.PORT, () => {
    console.log(`App starting on ${SETTINGS.PORT} port`);
  });
}

bootstrap();
