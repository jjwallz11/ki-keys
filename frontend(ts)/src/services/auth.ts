export interface SignupFormData {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
  }
  
  export interface SignupResponse {
    user: {
      email: string;
    };
  }
  
  export const signupUser = async (formData: SignupFormData): Promise<SignupResponse> => {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
  
    if (!response.ok) {
      throw new Error('Signup failed');
    }
  
    return response.json();
  };