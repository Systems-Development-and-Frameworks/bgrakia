import { describe, expect, it } from '@jest/globals';
import { mount } from '@vue/test-utils';
import NewsItem from '@/components/news-item/NewsItem';

require('regenerator-runtime/runtime');


const TITLE = 'Test-Title';
const VOTES = 0;

describe('NewsItem', () => {


  it('should show a h1 with news-title/news-votes and three buttons for upVote, downVote and remove', () => {
    const title = 'Test-Title';
    const votes = 0;
    const wrapper = mount(NewsItem, {
      propsData: {
        newsItem: {
          title: title,
          votes: votes,
        },
      },
    });

    const expectedText = title + ' ' + votes;

    const actualH1 = wrapper.find('h1');
    const actualUpvoteButton = wrapper.find('button.upvote');
    const actualDownvoteButton = wrapper.find('button.downvote');
    const actualRemoveButton = wrapper.find('button.remove');

    expect(actualH1).toBeDefined();
    expect(actualH1.text()).toEqual(expectedText);

    expect(actualUpvoteButton).toBeDefined();
    expect(actualDownvoteButton).toBeDefined();
    expect(actualRemoveButton).toBeDefined();

  });

  it('should emit upvoting-updateNews event once upvote-button is clicked', async () => {
    const wrapper = mount(NewsItem, {
      propsData: {
        newsItem: {
          title: TITLE,
          votes: VOTES,
        },
      },
    });

    const button = wrapper.find('button.upvote');
    button.trigger('click');

    await wrapper.vm.$nextTick();

    const expectedCallCount = 1;
    const upvoteEvent = wrapper.emitted().updateNews;

    expect(upvoteEvent).toBeTruthy();
    expect(upvoteEvent.length).toBe(expectedCallCount);

    const actualUpdatedNews = upvoteEvent[0][0];
    expect(actualUpdatedNews.title).toEqual(TITLE);
    expect(actualUpdatedNews.votes).toEqual(VOTES + 1);
  });

  it('should emit downvoting-updateNews event once downvote-button is clicked', async () => {
    const wrapper = mount(NewsItem, {
      propsData: {
        newsItem: {
          title: TITLE,
          votes: VOTES,
        },
      },
    });

    const button = wrapper.find('button.downvote');
    await button.trigger('click');

    const expectedCallCount = 1;
    const upvoteEvent = wrapper.emitted().updateNews;

    expect(upvoteEvent).toBeTruthy();
    expect(upvoteEvent.length).toBe(expectedCallCount);

    const actualUpdatedNews = upvoteEvent[0][0];
    expect(actualUpdatedNews.title).toEqual(TITLE);
    expect(actualUpdatedNews.votes).toEqual(VOTES - 1);
  });

  it('should emit removeNews event once remove-button is clicked', async () => {
    const wrapper = mount(NewsItem, {
      propsData: {
        newsItem: {
          title: TITLE,
          votes: VOTES,
        },
      },
    });

    const button = wrapper.find('button.remove');
    button.trigger('click');

    await wrapper.vm.$nextTick();

    const expectedCallCount = 1;
    const upvoteEvent = wrapper.emitted().removeNews;

    expect(upvoteEvent).toBeTruthy();
    expect(upvoteEvent.length).toBe(expectedCallCount);

    const expectedRemovedNews = {
      title: TITLE,
      votes: VOTES,
    };
    const actualRemovedNews = upvoteEvent[0][0];
    expect(actualRemovedNews).toEqual(expectedRemovedNews);
  });

});
