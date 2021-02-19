import {describe, expect, it, beforeEach} from "@jest/globals";
import {mount, createLocalVue} from "@vue/test-utils";
import NewsForm from "@/components/news-form/NewsForm";

import Vue from 'vue'
import Vuetify from 'vuetify'

require('regenerator-runtime/runtime');

const localVue = createLocalVue()

let vuetify
const itemTitle = "Fake News";
const itemTitleTooLong = "This Text is longer than the accepted sixtyfour characters! 1234567";

describe('NewsForm', () => {
	let wrapper;

	beforeEach( () => {
		Vue.use(Vuetify);
		vuetify = new Vuetify();
		wrapper = mount(NewsForm, {
			localVue,
			vuetify
		});
	})

	it('textfield contains the text entered', async () => {

	const inputField = wrapper.find('input[type="text"]')
	await inputField.setValue(itemTitle)

	expect(inputField.element.value).toBe('Fake News');

    });

	it('does accept less than 64 character', async () => {

	const inputField = wrapper.find('input[type="text"]')
	const btn = wrapper.find('[type="button"]')

	await inputField.setValue(itemTitle)
	await inputField.trigger('input');

	expect(inputField.element.value).toBe('Fake News');
	expect(btn.element.disabled).toBe(false);

    });

	it('does not accept more than 64 character', async () => {

	const inputField = wrapper.find('input[type="text"]')
	const btn = wrapper.find('[type="button"]')

	await inputField.setValue(itemTitleTooLong)
	await inputField.trigger('input');

	expect(inputField.element.value).toBe('This Text is longer than the accepted sixtyfour characters! 1234567');
	expect(btn.element.disabled).toBe(true);

  });

})
