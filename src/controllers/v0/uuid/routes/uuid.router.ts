import { Router, Request, Response } from 'express'
import { UUIDValidate } from '../models/UUIDValidate'
import { NextFunction } from 'connect'
import * as AWS from '../../../../aws'
import * as c from '../../../../config/config'
import * as request from 'superagent'
import { createLogger } from '../../../../utils/logger'
import { uuid, isUuid } from 'uuidv4'

const logger = createLogger('uuid')
const router: Router = Router()

// Get a random UUID from the producing API and verify it
router.get('/', async (req: Request, res: Response) => {
  logger.info(`Get new UUID`)

  const newUuid = await request.get(`http://localhost:8220/api/v0/uuid`)

  logger.info(`Validate UUID: ${newUuid.body.uuid}`)

  const validatedUuid = await request.get(`http://localhost:8220/api/v0/uuid/validate/${newUuid.body.uuid}`)

  res.send(new UUIDValidate(validatedUuid.body.uuid, validatedUuid.body.isValid))
})

export const UUIDRouter: Router = router
