import React, { useState, ChangeEvent, FormEvent } from 'react';
import { signupUser } from '../services';

const Signup: React.FC = () => {
  interface FormData {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
  }

  const [formData, setFormData] = useState<FormData>({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await signupUser(formData);
      setMessage(`User created successfully: ${response.user.email}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('Something went wrong');
      }
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Signup;