import {describe, expect, it} from "@jest/globals";
import {mount} from "@vue/test-utils";
import NewsList from "@/components/news-list/NewsList";
import NewsItem from "@/components/news-item/NewsItem";
require('regenerator-runtime/runtime');

describe('NewsList', () => {

  it('should show the message "The list is empty :(" when there are no elements in the list', () => {
    const wrapper = mount(NewsList, {
      data() {
        return {
          newsItems: [],
        }
      }
    })
    const paragraph = wrapper.find("h2")

    expect(paragraph.text()).toEqual("The list is empty :(")
  })

  it("should show the elemens when they are present in the list", () => {
    const wrapper = mount(NewsList, {
      data() {
        return {
          newsItems: [
            {title: "Title_1", votes: 0},
            {title: "Title_2", votes: 0}
          ]
        }
      }
    });

    let children = wrapper.findAllComponents(NewsItem);
    expect(children.length).toEqual(2);
    wrapper.destroy();
  })

  it("should switch the sorting order whenever the button is clicked", () => {
    const wrapper = mount(NewsList, {
      data() {
        return {
          newsItems: [
            {title: "Title_1", votes: 5},
            {title: "Title_2", votes: 4}
          ],
          descending: true,
        }
      }
    });

    const button = wrapper.find('button.sorter');
    button.trigger('click');
    expect(wrapper.vm.descending).toEqual(false);
    expect(wrapper.vm.sortedItems[0].votes).toEqual(4);

    button.trigger('click');
    expect(wrapper.vm.descending).toEqual(true);
    expect(wrapper.vm.sortedItems[0].votes).toEqual(5);
    wrapper.destroy();
  })

  it("should correctly emit an update news event", async () => {
    const wrapper = mount(NewsList, {
      data() {
        return {
          newsItems: [
            {title: "Title_1", votes: 5},
            {title: "Title_2", votes: 4}
          ],
          descending: true,
        }
      }
    });

    let payload = {title: "Title_1", votes: 6}
    wrapper.vm.$emit('updateNews', payload);


    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('updateNews')).toBeTruthy();
    expect(wrapper.emitted('updateNews').length).toBe(1);
    expect(wrapper.emitted('updateNews')[0]).toEqual([payload]);
    wrapper.destroy();
  })

  it("should correctly change the votes of a title when the update news method is called", () => {
    const wrapper = mount(NewsList, {
      data() {
        return {
          newsItems: [
            {title: "Title_1", votes: 5},
            {title: "Title_2", votes: 4}
          ],
          descending: true,
        }
      }
    });
    wrapper.vm.updateNews({title: "Title_1", votes: 6});
    expect(wrapper.vm.newsItems[0].votes).toBe(6);

    wrapper.vm.updateNews({title: "Title_1", votes: 2});
    expect(wrapper.vm.newsItems[0].votes).toBe(2);

    wrapper.vm.updateNews({title: "Title_2", votes: -5});
    expect(wrapper.vm.newsItems[1].votes).toBe(-5);
  })

})