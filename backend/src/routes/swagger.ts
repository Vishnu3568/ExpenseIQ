import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../swagger.json';

const router = Router();

// Mount swagger UI at the root of the router
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
