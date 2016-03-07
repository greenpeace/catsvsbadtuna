

if (XMLHttpRequest.prototype.sendAsBinary === undefined) {
    XMLHttpRequest.prototype.sendAsBinary = function (string) {
        var bytes = Array.prototype.map.call(string, function (c) {
            return c.charCodeAt(0) & 0xff;
        });
        this.send(new Uint8Array(bytes).buffer);
    };
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

window.fbAsyncInit = function () {
    FB.init({
        appId: "910783989042597",
        status: true,
        cookie: true,
        xfbml: true  // parse XFBML
    });
};

function successSharing(platform) {
    $('#sharesuccess').html("Successfuly shared to "+ platform);
    $('#sharesuccess').fadeIn();
    $('#form').css('height', $('#form').outerHeight() + 40 + "px")
}

function postImageToFacebook(authToken, filename, mimeType, imageData, message) {
    // this is the multipart/form-data boundary we'll use
    var boundary = '----ThisIsTheBoundary1234567890';
    // let's encode our image file, which is contained in the var
    var formData = '--' + boundary + '\r\n'
    formData += 'Content-Disposition: form-data; name="source"; filename="' + filename + '"\r\n';
    formData += 'Content-Type: ' + mimeType + '\r\n\r\n';
    for (var i = 0; i < imageData.length; ++i) {
        formData += String.fromCharCode(imageData[i] & 0xff);
    }
    formData += '\r\n';
    formData += '--' + boundary + '\r\n';
    formData += 'Content-Disposition: form-data; name="message"\r\n\r\n';
    formData += message + '\r\n'
    formData += '--' + boundary + '--\r\n';

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://graph.facebook.com/me/photos?access_token=' + authToken, true);
    xhr.onload = xhr.onerror = function () {
        //console.log(xhr.responseText);
    };
    xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
    xhr.sendAsBinary(formData);
    xhr.onreadystatechange=function() {
        //console.log(xhr);
        if (xhr.readyState==4 && xhr.status==200) {
            successSharing('Facebook');
            //console.log('succ');
            //document.getElementById("myDiv").innerHTML=xhr.responseText;
        }
    }
};

function postImageToTwitterProxy(filename, mimeType, imageData, message) {
    // this is the multipart/form-data boundary we'll use
    var boundary = '----ThisIsTheBoundary1234567890';
    // let's encode our image file, which is contained in the var
    var formData = '--' + boundary + '\r\n'
    formData += 'Content-Disposition: form-data; name="source"; filename="' + filename + '"\r\n';
    formData += 'Content-Type: ' + mimeType + '\r\n\r\n';
    for (var i = 0; i < imageData.length; ++i) {
        formData += String.fromCharCode(imageData[i] & 0xff);
    }
    formData += '\r\n';
    formData += '--' + boundary + '\r\n';
    formData += 'Content-Disposition: form-data; name="message"\r\n\r\n';
    formData += message + '\r\n'
    formData += '--' + boundary + '--\r\n';

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://dev.grnpc.org/index.php', true);
    xhr.onload = xhr.onerror = function () {
        //console.log(xhr.responseText);
    };
    xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
    xhr.sendAsBinary(formData);
    xhr.onreadystatechange=function() {
        //console.log(xhr);
        if (xhr.readyState==4 && xhr.status==200) {
            var response = JSON.parse(xhr.responseText);
            if(response.loginRequired) {
                window.location = response.loginRequired;
            } else {
                successSharing('Twitter');
            }
        }
    }
};

var canvas;
var context;
var centerX;
var img;
var authToken ;

function postCanvasToFacebook() {

    canvas =$('canvas')[0]
    //var data = $('canvas')[0].toDataURL("image/png");
    var data = canvas.toDataURL("image/png");

    var encodedPng = data.substring(data.indexOf(',') + 1, data.length);
    var decodedPng = Base64Binary.decode(encodedPng);
    FB.getLoginStatus(function (response) {


        if (response.status === "connected") {
            postImageToFacebook(response.authResponse.accessToken, "heroesgenerator", "image/png", decodedPng, "");
        } else if (response.status === "not_authorized") {
            FB.login(function (response) {
                postImageToFacebook(response.authResponse.accessToken, "heroesgenerator", "image/png", decodedPng, "");
            }, { scope: "publish_actions" });
        } else {
            FB.login(function (response) {
                postImageToFacebook(response.authResponse.accessToken, "heroesgenerator", "image/png", decodedPng, "");
            }, { scope: "publish_actions" });
        }
    
    });

};

function postCanvasToTwitter() {

    canvas =$('canvas')[0]
    //var data = $('canvas')[0].toDataURL("image/png");
    var data = canvas.toDataURL("image/png");

    var encodedPng = data.substring(data.indexOf(',') + 1, data.length);
    var decodedPng = Base64Binary.decode(encodedPng);
    //var img = new Image();
    //window.location.href = img.src = decodedPng;

    postImageToTwitterProxy("heroesgenerator", "image/png", decodedPng, "Cats vs #BadTuna http://www.greenpeace.org/badtuna @Greenpeace");

};


function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
var getParams = getUrlVars();
if(getParams['tweeted']=='true') {
    successSharing('Twitter');
}