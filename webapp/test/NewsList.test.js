import {beforeEach, describe, expect, it} from "@jest/globals";
import NewsList from "@/components/news-list/NewsList";
import NewsItem from "@/components/news-item/NewsItem";
import NewsForm from "@/components/news-form/NewsForm";
import { mount, createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from "vuex";

require('regenerator-runtime/runtime');
// We create a scoped constructor that we can mutate.
const localVue = createLocalVue();
localVue.use(Vuex);

describe('NewsList', () => {

  let setupWrapper = (options, mountFunc) => {
      const defaults = { propsData: { newsItems: [], descending: false } };
      return mountFunc(NewsList, { ...defaults, ...options });
  }

  let wrapper;
  // Vuex store used for testing
  let store
  // The NewsItem component uses getters to fetch the principal and if she is authenticated
  let getters
  let author

  let queryMock
  let writeMutateMock
  let deleteMutateMock
  let db
  beforeEach(() => {
    author = { id: 1 }
    db = [
      {title: "Title_1", votes: 5, author},
      {title: "Title_2", votes: 4, author}
    ];

    queryMock = jest.fn(({ query }) => {
      return { data: { posts: db } }
    });

    writeMutateMock = jest.fn(({ mutation, variables }) => {
      const mockedResponse = {
        write: {
          title: variables.post.title,
          votes: 0,
          author
        }
      };
      return { data: mockedResponse }
    })

    deleteMutateMock = jest.fn(( { mutation, variables }) => {
      const obj = db.find(item => item.title === variables.title);
      const mockedResponse = {
        delete: obj
      };
      return { data: mockedResponse }
    })

    // Mock the getters of the vuex store.
    // We assume an authenticated user
    getters = {
      getPrincipal: () => { return { id: author.id, token: 'dummyToken' }; },
      isAuthenticated: () => true
    }
    store = new Vuex.Store({
      getters
    });

    wrapper = setupWrapper({
        store,
        localVue,
        mocks: {
          $apollo: {
            query: queryMock
          }
        }
    }, mount)
  })

  it('should show the message "The list is empty :(" when there are no elements in the list', () => {
    const testWrapper = setupWrapper({
      store,
      localVue
    }, mount);

    const paragraph = testWrapper.find("h2");

    expect(paragraph.text()).toEqual("The list is empty :(");
    testWrapper.destroy();
  })

  it("should show the elemens when they are present in the list", () => {
    let children = wrapper.findAllComponents(NewsItem);
    expect(children.length).toEqual(2);
  })

  it("should switch the sorting order whenever the button is clicked", () => {

    const button = wrapper.find('button.sorter');
    button.trigger('click');
    expect(wrapper.vm.descending).toEqual(false);
    expect(wrapper.vm.sortedItems[0]).toEqual({ title: "Title_2", votes: 4, author: { id: 1}})
  })

  it("should add an item to its internal array when the user clicks the submit button and provides a valid title",  async () => {
    const testWrapper = setupWrapper({
      store,
      localVue,
      mocks: {
        $apollo: {
          query: queryMock,
          mutate: writeMutateMock
        }
      }
    }, shallowMount)
    await testWrapper.vm.addItem('Title_3');
    expect(writeMutateMock).toBeCalled()
    expect(queryMock).toHaveBeenCalledTimes(2); // After writing, we also expect vue to rerender the component and therefore query the news again
  })

  it("should remove an item from its internal array when the user clicks remove", async () => {
    const testWrapper = setupWrapper({
      store,
      localVue,
      mocks: {
        $apollo: {
          query: queryMock,
          mutate: deleteMutateMock
        }
      }
      }, shallowMount)

    await testWrapper.vm.removeNews(      {title: "Title_2", votes: 4, author} );
    expect(deleteMutateMock).toBeCalled();
    expect(queryMock).toHaveBeenCalledTimes(2);
  })



})
