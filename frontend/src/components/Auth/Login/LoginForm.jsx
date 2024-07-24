import React, { useReducer } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { loginUser } from '../../../api';
import { useAuth } from '../../../context/AuthContext';

const ACTIONS = {
  SET_FIELD: 'SET_FIELD',
  RESET_FORM: 'RESET_FORM'
};

const initialState = {
  email: '',
  password: ''
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

const LoginForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: ACTIONS.SET_FIELD, payload: { field: name, value } });
  };

  const handleSubmit = async () => {
    try {
      const token = await loginUser(state);
      login(token);
      notification.success({
        message: 'Login Successful',
        description: 'You have been successfully logged in.',
      });
    } catch (error) {
      notification.error({
        message: 'Login Failed',
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
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
