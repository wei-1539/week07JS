
// LV2：依照此 XD 設計稿，用 axios 介接資料，並顯示 C3 圖表
// LV3：做 LV2，並加上上方套票新增時，下方 C3 與套票列表也會即時更新


let data;
axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json')
    .then(function (response) {
        // console.log(response.data)
        // const call = response.data["data"]
        // console.log(call)
        data = response.data["data"]
        console.log(data)
        renderData()
        renderC3()
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })

function renderC3() {
    const chart = c3.generate({
        bindto: '#chart',
        data: {
            columns: [
                ['data1', 30, 200, 100, 400, 150, 250],
                ['data2', 50, 20, 10, 40, 15, 25]
            ],
            type : 'donut',
        }
    });
}
// 印出套票
const ticketCard = document.querySelector(".ticketCard-area");
const result = document.querySelector("#searchResult-text");

function renderData() {
    let str = ``;
    data.forEach((item) => {
        str += showHTML(item);
    })
    // console.log(str)
    ticketCard.innerHTML = `目前共 ${data.length} 筆資料`;
    ticketCard.innerHTML = str;
}


// HTML結構
function showHTML(i) {
    let show = `
    <li class="ticketCard">
                <div class="ticketCard-img">
                    <a href="#">
                        <img src="${i.imgUrl}"
                            alt="">
                    </a>
                    <div class="ticketCard-region">${i.area}</div>
                    <div class="ticketCard-rank">${i.rate}</div>
                </div>
                <div class="ticketCard-content">
                    <div>
                        <h3>
                            <a href="#" class="ticketCard-name">${i.name}</a>
                        </h3>
                        <p class="ticketCard-description">
                            ${i.description}
                        </p>
                    </div>
                    <div class="ticketCard-info">
                        <p class="ticketCard-num">
                            <span><i class="fas fa-exclamation-circle"></i></span>
                            剩下最後 <span id="ticketCard-num"> ${i.group} </span> 組
                        </p>
                        <p class="ticketCard-price">
                            TWD <span id="ticketCard-price">$${i.price}</span>
                        </p>
                    </div>
                </div>
            </li>
    `;
    return show;
}

//搜尋功能
const search = document.querySelector(".regionSearch");
search.addEventListener("click", (e) => {
    console.log(e.target.value)
    if (e.target.value === "地區搜尋") {
        console.log("請選擇地區")
        return
    }
    let str = ``;
    let searchNum = 0;
    data.forEach((i) => {
        if (e.target.value === "") {
            str += showHTML(i)
            searchNum++
        } else if (e.target.value === i.area) {
            str += showHTML(i)
            searchNum++
        }
    })
    result.textContent = `本次搜尋共 ${searchNum} 筆資料`;
    ticketCard.innerHTML = str;
})



// 新增卡片
// 套票名稱
const ticketName = document.querySelector("#ticketName");
const errorTicketName = document.querySelector("#ticketName-message");

// 圖片網址
const imgUrl = document.querySelector("#ticketImgUrl");
const errorImgUrl = document.querySelector("#ticketImgUrl-message");

// 景點地區
const region = document.querySelector("#ticketRegion");
const errorRegion = document.querySelector("#ticketRegion-message");

// 金額
const price = document.querySelector("#ticketPrice");
const errorPrice = document.querySelector("#ticketPrice-message");

// 組數
const ticketNum = document.querySelector("#ticketNum");
const errorTicketNum = document.querySelector("#ticketNum-message");

// 星級
const ticketRate = document.querySelector("#ticketRate");
const errorTicketRate = document.querySelector("#ticketRate-message");

// 描述
const description = document.querySelector("#ticketDescription");
const errorDescription = document.querySelector("#ticketDescription-message");

// 新增套票
const add = document.querySelector("#add");

//將必填的DOM組成陣列
let errorObj = [
    errorTicketName,
    errorImgUrl,
    errorRegion,
    errorPrice,
    errorTicketNum,
    errorTicketRate,
    errorDescription,
];


function errorCheck() {
    let errorShow = `<i class="fas fa-exclamation-circle"></i>
    <span>必填!</span> `;
    // 偵測input裡面的值 
    let checkObj = [
        ticketName.value,
        imgUrl.value,
        region.value,
        price.value,
        ticketNum.value,
        ticketRate.value,
        description.value,
    ];

    checkObj.forEach((i, ind) => {
        console.log(i)
        if (i === "") {
            errorObj[ind].innerHTML = errorShow
        } else {
            console.log("有填東西", errorObj[ind])
            errorObj[ind].innerHTML = ""
        }
    })
}

// 印出表單內容
add.addEventListener("click", () => {
    console.log("點到呵")

    if (
        ticketName.value === "" ||
        imgUrl.value === "" ||
        region.value === "" ||
        price.value === "" ||
        ticketNum.value === "" ||
        ticketRate.value === "" ||
        description.value === ""
    ) {
        errorCheck();
    } else {
        errorCheck();
        let obj = {}
        // "id": 0,
        obj.id = data.length;
        // "name": "肥宅心碎賞櫻3日",
        obj.name = ticketName.value;
        // "imgUrl": "https://images.unsplash.com/photo-1522383225653-ed111181a951?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1655&q=80",
        obj.imgUrl = imgUrl.value;
        // "area": "高雄",
        obj.area = region.value;
        // "description": "賞櫻花最佳去處。肥宅不得不去的超讚景點！",
        obj.description = description.value;
        // "group": 87,
        obj.group = ticketNum.value;
        // "price": 1400,
        obj.price = price.value;
        // "rate": 10
        obj.rate = ticketRate.value;
        // console.log(obj)
        data.push(obj)
        // console.log(obj)
        // 將資料印出來
        renderData()

        const clearForm = document.querySelector(".addTicket-form");
        // 使用 reset 就可以直接清空資料
        clearForm.reset();
    }
})