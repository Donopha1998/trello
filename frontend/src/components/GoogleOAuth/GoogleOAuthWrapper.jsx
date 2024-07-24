import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
console.log(clientId)
const GoogleOAuthWrapper = ({ children }) => (
  <GoogleOAuthProvider clientId={clientId}>
    {children}
  </GoogleOAuthProvider>
);

export default GoogleOAuthWrapper;
