exports.contentSecurityPolicy = async (req, res, next) => {
    try {
      res.setHeader(
          'Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self'; frame-src 'self'"
        );
        
      next();
    } catch (error) {
      console.log('fail')
      return res.status(500).json({ message: error.message });
    }
  };
  