
const couponContainer = document.querySelector('.coupons-container');
const categoryContainer = document.querySelector('.category-container');
const toTopButton = document.querySelector('.to-top');

const searchBar = document.forms['search-form'].querySelector('input');
let page = '1';
searchBar.addEventListener('keyup', function(e){
    const term = e.target.value.toLowerCase();
    const coupons = couponContainer.querySelectorAll('.coupon');
    coupons.forEach(function(coupon){
        const couponName = coupon.querySelector('.coupon-info p').textContent;
        if(couponName.toLocaleLowerCase().indexOf(term) != -1){
            coupon.style.display = 'flex';
        } else {
            coupon.style.display = 'none';
        }
    })

})
const baseUrl = 'http://localhost:5000/rest/certificates/';
const baseImageUrl = 'https://api.unsplash.com/photos';
async function getData(page){
    let pageParam = '?page='+page;
    const response = await fetch(baseUrl+pageParam);
    const data = await response.json();
    return data;
}
async function getImage(page){
    let imageUrlPaginated = baseImageUrl + `?page=${page}`;
    const response = await fetch(imageUrlPaginated, {
        method: 'get',
        headers:{
            'Accept-Version': 'v1',
            'Authorization': 'Client-ID tfYp6LHUJPeZTRt4lp6P6d_pykMhrPxkhmx7YktJjzU'

        }
    });
    const data = await response.json();
    
    return data;
}

async  function loadCouponList(page){
    const data = await getData(page);
    let couponsList = data._embedded.certificateDtoList;
    couponsList.forEach(async function callBack(element, index) {
        const data = await getImage(page);
        console.log(data);
        let clonedContainer = couponContainer.querySelector('.coupon').cloneNode(true);
        
        clonedContainer.firstElementChild.firstElementChild.src = data[index].urls.small;
        clonedContainer.querySelector('.coupon-info-1 p').innerHTML = element.name;
        clonedContainer.querySelector('.coupon-price p').innerHTML = element.price + '$';
        clonedContainer.querySelector('.coupon-info-2').lastElementChild.innerHTML = `expares in ${element.duration} days`;
        couponContainer.appendChild(clonedContainer);

    })
    
} 
loadCouponList(page);

window.addEventListener('scroll', () => {
    
    const documentRect = couponContainer.getBoundingClientRect();
    
    if(documentRect.bottom < document.documentElement.clientHeight + 150){
        page++;
        loadCouponList(page);
    }
})

window.addEventListener('scroll', () => {
    if(window.pageYOffset > 100){
        toTopButton.classList.add('active');
    }else{
        toTopButton.classList.remove('active');
    }
})

