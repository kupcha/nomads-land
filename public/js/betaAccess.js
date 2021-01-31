const submitButton = document.querySelector('#login');
let check = 0;

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
let cookieVal = getCookie('knowsPass');
if (cookieVal == 'Y'){
  document.location.href = 'accountLogin.html';
}

submitButton.addEventListener('submit', function(e){
  e.preventDefault();
  var password = document.querySelector('#psw').value;
  if (password == 'bettercallmecraig'){
    document.cookie = "knowsPass=Y";
    document.location.href = 'accountLogin.html';
  }
  else{
    if (check == 0){
    const box = document.querySelector('#container');
    const error = document.createElement('p');
    error.textContent = 'you gotta say what up to my boy craig';
    box.appendChild(error);
    check++;
   }
 }
});


