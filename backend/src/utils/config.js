
const config = {
    development: {
      apiUrl: 'http://localhost:5173',
    },
    production: {
      apiUrl: 'https://trellotask-cletus.netlify.app',
    },
  };
  

  const env = process.env.NODE_ENV || 'development';
  
  export default config[env];
  