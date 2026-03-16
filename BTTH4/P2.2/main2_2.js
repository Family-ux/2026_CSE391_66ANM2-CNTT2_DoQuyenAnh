function showerror(id , message){
    $(`#${id}`).addClass('invalid').removeClass('valid');
    $(`#${id}-error`).text(message);
}
function clearerror(id , message){
    $(`#${id}`).removeClass(`invalid`).addClass(`valid`);
    $(`#${id}-error`).text("") ;
}
function validateSelect(){
    const  se = $("#select").val() ;
    if(se == ""){
        showerror("select" , "Vui lòng chọn món ăn") ;
        return false ;
    }else{
        clearerror("select") ;
        return true;
    }
}
function validateNumber(){
    const sl = $("#number").val() ;
    if (isNaN(sl) || sl < 1 || sl > 99) {
        showerror("number", "Số lượng phải từ 1 - 99");
        return false;
    
    }else{
        clearerror("number") ;
        return true ;
    }
}
function validateTT(){
    const tt = $("input[name='method']:checked").val();
    if(!tt){
        showerror("method", "Vui lòng chọn phương thức thanh toán");
        return false ;
    }else{
        clearerror("method");
        return true ;
    }
}
function validateDate(){
    const date = $("#date").val() ;
    if(!date){
        showerror("date","Vui lòng chọn ngày");
        return false ;
    }
    const realdate = new Date() ;
    realdate.setHours(0,0,0,0) ;
    const datevalue = new Date(date) ;

    const maxdate = new Date() ;
    maxdate.setDate(realdate.getDate() + 30) ;
    if(datevalue < realdate){
        showerror("date","Vui lòng không chọn ngày quá khứ") ;
        return false ;
    }
    if(datevalue > maxdate){
        showerror("date" , "Vui lòng chọn ngày trong vòng 30 ngày từ ngày hôm nay")
        return false ;
    }
    clearerror("date") ;
    return true ;
}
function validateAddress()
{
    const ad = $("#address").val() ;
    if(ad == ""){
        showerror("address" , "Vui lòng nhập địa chỉ giao hàng");
        return false ;
    }
    if(ad.length < 10){
        showerror("address" , "Vui lòng mô tả dài hơn");
        return false ;
    }
    clearerror("address");
    return true;
}
function validateGC(){
    const gc = $("#note").val() ;
    if(gc.length > 200){
        showerror("note","Ghi chú không quá 200 kí tự");
        return false ;
    }
    if(!gc){
        showerror("note","Vui lòng nhập ghi chú") ;
        return false ;
    }
    clearerror("note");
    return true ;
}
$(document).ready(function() {
    $("#select").blur(validateSelect) ;
    $("#number").blur(validateNumber) ;
    $("input[name='method']").change(validateTT)
    $("#date").blur(validateDate) ;
    $("#address").blur(validateAddress);
    $("#note").blur(validateGC) ;

    $("input").on("input", function() {
        const id = $(this).attr("id");
        if (id) clearerror(id);
    });

    $("form").submit(function(e){
        e.preventDefault();
        const isSelect = validateSelect();
        const isNumber = validateNumber();
        const isTT = validateTT() ;
        const isDate = validateDate() ;
        const isAddress = validateAddress() ;
        const isGC = validateGC() ;
        if (isSelect && isNumber && isTT && isDate && isAddress && isGC) {
            showConfirm();
        }
        
    })
    $("#note").on("input", function(){
        const text = $(this).val();
        const length = text.length;

        $("#note-count").text(length);
        if(length > 200){
             $("#note-count").css("color","red");
            showerror("note","Ghi chú không quá 200 ký tự");
        }else{
             $("#note-count").css("color","black");
            clearerror("note");
        }
    });
    $("#select").change(calculateTotal);
    $("#number").on("input", calculateTotal);
    $("#confirm-btn").click(function(){
        $("#confirm-box").hide();
        alert("Đặt hàng thành công 🎉");
    });

    $("#cancel-btn").click(function(){
        $("#confirm-box").hide();
    });
})
const prices = {
    "1": 120000,   
    "2": 10000,    
    "3": 10000     
};
function calculateTotal(){

    const product = $("#select").val();
    const quantity = Number($("#number").val());

    if(!product || !quantity){
        $("#total-price").text("0");
        return;
    }

    const price = prices[product];
    const total = price * quantity;

    $("#total-price").text(total.toLocaleString("vi-VN"));
}
function showConfirm(){

    const product = $("#select option:selected").text();
    const quantity = $("#number").val();
    const date = $("#date").val();
    const total = $("#total-price").text();

    $("#cf-product").text(product);
    $("#cf-quantity").text(quantity);
    $("#cf-total").text(total);
    $("#cf-date").text(date);

    $("#confirm-box").show();
}
