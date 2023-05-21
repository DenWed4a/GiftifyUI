
const couponContainer = document.querySelector('.coupons-container');
const categoryContainer = document.querySelector('.category-container');
const toTopButton = document.querySelector('.to-top');
const couponTemplate = document.querySelector('#coupon-template');

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
    let certificatesPerPage = 10;
    let pageParam = '?page='+page + '&pageSize='+certificatesPerPage;
    const response = await fetch(baseUrl+pageParam);
    const data = await response.json();
    return data;
}
async function getImage(page){
    let imagesPerPage = 10;
    let imageUrlPaginated = baseImageUrl + `?page=${page}` + "&X-Per-Page="+imagesPerPage;
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


async function loadCouponList(page){
    const data = await getData(page);
    const images = await getImage(page);
    let couposList = data._embedded.certificateDtoList;
    

    couposList.forEach(function callback(element, index){
        let clonedContainer = couponTemplate.content.querySelector('.coupon').cloneNode(true);
        clonedContainer.firstElementChild.firstElementChild.src = images[index].urls.small;
        clonedContainer.querySelector('.coupon-info-1 p').innerHTML = element.name;
        clonedContainer.querySelector('.coupon-price p').innerHTML = element.price + '$';
        clonedContainer.querySelector('.coupon-info-2').lastElementChild.innerHTML = `expares in ${element.duration} days`;
        couponContainer.appendChild(clonedContainer);
    })
}



loadCouponList(page);
function handleScroll(){
    const documentRect = couponContainer.getBoundingClientRect();   
    if(documentRect.bottom < document.documentElement.clientHeight + 100){
        page++;
        loadCouponList(page);     
    }
}

window.addEventListener('scroll', _.debounce(handleScroll, 500))

window.addEventListener('scroll', () => {
    if(window.pageYOffset > 100){
        toTopButton.classList.add('active');
    }else{
        toTopButton.classList.remove('active');
    }
})

function reloadData(page1, callback){
    console.log(page1, 2 < page1);
    for(i = 2; i < page1; i++){
        loadCouponList(page1);
    }
    callback();
}
document.addEventListener("DOMContentLoaded", () => {    
    var scrollpos = localStorage.getItem('scrollpos');
    
    
    if (scrollpos){
        reloadData(localStorage.getItem('page'), function() {
            window.scrollTo(0, scrollpos);
            localStorage.removeItem('scrollpos');
        })   
    }
    
});


window.onbeforeunload = function(e) {
    localStorage.setItem('scrollpos', window.scrollY);
    localStorage.setItem('page', page);
};

