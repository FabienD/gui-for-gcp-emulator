import { SettingsType } from '../components/emulator/Settings';
import { PubSubMessageType } from '../components/pubsub/PublishMessage';
import {
  SubscriptionNameType,
  SubscriptionType,
} from '../components/pubsub/Subscription';
import { TopicNameType } from '../components/pubsub/Topic';
import { TopicFormType } from '../components/pubsub/TopicCreate';
import { stringToLabels } from '../utils/pubsub';

export function getTopics(settings: SettingsType): Promise<Response> {
  return fetch(
    `http://${settings.host}:${settings.port}/v1/projects/${settings.project_id}/topics`,
  );
}

export function getTopic(
  settings: SettingsType,
  topicName: TopicNameType,
): Promise<Response> {
  return fetch(
    `http://${settings.host}:${settings.port}/v1/projects/${settings.project_id}/topics/${topicName.name}`,
  );
}

export function createTopic(
  settings: SettingsType,
  topic: TopicFormType,
): Promise<Response> {
  return fetch(
    `http://${settings.host}:${settings.port}/v1/projects/${settings.project_id}/topics/${topic.name}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        labels: stringToLabels(topic.labels),
        messageRetentionDuration: topic.messageRetentionDuration
          ? topic.messageRetentionDuration
          : undefined,
      }),
    },
  );
}

export function deleteTopic(
  settings: SettingsType,
  topicName: TopicNameType,
): Promise<Response> {
  return fetch(
    `http://${settings.host}:${settings.port}/v1/projects/${settings.project_id}/topics/${topicName.name}`,
    {
      method: 'DELETE',
    },
  );
}

export function getTopicSubscriptions(
  settings: SettingsType,
  topicName: TopicNameType,
): Promise<Response> {
  return fetch(
    `http://${settings.host}:${settings.port}/v1/${topicName.name}/subscriptions`,
    {
      method: 'GET',
    },
  );
}

export function getSubscriptions(settings: SettingsType): Promise<Response> {
  return fetch(
    `http://${settings.host}:${settings.port}/v1/projects/${settings.project_id}/subscriptions`,
  );
}

export function createSubscription(
  settings: SettingsType,
  subscription: SubscriptionType,
): Promise<Response> {
  return fetch(
    `http://${settings.host}:${settings.port}/v1/projects/${settings.project_id}/subscriptions/${subscription.name}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: subscription.topic,
        pushConfig: {
          pushEndpoint: subscription.pushConfig?.pushEndpoint,
        },
      }),
    },
  );
}

export function deleteSubscription(
  settings: SettingsType,
  subscriptionName: SubscriptionNameType,
): Promise<Response> {
  return fetch(
    `http://${settings.host}:${settings.port}/v1/${subscriptionName.name}`,
    {
      method: 'DELETE',
    },
  );
}

export function publishMessage(
  settings: SettingsType,
  topicName: TopicNameType,
  pubSubMessage: PubSubMessageType,
): Promise<Response> {
  return fetch(
    `http://${settings.host}:${settings.port}/v1/projects/${settings.project_id}/topics/${topicName.name}:publish`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            attributes: pubSubMessage.attributes,
            data: pubSubMessage.data,
          },
        ],
      }),
    },
  );
}

export function pullSubscription(
  settings: SettingsType,
  subscriptionName: SubscriptionNameType,
  maxMessages: number = 1,
): Promise<Response> {
  return fetch(
    `http://${settings.host}:${settings.port}/v1/projects/${settings.project_id}/subscriptions/${subscriptionName.name}:pull`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        returnImmediately: true,
        maxMessages: maxMessages,
      }),
    },
  );
}

export function ackSubscription(
  settings: SettingsType,
  subscriptionName: SubscriptionNameType,
  ackId: string,
): Promise<Response> {
  return fetch(
    `http://${settings.host}:${settings.port}/v1/projects/${settings.project_id}/subscriptions/${subscriptionName.name}:acknowledge`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ackIds: [ackId],
      }),
    },
  );
}
