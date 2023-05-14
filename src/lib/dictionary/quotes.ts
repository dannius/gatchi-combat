import { NotifyMessage } from '../types';
import { random } from '../util';
import { Media } from './dictionary-messages';

const quotes = ['quote 1', 'quote 2', 'quote 3', 'quote 4', 'quote 5', 'quote 6'];
const medias: Media[] = [
  {
    type: 'photo',
    id: 'AgACAgIAAxkBAANRZGAiLRGdv_GqcjTqxsT8MbOcKnYAAprGMRuPBQhLIK8h7VRC-AoBAAMCAANtAAMvBA',
  },
  {
    type: 'video',
    id: 'CgACAgIAAxkBAANkZGA2YbkRkCBJObW1qMZZe2OW-IAAAp8rAAKPBQhLjhZczgmGy-QvBA',
  },
];

export function getQuoteOfTheDay(): NotifyMessage {
  const quoteIndex = random(0, quotes.length - 1);
  const mediaIndex = random(0, medias.length - 1);

  return {
    message: quotes[quoteIndex],
    media: medias[mediaIndex],
  };
}
