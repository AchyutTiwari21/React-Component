import type { Meta, StoryObj } from '@storybook/react';
import InputField from './InputField';
import type { InputFieldProps } from './InputField';

const meta: Meta<InputFieldProps> = {
  title: 'Components/InputField',
  component: InputField,
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
  },
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    variant: 'outlined',
    size: 'md',
    onChange: (e) => {
      console.log('Input changed:', e.target.value);
    },
  },
  argTypes: {
    variant: {
      control: {
        type: 'select',
        options: ['outlined', 'filled', 'ghost'],
      },
    },
    size: {
      control: {
        type: 'select',
        options: ['sm', 'md', 'lg'],
      },
    },
    type: {
      control: {
        type: 'select',
        options: ['text', 'password'],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof InputField>;

export const Default: Story = {};

export const WithHelperText: Story = {
  args: {
    helperText: 'We\'ll never share your email.',
  },
};

export const ErrorState: Story = {
  args: {
    invalid: true,
    errorMessage: 'Please enter a valid email address.',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'disabled@example.com',
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
  },
};

export const WithClearButton: Story = {
  args: {
    clearable: true,
    value: 'Clear me',
  },
};

export const LoadingState: Story = {
  args: {
    loading: true,
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="space-y-4 max-w-sm">
      <InputField {...args} variant="filled" label="Filled" />
      <InputField {...args} variant="outlined" label="Outlined" />
      <InputField {...args} variant="ghost" label="Ghost" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="space-y-4 max-w-sm">
      <InputField {...args} size="sm" label="Small" />
      <InputField {...args} size="md" label="Medium (default)" />
      <InputField {...args} size="lg" label="Large" />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    label: 'Play with me!',
    helperText: 'Try different combinations in the Controls panel',
    clearable: true,
  },
};
