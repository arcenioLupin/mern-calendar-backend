const moment = require("moment");

const isDate = (value, rest) => {
  if (!value) {
    return false;
  }

  const fecha = moment(value);
  if (!fecha.isValid()) {
    return falase;
  }
  return true;
};

module.exports = {
  isDate,
};
