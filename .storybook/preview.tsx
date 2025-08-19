import type { Preview, Decorator } from '@storybook/react'
import '../src/index.css'

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
  decorators: [
    ((Story, ctx) => {
      const isDark = ctx.globals.backgrounds?.value === '#0b0f19'
      return (
        <div className={isDark ? 'dark' : ''}>
          <div className="min-h-screen bg-white text-slate-900 dark:bg-[#0b0f19] dark:text-slate-100 p-6">
            <Story />
          </div>
        </div>
      )
    }) as Decorator,
  ],
}

export default preview