import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import logger from '../../logger'

// eslint-disable-next-line no-shadow
export enum ApiAction {
  Download = 'DOWNLOAD',
}

interface SendEvent {
  what: string
  who: string
  subjectId: string
  correlationId: string
  details?: string
}

export interface AuditService {
  sendEvent: (object: SendEvent) => Promise<void>
}

interface AuditMessage {
  what: string
  when: Date
  who: string
  subjectId: string
  service: string
  correlationId: string
  details?: string
}

/*
  build: the commit hash
*/
export const auditService = ({
  sqsClient,
  queueUrl,
  serviceName,
  enabled,
}: {
  sqsClient: SQSClient
  queueUrl: string
  serviceName: string
  enabled: boolean
}): AuditService => {
  const sendMessage = async (message: AuditMessage) => {
    if (enabled) {
      try {
        const messageResponse = await sqsClient.send(
          new SendMessageCommand({ MessageBody: JSON.stringify(message), QueueUrl: queueUrl }),
        )
        logger.info(`Page view sent to audit (${messageResponse.MessageId})`)
      } catch (error) {
        logger.error('Problem sending page view to audit', error)
      }
    }
  }

  const sendEvent = async (event: SendEvent) => {
    await sendMessage({
      service: serviceName,
      when: new Date(),
      ...event,
    })
  }

  return {
    sendEvent,
  }
}
