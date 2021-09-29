function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&;#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
// Give the URL parameters variable names
var all_params_to_track = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'email',
];

// cValue= Cookie Value, pValue=Paramter Value, sValue = Session Value (session cookie)

all_params_to_track.forEach(function(param){
  var cValue = Cookies.get(param);
  var sValue = Cookies.get('session_' + param);
  // If the URL currently has parameters
  var pValue = getParameterByName(param);
  if(pValue){
    // Pass URL parameters straight to the form fields
    jQuery('input[id=form-field-' + param).val(pValue);
    // Create session cookie
    Cookies.set('session_' + param, pValue);
  } else if(sValue){
    // populate form fields from a session cookie
    jQuery('input[id=form-field-' + param).val(sValue);
  }

  // Does Cookie exist?
  if(cValue){
    // If cookies exists, pass parameters to the cookie form fields.
    jQuery('input[id=form-field-cookie_' + param).val(cValue);
  } else {
    // If cookie does not exist, and a parameter does, create a cookie.
    if (pValue) {
      Cookies.set(param, pValue, { expires: 30 });
    }
  }
})
