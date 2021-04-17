export default !['production', 'staging'].includes(process.env.ENV || 'development');
