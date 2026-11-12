import topics from './astrologyTopics.json';
export const astrologyTopics = topics;
export function findAstrologyTopic(query: string) {
  const text = query.trim().toLowerCase();
  return topics.find(topic => topic.keywords.some(keyword => text.includes(keyword)) || text.includes(topic.en.toLowerCase()) || text.includes(topic.te));
}
export function astrologyTopicQuery(id: string): string {
  const topic = topics.find(item => item.id === id);
  return topic ? 'I would like to discuss ' + topic.en.toLowerCase() + ' (' + topic.te + ').' : '';
}
export function astrologyTopicLabel(id: string): string {
  const topic = topics.find(item => item.id === id);
  return topic ? topic.en + ' / ' + topic.te : 'General consultation';
}
