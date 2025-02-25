console.log("common.js 被加载了");
setCommon();
async function setCommon() {
    // 获取 <ul> 元素
    const menu = document.querySelector('#menu-primary-menu');
    if (menu) {
        menu.innerHTML = '';

        // 创建菜单项
        const menuItems = [
            { title: 'Home', href: 'index.html' },
            { title: 'About', href: 'about.html' },
            { title: 'Region', href: '#', isRegion: true }
        ];

        // 创建并添加菜单项
        menuItems.forEach(item => {
            const listItem = document.createElement('li');
            listItem.classList.add('menu-item', 'menu-item-type-post_type', 'menu-item-object-megamenu', 'menu-item-230');

            if (item.isRegion) {
                listItem.innerHTML = `
                <a class="rustrot-menu-item-title" title="${item.title}" href="${item.href}">${item.title}</a>
                <span class="toggle-submenu"></span>
                <ul role="menu" class="submenu">
                    <li id="menu-item-987" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-987">
                        <a class="rustrot-menu-item-title" title="UK">UK</a>
                    </li>
                    <li id="menu-item-988" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-988">
                        <a class="rustrot-menu-item-title" title="US">US</a>
                    </li>
                    <li id="menu-item-989" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-989">
                        <a class="rustrot-menu-item-title" title="DE">DE</a>
                    </li>
                </ul>
            `;
            } else {
                listItem.innerHTML = `
                <a class="rustrot-menu-item-title" title="${item.title}" href="${item.href}">${item.title}</a>
            `;
            }

            menu.appendChild(listItem);
        });

        // 事件委托：为父元素添加点击事件
        menu.addEventListener('click', function (event) {
            const target = event.target;

            // 确保点击的是菜单项中的链接
            if (target.tagName === 'A' && target.closest('.submenu')) {
                event.preventDefault();  // 防止跳转

                let selectedCurrency = '';
                if (target.title === 'UK') {
                    selectedCurrency = '£';
                } else if (target.title === 'US') {
                    selectedCurrency = '$';
                } else if (target.title === 'DE') {
                    selectedCurrency = '€';
                }

                // 保存选择的货币符号
                localStorage.setItem('selectedCurrency', selectedCurrency);
                location.reload();  // 刷新当前页面
            }
        });
    }

    // 定义新的联系方式
    const newContactInfo = {
        currency: localStorage.getItem('selectedCurrency') || "$",
        band: "BUZHIWU",
        bandSite: "https://www.buzhiwu.com",
        phone: "(+44) 7496 274719",
        email: "amazonbeboss@gmail.com",
        address: "Office 101 32 Threadneedle Street, London, United Kingdom, EC2R 8AY"
    };

    // 遍历所有的文本节点并替换
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node = walker.nextNode()) {
        if (node.nodeValue.includes('$')) {
            node.nodeValue = node.nodeValue.replace(/\$/g, newContactInfo.currency);
        }
    }

    // 修改标题
    document.title = newContactInfo.band;

    // 修改品牌名称
    document.querySelectorAll('.brand-name').forEach(element => {
        element.textContent = newContactInfo.band;
    });

    // 修改电话
    const phoneElement = document.querySelector('.rustrot-listitem.style-01.contact .listitem-list li:nth-child(1) a');
    if (phoneElement) {
        phoneElement.textContent = newContactInfo.phone;
        phoneElement.setAttribute('href', `tel:${newContactInfo.phone.replace(/\D+/g, '')}`);
    }

    // 修改电子邮件
    const emailElement = document.querySelector('.rustrot-listitem.style-01.contact .listitem-list li:nth-child(2) a');
    if (emailElement) {
        emailElement.textContent = newContactInfo.email;
        emailElement.setAttribute('href', `mailto:${newContactInfo.email}`);
    }

    // 修改地址
    const addressElement = document.querySelector('.rustrot-listitem.style-01.contact .listitem-list li:nth-child(3)');
    if (addressElement) {
        addressElement.innerHTML = `<span>Address</span> ${newContactInfo.address}`;
    }

    // 修改版权信息
    const copyrightElement = document.querySelector('.section-016 .col-md-6 p');
    if (copyrightElement) {
        copyrightElement.innerHTML = `© 2024 by <a href="${newContactInfo.bandSite}">${newContactInfo.band}</a>. All Rights Reserved.`;
    }

    // 修改订阅邮箱提示语
    const newsletterDesc = document.querySelector('.newsletter-wrap .desc');
    if (newsletterDesc) {
        newsletterDesc.textContent = 'Subscribe to our newsletter for exclusive updates, tips, and special offers delivered straight to your inbox!';
    }

    // 删除 "Orders and Returns" 的 <li> 元素
    const orderTrackingLink = document.querySelector('li a[href="order-tracking.html"]');
    if (orderTrackingLink) {
        const orderTrackingLi = orderTrackingLink.closest('li');
        if (orderTrackingLi) {
            orderTrackingLi.remove();
        }
    }

    renderCartItems(newContactInfo.currency);
}

