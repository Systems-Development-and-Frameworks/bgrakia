import { describe, expect, it } from '@jest/globals';
import { mount, createLocalVue } from '@vue/test-utils';
import NewsItem from '@/components/news-item/NewsItem';
import Vuex from 'vuex';
import auth from '../store/index'
require('regenerator-runtime/runtime');

// We create a scoped constructor that we can mutate.
const localVue = createLocalVue();
localVue.use(Vuex);

describe('NewsItem', () => {


  // Vuex store used for testing
  let store
  // The NewsItem component uses getters to fetch the principal and if she is authenticated
  let getters

  let mutateSuccess
  beforeEach(() => {
    // Mock the getters of the vuex store.
    // We assume an authenticated user
    getters = {
      getPrincipal: () => { return { id: 1, token: 'dummyToken' }; },
      isAuthenticated: () => true
    }
    store = new Vuex.Store({
      getters
    });
    mutateSuccess = jest.fn(({ mutation, variables }) => { return { data: { upvote: {title: variables.title, votes: 1} } } } )
  })

  it('shows its title, votes, as well as upvote, downvote and remove functionality for the author', () => {
    const title = 'Test-Title'
    const votes = 0
    const wrapper = mount(NewsItem, {
      propsData: {
        newsItem: {
          title: title,
          votes: votes,
          author: {
            id: 1
          }
        },
      },
      store,
      localVue
    })


    const expectedText = 'Test-Title' + ' ' + votes.toString();
    const heading = wrapper.find('h1');
    expect(heading).toBeDefined();
    expect(heading.text()).toEqual(expectedText);

    const upvoteButton = wrapper.find('button.upvote');
    expect(upvoteButton.exists()).toBe(true);

    const downvoteButton = wrapper.find('button.downvote');
    expect(downvoteButton.exists()).toBe(true);

    const removeButton = wrapper.find('button.remove');
    expect(removeButton.exists()).toBe(true);
  })

  it('does not show remove functionality for a user other than the author', () => {
    const title = 'Test-Title';
    const votes = 0;
    const wrapper = mount(NewsItem, {
      propsData: {
        newsItem: {
          title: title,
          votes: votes,
          author: {
            id: 5 // The author is different than the one in the getter, so the remove button is not present
          }
        }
      },
      store,
      localVue
    });

    const removeButton = wrapper.find('button.remove');
    expect(removeButton.exists()).toBe(false);
  })

  it('should emit upvoting-updateNews event once upvote-button is clicked', async () => {
    const title = 'Test-Title';
    const votes = 0;
    const wrapper = mount(NewsItem, {
      propsData: {
        newsItem: {
          title: title,
          votes: votes,
          author: {
            id: 5
          }
        }
      },
      store,
      localVue,
      mocks: {
        $apollo: {
          mutate: mutateSuccess
        }
      }
    });

    const button = wrapper.find('button.upvote');
    button.trigger('click');

    await wrapper.vm.$nextTick();

    const expectedCallCount = 1;
    const upvoteEvent = wrapper.emitted().updateNews;

    expect(upvoteEvent).toBeTruthy();
    expect(upvoteEvent.length).toBe(expectedCallCount);

    const actualUpdatedNews = upvoteEvent[0][0];
    expect(actualUpdatedNews.title).toEqual('Test-Title');
    expect(actualUpdatedNews.votes).toEqual(votes + 1);
  });

  it('should emit downvoting-updateNews event once downvote-button is clicked', async () => {
    const wrapper = mount(NewsItem, {
      propsData: {
        newsItem: {
          title: 'Test-Title',
          votes: 2,
          author: {
            id: 5
          }
        },
      },
      store,
      localVue,
    });

    const button = wrapper.find('button.downvote');
    await button.trigger('click');

    const expectedCallCount = 1;
    const upvoteEvent = wrapper.emitted().updateNews;

    expect(upvoteEvent).toBeTruthy();
    expect(upvoteEvent.length).toBe(expectedCallCount);

    const actualUpdatedNews = upvoteEvent[0][0];
    expect(actualUpdatedNews.title).toEqual('Test-Title');
    expect(actualUpdatedNews.votes).toEqual(1);
  });

  it('should emit removeNews event once remove-button is clicked', async () => {
    const wrapper = mount(NewsItem, {
      propsData: {
        newsItem: {
          title: 'Test-Title',
          votes: 0,
          author: {
            id: 1
          }
        },
      },
      store,
      localVue,
    });

    const button = wrapper.find('button.remove');
    button.trigger('click');

    await wrapper.vm.$nextTick();

    const expectedCallCount = 1;
    const upvoteEvent = wrapper.emitted().removeNews;

    expect(upvoteEvent).toBeTruthy();
    expect(upvoteEvent.length).toBe(expectedCallCount);

    const expectedRemovedNews = {
      title: 'Test-Title',
      votes: 0,
      author: {
        id: 1
      }
    };
    const actualRemovedNews = upvoteEvent[0][0];
    expect(actualRemovedNews).toEqual(expectedRemovedNews);
  });

});
