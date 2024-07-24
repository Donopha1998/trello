import React, { useReducer } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { registerUser } from '../../../api';
import { useNavigate } from 'react-router-dom';

const ACTIONS = {
  SET_FIELD: 'SET_FIELD',
  RESET_FORM: 'RESET_FORM'
};

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_FIELD:
      return {
        ...state,
        [action.payload.field]: action.payload.value
      };
    case ACTIONS.RESET_FORM:
      return initialState;
    default:
      return state;
  }
};

const RegisterForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: ACTIONS.SET_FIELD, payload: { field: name, value } });
  };

  const handleSubmit = async () => {
    const formattedData = {
      name: {
        firstName: state.firstName,
        lastName: state.lastName
      },
      email: state.email,
      password: state.password
    };

    try {
      await registerUser(formattedData);
      notification.success({
        message: 'Registration Successful',
        description: 'You have been successfully registered. You can now log in.',
      });
      navigate('/login');
    } catch (error) {
      notification.error({
        message: 'Registration Failed',
        description: error.response.data.error,
      });
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        name="firstName"
        rules={[{ required: true, message: 'Please enter your first name' }]}
      >
        <Input 
          name="firstName" 
          value={state.firstName} 
          onChange={handleChange} 
          placeholder="First Name" 
        />
      </Form.Item>
      <Form.Item
        name="lastName"
        rules={[{ required: true, message: 'Please enter your last name' }]}
      >
        <Input 
          name="lastName" 
          value={state.lastName} 
          onChange={handleChange} 
          placeholder="Last Name" 
        />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[{ required: true, type: 'email', message: 'Please enter a valid email address' }]}
      >
        <Input 
          name="email" 
          value={state.email} 
          onChange={handleChange} 
          placeholder="Email" 
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please enter your password' }]}
      >
        <Input.Password 
          name="password" 
          value={state.password} 
          onChange={handleChange} 
          placeholder="Password" 
        />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Please confirm your password' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords do not match!'));
            },
          }),
        ]}
      >
        <Input.Password 
          name="confirmPassword" 
          value={state.confirmPassword} 
          onChange={handleChange} 
          placeholder="Confirm Password" 
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Sign Up
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