// 定义一个函数，根据 cartMap 动态生成购物车列表
async function renderCartItems(currencySymbol = '$') {
    // 从本地存储中获取 cartMap 数据
    let cartMap = JSON.parse(localStorage.getItem('cartMap')) || {};

    // 更新购物车项目数量
    const cartNumberElement = document.querySelector('.minicart-number-items');
    if (cartNumberElement) {
        cartNumberElement.textContent = Object.keys(cartMap).length;
    }

    const cartCountElement = document.querySelector('.shopcart-dropdown .count');
    if (cartCountElement) {
        cartCountElement.innerHTML = Object.keys(cartMap).length;
    }

    // 获取购物车列表的 DOM 元素
    const cartList = document.querySelector('.rustrot-mini-cart.cart_list');
    if (!cartList) return; // 如果找不到购物车列表，直接返回

    // 获取 products.json 数据
    let response;
    try {
        response = await fetch('products.json');
    } catch (error) {
        console.error('Failed to fetch products.json:', error);
        return;
    }

    let products;
    try {
        products = await response.json();
    } catch (error) {
        console.error('Failed to parse products.json:', error);
        return;
    }

    // 清空现有的购物车列表
    cartList.innerHTML = '';

    // 遍历 cartMap，生成购物车项目
    let total = 0; // 定义一个变量来保存总金额
    for (let productId in cartMap) {
        const product = products[productId - 1];
        if (!product) {
            console.warn(`Product with ID ${productId} not found.`);
            continue; // 如果找不到产品，跳过该项
        }

        const currencySymbol = localStorage.getItem('selectedCurrency') || "$"; // 默认货币符号为美元
        // 根据 currencySymbol 修改价格
        let modifiedPrice = product.price;
        if (currencySymbol === "£") {
            modifiedPrice = 89.99;
        }
        const subtotal = cartMap[productId] * modifiedPrice; // 计算小计
        total += subtotal; // 将当前小计累加到总金额

        // 创建列表项 HTML
        const listItem = `
            <li class="rustrot-mini-cart-item mini_cart_item">
                <a href="single-product.html?product_id=${product.id}">
                    <img src="${product.images[0]}" class="attachment-rustrot_thumbnail size-rustrot_thumbnail" alt="${product.name}" width="600" height="778">
                    ${product.name}&nbsp;
                </a>
                <span class="quantity">${cartMap[productId]} × <span class="rustrot-Price-amount amount"><span class="rustrot-Price-currencySymbol">${currencySymbol}</span>${modifiedPrice}</span>
                </span>
            </li>
        `;

        // 插入到购物车列表中
        cartList.insertAdjacentHTML('beforeend', listItem);
    }

    // 更新总金额
    const totalElement = document.querySelector('.rustrot-mini-cart__total .rustrot-Price-amount');
    if (totalElement) {
        totalElement.innerHTML = `<span class="rustrot-Price-currencySymbol">${currencySymbol}</span>${total.toFixed(2)}`;
    }
}