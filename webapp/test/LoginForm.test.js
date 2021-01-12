import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import LoginForm from '@/components/login-form/LoginForm';
import {beforeEach, describe, expect, it} from "@jest/globals";
import { state, getters } from '@/store';
import Vuetify from 'vuetify'
import Vue from 'vue'

require('regenerator-runtime/runtime');

// We create a scoped constructor that we can mutate.
const localVue = createLocalVue();

describe('LoginForm', () => {
  let vuetify

  let wrapper
  let mutateMock
  beforeEach(() => {
    localVue.use(Vuex);
    Vue.use(Vuetify);

    vuetify = new Vuetify()

    const mutations = {
      setPrincipal: jest.fn((state, token) => state.user = { id: 1, token }),
    }

    const store = new Vuex.Store({
      state,
      mutations,
      getters
    });

    mutateMock = jest.fn(( { mutation, variables } ) => {
      return { data: { login: 'dummyToken' } };
    })

    wrapper = mount(LoginForm, {
      localVue,
      vuetify,
      store,
      mocks: {
        $apollo: {
          mutate: mutateMock
        },
        $apolloHelpers: {
          onLogin: jest.fn()
        }
      }
    });
  });

  it('keeps the login button disabled if the email is too long', async () => {
    const email = 'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest'
    const submitButton = wrapper.find('#login');
    const [emailExists, emailIsNotTooLong] = wrapper.vm.nameRules

    expect(emailExists(email)).toBe(true);
    expect(emailIsNotTooLong(email)).toBe("User name cannot exceed 64 chars!");

    expect(submitButton.element.disabled).toBe(true);
  })

  it('keeps the login button disabled if the password is too short', async () => {
    const password = 'asd'
    const submitButton = wrapper.find('#login');
    const [pwdExists, pwdIsLongEnough] = wrapper.vm.pwdRules;

    expect(pwdExists(password)).toBe(true);
    expect(pwdIsLongEnough(password)).toBe('Password must be at least 8 chars!');
    expect(submitButton.element.disabled).toBe(true);

  })

  it('successfully authenticates a user', async () => {
    const email = 'test'
    const password = 'testtest'


    const [pwdExists, pwdIsLongEnough] = wrapper.vm.pwdRules;

    expect(pwdExists(password)).toBe(true);
    expect(pwdIsLongEnough(password)).toBe(true);

    const [emailExists, emailIsNotTooLong] = wrapper.vm.nameRules

    expect(emailExists(email)).toBe(true);
    expect(emailIsNotTooLong(email)).toBe(true);

    await wrapper.setData({
      isFormValid: emailExists && pwdExists && pwdIsLongEnough && emailIsNotTooLong,
      credentials: {
        email,
        password
      }
    });

    const submitButton = wrapper.find('#login');
    expect(submitButton.element.disabled).toBe(false);

    await submitButton.trigger('click');

    expect(mutateMock).toHaveBeenCalled();
  });

})
