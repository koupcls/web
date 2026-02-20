function checkPasswords(password) {
    var s_letters = "qwertyuiopasdfghjklzxcvbnm";
    var b_letters = "QWERTYUIOPLKJHGFDSAZXCVBNM";
    var digits = "0123456789";
    var specials = "!@#$%^&*()_-+=\|/.,:;[]{}";
    
    var is_s = false;
    var is_b = false;
    var is_d = false;
    var is_sp = false;

    for (var i = 0; i < password.length; i++) {
      if (!is_s && s_letters.indexOf(password[i]) != -1) is_s = true;
      else if (!is_b && b_letters.indexOf(password[i]) != -1) is_b = true;
      else if (!is_d && digits.indexOf(password[i]) != -1) is_d = true;
      else if (!is_sp && specials.indexOf(password[i]) != -1) is_sp = true;
    }
    var rating = 0;
    if (password.length > 12) rating++;
    if (password.length > 16) rating++;
    if (is_s) rating++;
    if (is_b) rating++;
    if (is_d) rating++;
    if (is_sp) rating++;
    return rating;
  }