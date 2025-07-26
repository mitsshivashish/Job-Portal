import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

//CLOUDINARY_API_SECRET=yInYrm5PcJF6FR4PTJGFCxop6Uw
//CLOUDINARY_CLOUD_NAME=du3mjoozj
//CLOUDINARY_API_KEY=356895458254723
//PORT=5000
//MONGO_URL=mongodb+srv://shivashishtiwari673:bfA8pa6TfKQNkmG4@job-portal.dy8he7e.mongodb.net/?retryWrites=true&w=majority&appName=Job-Portal
//JWT_SECRET=7094873e2ad509f40df0acaad8f4b919