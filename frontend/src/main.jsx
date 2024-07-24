import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import GoogleOAuthWrapper from './components/GoogleOAuth/GoogleOAuthWrapper.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
<GoogleOAuthWrapper>
    <App />
    </GoogleOAuthWrapper>
,
)
