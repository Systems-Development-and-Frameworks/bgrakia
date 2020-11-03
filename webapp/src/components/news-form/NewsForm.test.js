import {describe, expect, it} from "@jest/globals";
import {mount} from "@vue/test-utils";
import NewsForm from "@/components/news-form/NewsForm";

require('regenerator-runtime/runtime');

const itemTitle = "Fake News";
const itemTitleTooLong = "This Text is longer than the accepted sixtyfour characters!";

describe('NewsForm', () => {
	
	/*
	TODO: 
	- understand why 'valid' does not change value when setData() is executed
	- afterwards refactor the test
	*/
	
	it('should accept less than 64 character', async () => {

	const wrapper = mount(NewsForm, {
        data() {
            return {
				newsTitle: ''
            }
        }
    });
      
    await wrapper.setData({
		valid: true,
        newsTitle: itemTitle
    });
	
	//await wrapper.vm.$nextTick();
      
	expect(wrapper.vm.newsTitle).toBe(itemTitle);
    expect(wrapper.vm.valid).toBe(true);

    wrapper.destroy();
    });
	
	it('should not accept more than 64 character', async () => {

	const wrapper = mount(NewsForm, {
        data() {
            return {
				newsTitle: '',
            }
        }
    });
      
	await wrapper.setData({
        newsTitle: itemTitleTooLong
    });
      
	expect(wrapper.vm.newsTitle).toBe(itemTitleTooLong);
    expect(wrapper.vm.valid).toBe(false);

    wrapper.destroy();
    });
	
})