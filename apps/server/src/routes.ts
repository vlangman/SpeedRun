import { Router } from 'express';
import { TestController } from './controllers/test.controller';
import { FlowController } from './controllers/flow.controller';
import { ChainController } from './controllers/chain.controller';

const router = Router();

// Test routes
router.post('/tests/start-codegen', TestController.startCodegen);
router.get('/tests', TestController.getAllTests);
router.post('/tests', TestController.addTest);
router.delete('/tests/:id', TestController.deleteTest);
router.post('/tests/execute', TestController.executeTest);
router.post('/tests/record', TestController.recordTest);
router.put('/tests/code', TestController.updateTestCode);

// Flow routes
router.post('/flows', FlowController.createFlow);
router.get('/flows', FlowController.getAllFlows);
router.post('/flows/test', FlowController.testFlow);
router.put('/flows', FlowController.updateFlow);


//chain routes
router.post('/chain', ChainController.createChain);
router.get('/chain', ChainController.getAllChains);
router.post('/chain/test', ChainController.testChain);
router.put('/chain', ChainController.updateChain);



export default router;


