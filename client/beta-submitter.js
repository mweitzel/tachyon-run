var find = Array.prototype.find

module.exports = {
  captureSubmit: function() {
    var form = document.getElementsByClassName('beta-submit')[0]
    form.addEventListener('submit', function(e) {
      e.preventDefault()
      postEmail(
        email(form)
      , onSubmitResponse.bind(form)
      )
    })
  }
}

function email(form) {
  return findChildElementOfType.call(form, 'email').value
}
function getSubmitEl(form) {
  return findChildElementOfType.call(form, 'submit')
}
function findChildElementOfType(type) {
  return find.call( this.childNodes, function(n) { return n.type===type })
}

function firstChildWithClass(className) {
  return this.getElementsByClassName(className)[0]
}


function onSubmitResponse(xhttp) {
  getSubmitEl(this).disabled = false
  var response = ''
  try { response = JSON.parse(xhttp.response) }
  catch(e) { return }

  if(response) {
    firstChildWithClass.call(this, 'success')
    .textContent = "Thank you! We'll be in touch."
  }
}

function postEmail(email, done) {
  xhttp = new XMLHttpRequest
  xhttp.open("POST", "/beta-signup", true)
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
  xhttp.send("email="+email)
  xhttp.onreadystatechange = function() { if (xhttp.readyState == 4) { done(xhttp) } }
}

