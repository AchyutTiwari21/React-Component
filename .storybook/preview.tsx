import type { Preview, Decorator } from '@storybook/react';  
import { useEffect } from 'react';
import '../src/index.css';
import { ModeDecorator } from "./modeDecorator";

const withTheme: Decorator = (Story, context) => {
  const isDark = context.globals.backgrounds?.value === '#0b0f19';

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <Story />
    </div>
  );
};

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    actions: { argTypesRegex: '^on.*' },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0b0f19' },
      ],
    },
  },
  decorators: [withTheme, ModeDecorator],
};

export default preview;
