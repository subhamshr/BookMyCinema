const slugify = require("slugify");

const slugger = (text) => {
  return slugify(text, {
    replacement: "-", 
    lower: true, 
  });
};

module.exports = { slugger };
