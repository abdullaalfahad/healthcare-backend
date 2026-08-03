import app from './app';
import { envVariables } from './config/env';

const PORT = envVariables.PORT;

const bootstrap = () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
};

bootstrap();
