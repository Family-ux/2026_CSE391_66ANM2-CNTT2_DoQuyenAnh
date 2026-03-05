console.log("Hello from JavaScript!")
let name = "Đỗ Quyền Anh"
let yearOfBirth = 2006
let currentYear = 2026
let age = currentYear - yearOfBirth

console.log("Xin chào, mình là " + name + ", năm nay mình " + age + " tuổi.")
let score = 6;

if(score >= 8){
    console.log("Giỏi") ;
}else if(score >= 6.5){
    console.log("Khá");
}else if(score >= 5){
    console.log("Trung bình");
}else{
    console.log("Yếu");
}

function tinhDiemTrungbinh(m1 ,m2, m3)
{
    let avg = (m1 + m2 + m3)/3 ;
    return avg ;
}
tinhDiemTrungbinh(7,8,9) ;
function xepLoai(avg) {
  // TODO: Dùng if/else để:
   if(score >= 8){
    console.log("Giỏi") ;
   }else if(score >= 6.5){
    console.log("Khá");
   }else if(score >= 5){
    console.log("Trung bình");
   }else{
    console.log("Yếu");
    }
}
function kiemTraTuoi(age) {
  // TODO:
  // Nếu age >= 18 -> console.log("Đủ 18 tuổi");
  // Ngược lại -> console.log("Chưa đủ 18 tuổi");
  if(age >= 18){
    console.log("Đủ 18 tuổi");
  }else {
    console.log("Chưa đủ 18 tuổi");
    }
}

