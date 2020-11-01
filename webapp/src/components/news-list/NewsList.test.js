import {describe, expect, it} from "@jest/globals";
import {mount} from "@vue/test-utils";
import NewsList from "@/components/news-list/NewsList";
import NewsItem from "@/components/news-item/NewsItem";
import NewsForm from "@/components/news-form/NewsForm";

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
      const paragraph = wrapper.find("h2");

      expect(paragraph.text()).toEqual("The list is empty :(");
      wrapper.destroy();
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

  it("should correctly update the votes of an item", async () => {
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

      const item = wrapper.findComponent(NewsItem);

      item.find('button.upvote').trigger('click');

      await item.vm.$nextTick();

      expect(item.emitted('updateNews')).toBeTruthy();
      expect(item.emitted('updateNews').length).toBe(1);

      expect(wrapper.vm.newsItems[0].votes).toBe(6);

      wrapper.destroy();
  })

  it("should add an item to its internal array when the user clicks the submit button and provides a valid title",  async () => {
      
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
      
      let newsForm = wrapper.findComponent(NewsForm);
      newsForm.setData({
          valid: false,
          newsTitle: 'Title_3',
      });
      
      newsForm.find('v-btn').trigger('click');

      expect(newsForm.emitted('addItem')).toBeTruthy();
      expect(newsForm.emitted('addItem').length).toBe(1);

      expect(wrapper.vm.newsItems.pop()).toEqual({title: "Title_3", votes: 0});
      wrapper.destroy();
  })

  it("should remove an item from its internal array when the user clicks remove", async () => {
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

      let item = wrapper.findComponent(NewsItem)
      item.find("button.remove").trigger('click');

      await wrapper.vm.$nextTick();
      
      expect(item.emitted('removeNews')).toBeTruthy();
      
      expect(wrapper.vm.newsItems.length).toBe(1);

      // Do it one more time
      item = wrapper.findComponent(NewsItem);

      item.find("button.remove").trigger('click');

      await wrapper.vm.$nextTick();

      expect(item.emitted('removeNews')).toBeTruthy();

      expect(wrapper.vm.newsItems.length).toBe(0);

      let heading = wrapper.find("h2");
      expect(heading.text()).toEqual("The list is empty :(")

      wrapper.destroy();
  })



})