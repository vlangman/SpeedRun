import { Router } from 'express';
import { TestController } from './controllers/test.controller';
import { FlowController } from './controllers/flow.controller';

const router = Router();

// Test routes
router.post('/tests/start-codegen', TestController.startCodegen);
router.get('/tests', TestController.getAllTests);
router.post('/tests', TestController.addTest);
router.delete('/tests/:id', TestController.deleteTest);
router.post('/tests/execute', TestController.executeTest);
router.post('/tests/record', TestController.recordTest);

// Flow routes
router.post('/flows', FlowController.createFlow);
router.get('/flows', FlowController.getAllFlows);
// router.post('/flows/execute', FlowController.executeFlow);
router.post('/flows/test', FlowController.testFlow);
router.put('/flows', FlowController.updateFlow);

export default router;


