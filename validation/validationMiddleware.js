




export const validate = (schema) => (req, res, next) => {
    const {
      error
    } = schema.validate(req.body);
    if (error) {
      res.status(422)
        .send(error.details);
    } else {
      next();
    }
  };
  export const validatesearch = (schema) => (req, res, next) => {
    const {
      error
    } = schema.validate(req.query);
    if (error) {
      res.status(422)
        .send(error.details[0].message);
    } else {
      next();
    }
  };