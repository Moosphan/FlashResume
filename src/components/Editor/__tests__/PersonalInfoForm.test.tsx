import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import PersonalInfoForm from '../PersonalInfoForm';
import { useResumeStore } from '../../../stores/resumeStore';

describe('PersonalInfoForm', () => {
  beforeEach(() => {
    useResumeStore.getState().clearAll();
  });

  it('renders all input fields with Chinese labels', () => {
    render(<PersonalInfoForm />);
    expect(screen.getByText('个人信息')).toBeInTheDocument();
    expect(screen.getByText('姓名')).toBeInTheDocument();
    expect(screen.getByText('邮箱')).toBeInTheDocument();
    expect(screen.getByText('电话')).toBeInTheDocument();
    expect(screen.getByText('地址')).toBeInTheDocument();
    expect(screen.getByText('个人网站')).toBeInTheDocument();
    expect(screen.getByText('头像')).toBeInTheDocument();
  });

  it('updates store when name field changes', () => {
    render(<PersonalInfoForm />);
    const nameInput = screen.getByPlaceholderText('请输入姓名');
    fireEvent.change(nameInput, { target: { value: '张三' } });
    expect(useResumeStore.getState().resumeData.personalInfo.name).toBe('张三');
  });

  it('updates store when email field changes', () => {
    render(<PersonalInfoForm />);
    const emailInput = screen.getByPlaceholderText('请输入邮箱');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(useResumeStore.getState().resumeData.personalInfo.email).toBe('test@example.com');
  });

  it('shows email validation error on blur for invalid email', () => {
    render(<PersonalInfoForm />);
    const emailInput = screen.getByPlaceholderText('请输入邮箱');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    expect(screen.getByText('邮箱格式不正确')).toBeInTheDocument();
  });

  it('does not show email error for valid email', () => {
    render(<PersonalInfoForm />);
    const emailInput = screen.getByPlaceholderText('请输入邮箱');
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.blur(emailInput);
    expect(screen.queryByText('邮箱格式不正确')).not.toBeInTheDocument();
  });

  it('clears email error when field is emptied', () => {
    render(<PersonalInfoForm />);
    const emailInput = screen.getByPlaceholderText('请输入邮箱');
    // First trigger an error
    fireEvent.change(emailInput, { target: { value: 'bad' } });
    fireEvent.blur(emailInput);
    expect(screen.getByText('邮箱格式不正确')).toBeInTheDocument();
    // Then clear the field
    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.blur(emailInput);
    expect(screen.queryByText('邮箱格式不正确')).not.toBeInTheDocument();
  });

  it('shows phone validation error on blur for invalid phone', () => {
    render(<PersonalInfoForm />);
    const phoneInput = screen.getByPlaceholderText('请输入电话号码');
    fireEvent.change(phoneInput, { target: { value: '123abc' } });
    fireEvent.blur(phoneInput);
    expect(screen.getByText('电话号码只能包含数字、+ 和 -')).toBeInTheDocument();
  });

  it('does not show phone error for valid phone', () => {
    render(<PersonalInfoForm />);
    const phoneInput = screen.getByPlaceholderText('请输入电话号码');
    fireEvent.change(phoneInput, { target: { value: '+86-138-0000-0000' } });
    fireEvent.blur(phoneInput);
    expect(screen.queryByText('电话号码只能包含数字、+ 和 -')).not.toBeInTheDocument();
  });

  it('updates store when address field changes', () => {
    render(<PersonalInfoForm />);
    const addressInput = screen.getByPlaceholderText('请输入地址');
    fireEvent.change(addressInput, { target: { value: '北京市海淀区' } });
    expect(useResumeStore.getState().resumeData.personalInfo.address).toBe('北京市海淀区');
  });

  it('updates store when website field changes', () => {
    render(<PersonalInfoForm />);
    const websiteInput = screen.getByPlaceholderText('请输入个人网站 URL');
    fireEvent.change(websiteInput, { target: { value: 'https://example.com' } });
    expect(useResumeStore.getState().resumeData.personalInfo.website).toBe('https://example.com');
  });

  it('all text inputs have min 44px touch target height', () => {
    render(<PersonalInfoForm />);
    const inputs = [
      screen.getByPlaceholderText('请输入姓名'),
      screen.getByPlaceholderText('请输入邮箱'),
      screen.getByPlaceholderText('请输入电话号码'),
      screen.getByPlaceholderText('请输入地址'),
      screen.getByPlaceholderText('请输入个人网站 URL'),
    ];
    for (const input of inputs) {
      expect(input.className).toContain('min-h-[44px]');
    }
  });
});
