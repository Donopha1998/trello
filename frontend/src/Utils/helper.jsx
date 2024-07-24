const formattedDateTime = (createdAt) => 
  new Date(createdAt).toLocaleString('en-IN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    timeZone: 'Asia/Kolkata' 
  });

export default formattedDateTime;
