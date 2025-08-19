import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputField from './InputField';

describe('InputField', () => {
  test('renders label and helper text', () => {
    render(<InputField label="Name" helperText="We will display this publicly." />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByText(/display this publicly/i)).toBeInTheDocument();
  });

  test('shows error when invalid', () => {
    render(<InputField label="Email" invalid errorMessage="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  test('clear button clears input in uncontrolled mode', async () => {
    const user = userEvent.setup();
    render(<InputField label="Search" clearable />);
    const input = screen.getByLabelText('Search') as HTMLInputElement;
    
    await user.type(input, 'test');
    expect(input.value).toBe('test');
    
    const clearButton = screen.getByRole('button', { name: /clear input/i });
    await user.click(clearButton);
    expect(input.value).toBe('');
  });

  test('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<InputField label="Password" type="password" />);
    
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
    
    const toggleButton = screen.getByRole('button', { name: /show password/i });
    await user.click(toggleButton);
    
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByText('Hide')).toBeInTheDocument();
  });

  test('calls onChange when input changes', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    render(<InputField label="Test" onChange={handleChange} />);
    
    const input = screen.getByLabelText('Test');
    await user.type(input, 'hello');
    
    expect(handleChange).toHaveBeenCalledTimes(5);
  });

  test('applies disabled state correctly', () => {
    render(<InputField label="Disabled" disabled />);
    const input = screen.getByLabelText('Disabled');
    expect(input).toBeDisabled();
  });

  test('applies custom className', () => {
    render(<InputField label="Test" className="custom-class" />);
    const container = screen.getByLabelText('Test').closest('div');
    expect(container).toHaveClass('custom-class');
  });
});
