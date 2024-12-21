import { TopicType } from '../components/pubsub/Topic';

function shortName(item: string): string {
  return item.replace(/projects\/[^\/]+\/(topics|subscriptions)\//i, '');
}

function labelsToString(topic: TopicType): string {
  let labels: string = '';
  if (topic.labels !== undefined) {
    for (const [key, value] of Object.entries(topic.labels)) {
      const tag = key + ':' + value;
      labels += labels.length > 0 ? ' ,' + tag : tag;
    }
  }
  return labels;
}

function stringToLabels(input?: string): { [key: string]: string } | null {
  if (input === undefined) {
    return null;
  }

  const obj: { [key: string]: string } = {};
  const labels = input.split(', ');

  labels.forEach(pair => {
    const [key, value] = pair.split(':');
    if (key && value) {
      obj[key.trim()] = value.trim();
    }
  });

  return obj;
}

export { shortName, labelsToString, stringToLabels };
