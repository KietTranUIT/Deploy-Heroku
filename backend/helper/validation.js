// Hàm validateEmail kiểm tra một email đầu vào có phải là email hay không
exports.validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/);
};
  

// Hàm validateLength kiểm tra chuỗi đầu vào có đạt được độ dài tối thiểu và tối đa hay không
exports.validateLength = (text, min, max) => {
    if (text.length > max || text.length < min) {
      return false;
    }
    return true;
};

const lowercase_regex = /(?=.*[a-z])/;
const uppercase_regex = /(?=.*[A-Z])/;
const digit_regex = /(?=.*[0-9])/;
const special_character_regex = /[^a-zA-Z0-9 ]+/g;

exports.validatePassword = (password, min_length) => {
  // check if password minimul length
  const minimum_length_ten_regex = new RegExp(`(?=.{${min_length || 6},})`);
  if (!minimum_length_ten_regex) {
    return false;
  }

  // check if password contain lowercase character
  if (!lowercase_regex.test(password)) {
    return false;
  }

  // check if password contain uppercase character
  if (!uppercase_regex.test(password)) {
    return false;
  }

  // check if password contain digit
  if (!digit_regex.test(password)) {
    return false;
  }
 
  // check if password contain special character
  if (!special_character_regex.test(password)) {
    return false;
  }
  return true;
}
  
  