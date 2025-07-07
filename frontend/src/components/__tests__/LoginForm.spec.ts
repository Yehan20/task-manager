import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import LoginForm from '@/components/LoginForm.vue';
import { beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

describe('Login', () => {
  const pinia = createPinia();
  beforeEach(() => {
    setActivePinia(pinia);
  });

  it('renders properly', () => {
    const wrapper = mount(LoginForm, {
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.text()).toContain('Login');
  });
});
