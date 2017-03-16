$(document).ready(function() {

    $(".btn").hover(function() {
        var hovSrc = $(this).data('src');
        var normSrc = $(this).attr('src');
        $(this).attr('src', hovSrc);
        $(this).data('src', normSrc);
    }, function() {
        var normSrc = $(this).data('src');
        var hovSrc = $(this).attr('src');
        $(this).attr('src', normSrc);
        $(this).data('src', hovSrc);
    })

    //Sharing
    if (addthis) {
        addthis.toolbox('#toolbox', {}, {
            url: "http://www.catsvsbadtuna.org/",
            title: 'Cats vs #BadTuna',
            templates: {
			twitter: 'Cats love tuna. But some companies trash oceans and exploit humans to catch it. Upload your cat pic and help spread the word! - {{url}}'
            }
        });
    }
    
    //$('#addthis_button_twitter').click(function() {
    //    ga('send', 'event', 'Share', 'Addthis Twitter');
    //});
    //$('#addthis_button_facebook').click(function() {
    //    ga('send', 'event', 'Share', 'Addthis Facebook');
    //});


    //Youtube video
    $('#videoimage').click(function() {
        $('#videoimage img').fadeOut();
        $('#videoimage').append('<div class="video-container"><iframe title="YouTube video player" width="' + $(videoimage).innerWidth() + 'px" height="' + $(videoimage).innerHeight() + 'px" src="//www.youtube.com/embed/PhXRwiIaJOs?autoplay=1&rel=0" frameborder="0" allowfullscreen></iframe></div>');
        ga('send', 'event', 'Video', 'YouTube watched');
    });
    $(window).resize(function() {
        $('.video-container iframe').attr('width', $(videoimage).innerWidth() + 'px');
        $('.video-container iframe').attr('height', $(videoimage).innerHeight() + 'px');
        $('#showerror').css('display', 'none');
        $('#shareSuccess').css('display', 'none');
    })

    // Get number of Memes
    var global_signups;
    var liveCounter = function() {
        var getSigned = $.get(
            "//moon.greenpeace.org/c/print.php?a=badtuna",
            function(signed) {
                global_signups = parseInt(signed);
            }
        );
        getSigned.async = 1;
        $.when(getSigned).done(function() {
            $('.num-sofar').html(global_signups);
        });
    };
    //setInterval(function() {
    //    try {
            liveCounter();
    //    } catch (e) { /* . */ }
    //}, 1000);

    //

    //Reset canvas if screen is less than 350px;
    function responsiveCanvas() {
        if ($('body').outerWidth() < 370 && $('body').outerWidth() >= 321) {
            $('canvas').attr('width', '275');
            $('canvas').attr('height', '275');
            $('.image-holder').css('width', '275px');
            $('.image-holder').css('height', '275px');
        }
        if ($('body').outerWidth() < 321) {
            $('canvas').attr('width', '250');
            $('canvas').attr('height', '250');
            $('.image-holder').css('width', '250px');
            $('.image-holder').css('height', '250px');
        }
    }
    responsiveCanvas();
    //

    function shuffle(array) {
        var tmp, current, top = array.length;
        if (top)
            while (--top) {
                current = Math.floor(Math.random() * (top + 1));
                tmp = array[current];
                array[current] = array[top];
                array[top] = tmp;
            }
        return array;
    }

    // Get images for gallery
    $.ajax({
        type: 'GET',
        url: 'assets/js/catimages.json',
        dataType: 'json',
        success: function(data) {

            for (var a = [], i = 0; i <= data.catImages.length - 1; ++i) a[i] = i;
            a = shuffle(a);

            $('.gallery-container img').each(function(index) {
                $(this).attr('src', data.catImages[a[index]].src)
            });
            $('.gallery-container a').each(function(index) {
                $(this).attr('href', data.catImages[a[index]].link)
            });

            $('#sofarcontent').fadeIn();
        }
    })
    //

    $('.upload-image').show();
    $('.upload-success').hide();

    $('.upload').click(function() {
        $('#uploadimage').click();
    });

    $('.submit').click(function() {

        var errorCount = 0;
        $('.left-col .error').removeClass('error');

        if ($('#message').val() === '') {
            errorCount++;
            $('.message-p label').addClass('error');
        }
        if ($('#catname').val() === '') {
            errorCount++;
            $('.catname-p label').addClass('error');
        }
        if ($('#uploadimage').val() === '') {
            errorCount++;
            $('#furry-label').addClass('error');
        }

        if (errorCount == 0) {
            $('.upload-image').hide();
            $('.upload-success').show();
            if ($('#showerror').css('display') !== 'none') $('#form').css('height', $('#form').outerHeight() - 40 + "px")
            $('#showerror').css('display', 'none');
            ga('send', 'event', "Meme", "Meme created");
            $("body").append("<img src='//moon.greenpeace.org/c/?a=badtuna' width='' height='' alt=''>");
        } else {
            if ($('#showerror').css('display') !== 'block') $('#form').css('height', $('#form').outerHeight() + 40 + "px")
            $('#showerror').css('display', 'block');
            ga('send', 'event', "Meme", "Meme submitted with errors");
        }

    });

    $('.facebook-btn').click(function(event) {
        postCanvasToFacebook();
        ga('send', 'event', "Meme", "Shared Meme to Facebook");
    });

    $('.twitter-btn').click(function(event) {
        postCanvasToTwitter();
        ga('send', 'event', "Meme", "Shared Meme to Twitter");
    });


});

