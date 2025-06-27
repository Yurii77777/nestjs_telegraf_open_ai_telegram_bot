import { Topic } from 'src/types/searchGoogle';
import { BASE_SUFFIX, QUERY_TOPICS } from 'src/constants/common.constants';

export class TelegramUtils {
  createQuery(topic: Topic): string {
    const now = new Date();
    const monthYear = now.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    });

    const baseSuffix = `${BASE_SUFFIX} ${monthYear}`;

    return `${QUERY_TOPICS[topic]} ${baseSuffix}`;
  }
}
