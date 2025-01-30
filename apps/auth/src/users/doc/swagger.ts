import { DocumentBuilder } from '@nestjs/swagger';

const userDocConfig = new DocumentBuilder()
  .setTitle('Users')
  .setDescription('Users API documentation')
  .setVersion('1.0.0')
  .addTag('users')
  .build();

export { userDocConfig };
