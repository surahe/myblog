// Create variables (in this scope) to hold the API and image size
var jcrop_api,
    boundx,
    boundy,

// Grab some information about the preview pane
    $preview = $('#preview-pane'),
    $pcnt = $('#preview-pane .preview-container'),
    $pimg = $('#preview-pane .preview-container #preview_large'),
    xsize = $pcnt.width(),
    ysize = $pcnt.height(),


    $pcnt_s = $('#preview-pane .preview-container_s'),
    $pimg_s = $('#preview-pane .preview-container_s #preview_small'),
    xsize_s = $pcnt_s.width(),
    ysize_s = $pcnt_s.height(),

    //图片链接
    pimg_src,
    j_margin_top=0,
    j_margin_left= 0,
    $logo_submit = $('#logo_submit'),
    $x = $('#x'),
    $y = $('#y'),
    $w = $('#w'),
    $h = $('#h'),
    $width = $('#width'),
    $height = $('#height'),
    $pre_width = $('#pre_width'),
    $pre_height = $('#pre_height')

// 预览图片
function previewImage(file)
{   var div = document.getElementById("preview");
    var type = file.files[0].type;
    var size = file.files[0].size;
    var ext= type.substring(type.lastIndexOf("/"),type.length);

    if (ext != "/bmp" && ext != "/png"  && ext != "/jpg" && ext != "/jpeg") {
        alert("图片限于bmp、png、jpeg、jpg格式");
        return false;
    } else if(size > 10 * 1024 * 1024) {
        alert("上传的图片大小不能超过10M！");
        return false;
    }
    if (file.files && file.files[0]) {
        div.innerHTML = "<img id=\"imghead\">";
        var img = document.getElementById("imghead");
        var reader = new FileReader();
        reader.onload = function (evt) {
            AutoResizeImage(320, 320, img, evt.target.result);
        }
        reader.readAsDataURL(file.files[0]);
        //截去图片
        $('#imghead').Jcrop({
            onChange: updatePreview,
            onSelect: updatePreview,
            allowResize: true,
            aspectRatio: 1
        },function(){
            // Use the API to get the real image size
            var bounds = this.getBounds();
            boundx = bounds[0];
            boundy = bounds[1];
            // Store the API in the jcrop_api variable
            jcrop_api = this;

            jcrop_api.setSelect([0,0,300,300])

            // Move the preview into the jcrop container for css positioning
            $preview.appendTo(jcrop_api.ui.holder);

            //预览图的src
            $pimg.attr("src", pimg_src);
            $pimg_s.attr("src", pimg_src)

            $logo_submit.removeClass('btn-default')
            $logo_submit.addClass('btn-primary')
            $logo_submit.attr("disabled",false);
        });
    }
}

//设置图片大小
function AutoResizeImage(maxWidth,maxHeight,objImg,imgSrc){
    var img = new Image();
    img.src = imgSrc || objImg.src;
    var hRatio;
    var wRatio;
    var Ratio = 1;
    var w = img.width;
    var h = img.height;
    wRatio = maxWidth / w;
    hRatio = maxHeight / h;
    if (wRatio<1 || hRatio<1){
        Ratio = (wRatio<=hRatio?wRatio:hRatio);
    }
    if (Ratio<1){
        w = w * Ratio;
        h = h * Ratio;
    }
    objImg.style.height = Math.round(h) + "px";
    objImg.style.width = Math.round(w) + "px";

    //传递图片居中的参数
    if(h < maxHeight) {
        j_margin_top = Math.round((maxHeight - h) / 2) + "px";
    }
    if(w < maxWidth) {
        j_margin_left = Math.round((maxWidth - w) / 2) + "px";
    }
    //设置src
    if(!objImg.src) {
        pimg_src = objImg.src = imgSrc;
    }
    $width.val(img.width);
    $height.val(img.height);
    $pre_width.val(w);
    $pre_height.val(h);
}

function updatePreview(c)
{
    if (parseInt(c.w) > 0)
    {
        var rx = xsize / c.w;
        var ry = ysize / c.h;

        var rx_s = xsize_s / c.w;
        var ry_s = ysize_s / c.h;

        //大预览框
        $pimg.css({
            width: Math.round(rx * boundx) + 'px',
            height: Math.round(ry * boundy) + 'px',
            marginLeft: '-' + Math.round(rx * c.x) + 'px',
            marginTop: '-' + Math.round(ry * c.y) + 'px',
        });

        //小预览框
        $pimg_s.css({
            width: Math.round(rx_s * boundx) + 'px',
            height: Math.round(ry_s * boundy) + 'px',
            marginLeft: '-' + Math.round(rx_s * c.x) + 'px',
            marginTop: '-' + Math.round(ry_s * c.y) + 'px',
        });
    }
    //赋值截图的坐标
    $x.val(jcrop_api.tellScaled().x)
    $y.val(jcrop_api.tellScaled().y)
    $w.val(jcrop_api.tellScaled().w)
    $h.val(jcrop_api.tellScaled().h)
};