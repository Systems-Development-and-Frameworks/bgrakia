import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
require('regenerator-runtime/runtime');
import Vue from 'vue';
import {beforeEach, describe, expect, it} from "@jest/globals";
import Vuetify from "vuetify";
import Menu from "@/components/menu/Menu";


// We create a scoped constructor that we can mutate.
const localVue = createLocalVue();

describe('Menu', () => {

  let vuetify
  let store

  beforeEach(() => {
    localVue.use(Vuex);
    Vue.use(Vuetify);

  })

  it("shows logout button if authenticated", async () => {
    const getters = {
      isAuthenticated: () => true
    }
    const store = new Vuex.Store({
      getters
    });
    const wrapper = mount(Menu, {
      localVue,
      store
    });

    const button = wrapper.find('button');
    expect(button).toBeDefined();
    expect(button.text()).toEqual('Logout');
  })

  it("shows login button if not authenticated", async() => {
    const getters = {
      isAuthenticated: () => false
    }
    const store = new Vuex.Store({
      getters
    });
    const wrapper = mount(Menu, {
      localVue,
      store
    });
    const button = wrapper.find('button');
    expect(button).toBeDefined();
    expect(button.text()).toEqual('Login');
  })
})
