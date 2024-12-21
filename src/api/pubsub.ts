import { getTopics as apiGetTopics } from './gcp.pubsub';
import { SettingsType } from '../components/emulator/Settings';
import { TopicType } from '../components/pubsub/Topic';

export async function getTopics(
  settings: SettingsType,
): Promise<[TopicType] | []> {
  const response = await apiGetTopics(settings);
  const content = await response.json();

  if (
    content != undefined &&
    content.topics != undefined &&
    content.topics.length > 0
  ) {
    return content.topics;
  }

  return [];
}
