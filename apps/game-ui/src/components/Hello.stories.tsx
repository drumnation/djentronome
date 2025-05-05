import { Hello } from './Hello';

export default {
  title: 'Example/Hello',
  component: Hello,
};

export const Default = {
  args: {
    name: 'World',
  },
};

export const CustomName = {
  args: {
    name: 'Storybook',
  },
}; 