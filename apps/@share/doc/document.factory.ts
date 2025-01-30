import { INestApplication } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export const documentFactory = (
  app: INestApplication,
  configs: Omit<OpenAPIObject, 'paths'>[],
) => {
  configs?.map((config) => {
    SwaggerModule.setup('api', app, () =>
      SwaggerModule.createDocument(app, config),
    );
  });
};
