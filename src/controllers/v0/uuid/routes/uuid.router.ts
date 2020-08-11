import { Router, Request, Response } from 'express'
import { UUIDValidate } from '../models/UUIDValidate'
import * as request from 'superagent'
import { createLogger } from '../../../../utils/logger'

const logger = createLogger('uuid')
const router: Router = Router()

// Get a random UUID from the producing API and verify it
router.get('/', async (req: Request, res: Response) => {

  let newUuid;
  let validatedUuid;

  try {
    logger.info(`Get new UUID`)
    newUuid = await request.get(`http://localhost:8220/api/v0/uuid`)
  } catch (e) {
    res.send({
      message: `Error getting UUID: ${e}`
    })
  }

  try {
    logger.info(`Validate UUID: ${newUuid.body.uuid}`)
    validatedUuid = await request.get(`http://localhost:8220/api/v0/uuid/validate/${newUuid.body.uuid}`)
  } catch (e) {
    res.send({
      message: `Error validating UUID ${newUuid}: ${e}`
    })
  }

  res.send(new UUIDValidate(validatedUuid.body.uuid, validatedUuid.body.isValid))
})

export const UUIDRouter: Router = router