function CatInfo() {
    $('.catnametext').html($('#catname').val());
    $('.messagetext').html($('#message').val());
}

$(function() {

    var cvs = $("canvas"),
        cvsWidth = cvs.width(),
        cvsHeight = cvs.height(),
        ctx = cvs[0].getContext("2d"),
        top = $("#message"),
        bottom = $("#catname");

    var img = this;
    var scaledWidth = 330;
    var scaledHeight = 330;
    var posY = 0;
    var posX = 0;
    var width = img.naturalWidth;
    var height = img.naturalHeight;

    function writeCaption(text, y) {
        var size = 35;

        do {
            size--;
            ctx.font = size + 'px Impact, HelveticaNeue-CondensedBlack';
            ctx.lineWidth = size / 15;
        } while (ctx.measureText(text).width > cvsWidth)

        ctx.fillText(text, cvsWidth / 2, y);
        ctx.strokeText(text, cvsWidth / 2, y);

    }

    // Setup basic canvas settings
    $.extend(ctx, {
        strokeStyle: "#000000",
        textAlign: 'center',
        fillStyle: "#ffffff",
        lineCap: "round"
    })

    $("<img />")
        .load(function() {

            var img = this;

            $(document.body).on("keyup", function() {
                var topText = top.val(),
                    bottomText = bottom.val();
                topText = topText.toUpperCase();

                ctx.clearRect(0, 0, cvsWidth, cvsHeight);
                ctx.drawImage(img, 0, 0, cvsWidth, cvsHeight);
                ctx.textBaseline = 'top';
                writeCaption(topText, 10);

                CatInfo();

            }).trigger("keyup");

        })
        .attr("src", "assets/images/empty-photo.png");

    $('#uploadimage').change(function(e) {
        /* Use the FileReader */
        var file = e.target.files[0],
            imageType = /image.*/;

        if (!file.type.match(imageType))
            return;

        var reader = new FileReader();
        reader.onload = fileOnload;
        reader.readAsDataURL(file);
    });

    function fileOnload(event) {
        var img = new Image();
        img.src = event.target.result;

        $("<img />").attr('src', img.src).load(function() {

            var img = this;

            scaledWidth = $('canvas').innerWidth();
            scaledHeight = $('canvas').innerHeight();
            width = img.naturalWidth;
            height = img.naturalHeight;
            posY = 0;
            posX = 0;
            var drag = false;
            var draggedDist = 0;

            aspectRat = width / height;

            if (height > width) {
                drag = 'upDown';
                if (height > $('canvas').innerHeight()) {
                    scaledWidth = $('canvas').innerWidth();
                    scaledHeight = scaledWidth / aspectRat;
                    posY = Math.ceil((scaledHeight - scaledWidth) / 2);
                } else {
                    scaledHeight = $('canvas').innerHeight();
                    scaledWidth = scaledHeight * aspectRat;
                    posX = Math.ceil((scaledWidth - scaledHeight) / 2);
                }
            }
            if (width > height) {
                drag = 'leftRight';
                if (width > $('canvas').innerWidth()) {
                    scaledHeight = $('canvas').innerHeight();
                    scaledWidth = scaledHeight * aspectRat;
                    posX = Math.ceil((scaledWidth - scaledHeight) / 2);
                    origPosX = Math.ceil((scaledWidth - scaledHeight) / 2);
                } else {
                    scaledWidth = $('canvas').innerWidth();
                    scaledHeight = scaledWidth / aspectRat;
                    posY = Math.ceil((scaledHeight - scaledWidth) / 2);
                    origPosY = Math.ceil((scaledHeight - scaledWidth) / 2);
                }
            }

            $(document.body).on("keyup", function() {
                var topText = top.val();
                topText = topText.toUpperCase();

                ctx.clearRect(0, 0, cvsWidth, cvsHeight);
                ctx.drawImage(img, -1 * posX, -1 * posY, scaledWidth, scaledHeight);
                ctx.textBaseline = 'top';
                writeCaption(topText, 10);

                $("<img />").load(function() {

                    var img2 = this;

                    ctx.globalAlpha = 0.9;
                    ctx.drawImage(img2, 12, cvsHeight - 83, 306, 83);

                }).attr("src", "assets/images/tagline.png");

                CatInfo();

            });

            $(document.body).trigger("keyup");



            var dragging = false;
            var origOff = 0;


            function handleDragStart(e) {
                dragging = true;
                if (drag == "leftRight") {
                    if (e.offsetX) {
                        origOff = e.offsetX;
                    } else {
                        origOff = e.originalEvent.touches[0].pageX
                    }
                } else {
                    if (e.offsetY) {
                        origOff = e.offsetY;
                    } else {
                        origOff = e.originalEvent.touches[0].pageY
                    }
                }
            }


            $('#canvas').mousedown(function(e) {
                handleDragStart(e)
            });
            $('#canvas').bind('touchstart', function(e) {
                handleDragStart(e)
            });

            function handleDragMove(e) {
                e.preventDefault();
                if (dragging) {
                    if (drag === "leftRight") {
                        if (e.offsetX) {
                            draggedDist = (e.offsetX - origOff);
                            origOff = e.offsetX;
                        } else {
                            draggedDist = (e.originalEvent.touches[0].pageX - origOff);
                            origOff = e.originalEvent.touches[0].pageX;
                        }

                        if ((posX - draggedDist) > 0 && (posX - draggedDist) < (scaledWidth - scaledHeight)) {
                            posX = posX - draggedDist;
                        }
                        if (posX < 0) posX = 0;
                        if (posX > (scaledWidth - scaledHeight)) posX = scaledWidth - scaledHeight;
                    } else {
                        if (e.offsetY) {
                            draggedDist = (e.offsetY - origOff);
                            origOff = e.offsetY;
                        } else {
                            draggedDist = (e.originalEvent.touches[0].pageY - origOff);
                            origOff = e.originalEvent.pageY;
                        }
                        if ((posY - draggedDist) > 0 && (posY - draggedDist) < (scaledHeight - scaledWidth)) {
                            posY = posY - draggedDist;
                        }
                        if (posY < 0) posY = 0;
                        if (posY > (scaledHeight - scaledWidth)) posX = scaledHeight - scaledWidth;
                    }
                    var topText = top.val();
                    topText = topText.toUpperCase();
                    ctx.clearRect(0, 0, cvsWidth, cvsHeight);
                    ctx.drawImage(img, -1 * posX, -1 * posY, scaledWidth, scaledHeight);
                    ctx.textBaseline = 'top';
                    writeCaption(topText, 10);
                }
            }

            $('#canvas').mousemove(function(e) {
                handleDragMove(e)
            });
            $('#canvas').bind('touchmove', function(e) {
                handleDragMove(e)
            });

            $('#canvas').mouseup(function(e) {
                dragging = false;
            });
            $("#canvas").mouseout(function(e) {
                dragging = false;
            });
            $(document).bind('touchend', function(e) {
                dragging = false;
            });


        });

    }

});

function tweet() {

}

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 

$('#take-action-button').click(function() {
    ga('send', 'event', 'Take Action', 'Button clicked');
});


function dlCanvas() {
    var dt = $("canvas")[0].toDataURL('image/png');
    this.href = dt;
    ga('send', 'event', "Meme", "Meme downloaded");
};
dl.addEventListener('click', dlCanvas, false);
