document.addEventListener("DOMContentLoaded", function () {
    // 获取 URL 中的 `product_id` 查询参数
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('product_id'));
    const quantity = parseInt(urlParams.get('quantity'));

    // 获取产品数据（假设从本地 JSON 文件加载）
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            // 判断是否除了 id 为 productId 的数据外，其他没有其他数据
            let hasOnlyId = products.filter(item => item.id !== productId).length === 0;
            // 如果只有 id 为 1 的数据，隐藏 div 
            if (hasOnlyId) {
                document.querySelector('.dreaming_related-product').style.display = 'none';
            } else {
                document.querySelector('.dreaming_related-product').style.marginBottom = '100px';
                const container = document.querySelector('.owl-slick');
                // 获取原有的 slick 配置
                const slickConfig = JSON.parse(container.dataset.slick);
                const responsiveConfig = JSON.parse(container.dataset.responsive);
                // 先销毁现有的 slick 实例（如果存在）
                if ($(container).hasClass('slick-initialized')) {
                    $(container).slick('unslick');
                }
                // 清空容器，避免重复插入
                container.innerHTML = '';
                // 遍历产品数据，为每种布局生成不同结构
                products
                    .filter(product => product.id !== productId) // 过滤掉 id 为 productId 的产品
                    .forEach(product => renderProduct(product, container));
                // 重新初始化 slick 轮播
                if (typeof $ !== 'undefined' && $.fn.slick) {
                    $(container)
                        .removeClass('slick-initialized slick-slider')
                        .slick({
                            ...slickConfig,
                            responsive: responsiveConfig,
                        });
                }
                // 调用该方法，传入包含按钮的容器选择器
                setupAddToCartButtons();
            }
            // 查找匹配的产品
            const product = products.find(p => p.id === productId);
            console.log(product.id); // 输出 product 对象中的 id
            if (product) {
                // 获取 gallery 和 thumbnail 容器
                const galleryWrapper = document.getElementById('product-gallery-wrapper');
                const thumbnailNav = document.getElementById('thumbnail-nav');

                // 动态生成产品图片和缩略图
                if (Array.isArray(product.images) && Array.isArray(product.thumbnail_images)) {
                    // 插入大图
                    product.images.forEach(image => {
                        const imageElement = document.createElement('div');
                        imageElement.classList.add('rustrot-product-gallery__image');
                        imageElement.innerHTML = `<img src="${image}" alt="product image">`;
                        galleryWrapper.appendChild(imageElement);
                    });

                    // 插入缩略图
                    product.thumbnail_images.forEach(thumbnail => {
                        const liElement = document.createElement('li');
                        const imgElement = document.createElement('img');
                        imgElement.src = thumbnail;
                        imgElement.alt = 'img';

                        liElement.appendChild(imgElement);
                        thumbnailNav.appendChild(liElement);
                    });
                }

                // 动态生成 Categories
                populateLinks('.posted_in', 'Categories', product.categories);
                // 动态生成 Tags
                populateLinks('.tagged_as', 'Tags', product.tags);

                // 这里你可以继续填充其他部分，如产品标题、价格等
                document.querySelector('.page-title').textContent = product.name;
                document.getElementById('price').innerHTML = `<span class="rustrot-Price-currencySymbol">$</span>${product.price}`;
                document.querySelector('.stock.in-stock span').textContent = product.availability;
                document.querySelector('.sku').textContent = product.sku;
                document.querySelector('input[name="product_id"]').value = product.id;
                document.querySelector('.single_add_to_cart_button').addEventListener('click', function (event) {
                    event.preventDefault(); // 阻止按钮的默认行为（例如表单提交）
                    // 获取 product_id 和 quantity 值
                    let quantityValue = document.querySelector('input[name="quantity"]').value;
                    if (quantityValue > 0) {
                        // 如果数量大于 0，执行相应的操作
                        let productId = product.id;
                        // 从 LocalStorage 中获取当前的 Map（如果有）
                        let cartMap = JSON.parse(localStorage.getItem('cartMap')) || {};
                        console.log(cartMap);
                        // 更新 Map 数据
                        cartMap[productId] = quantityValue;
                        // 保存回 LocalStorage
                        localStorage.setItem('cartMap', JSON.stringify(cartMap));
                        // 跳转到购物车页面
                        window.location.href = "cart.html"; // 跳转到 cart.html 页面
                    } else {
                        // 如果数量小于或等于 0，执行其他操作
                        alert(`The quantity must be greater than 0`);
                    }
                });
                // 获取描述部分的容器
                const descriptionContainer = document.querySelector('.rustrot-product-details__short-description');
                descriptionContainer.querySelector('p').textContent = product.description;
                // 获取 <ul> 元素
                const featureList = descriptionContainer.querySelector('ul');
                // 清空现有的 <ul> 内容
                featureList.innerHTML = '';
                // 遍历特征列表，生成 <li> 元素并添加到 <ul> 中
                product.details.forEach(detail => {
                    const liElement = document.createElement('li');
                    liElement.textContent = detail;
                    featureList.appendChild(liElement);
                });

                // 加载另一个 JS 文件
                reloadScripts(['assets/js/mobilemenu.js', 'assets/js/common.js']);
            } else {
                console.log('Product not found');
            }

        })
        .catch(error => console.error('Error loading products:', error));

    function populateLinks(containerSelector, title, items) {
        const container = document.querySelector(containerSelector);

        // 清空容器内容并添加标题
        container.innerHTML = `${title}: `;

        // 遍历 items 数据生成链接
        items.forEach((item, index) => {
            const linkElement = document.createElement('a');
            linkElement.href = "#"; // 动态生成链接地址
            linkElement.rel = "tag";
            linkElement.textContent = item;

            container.appendChild(linkElement);

            // 添加逗号分隔符（最后一个项不加）
            if (index < items.length - 1) {
                container.appendChild(document.createTextNode(', '));
            }
        });
    }

})

// 重载多个脚本
function reloadScripts(scriptUrls) {
    scriptUrls.forEach(url => {
        // 查找当前页面中已加载的同名脚本
        const existingScript = document.querySelector(`script[src="${url}"]`);
        if (existingScript) {
            existingScript.parentNode.removeChild(existingScript); // 移除旧的 script 标签
        }

        // 创建并加载新的 script 标签
        const script = document.createElement('script');
        script.src = url;

        // 你可以根据需要为每个脚本设置事件监听器
        script.onload = function () {
            console.log(`Script loaded: ${url}`);
        };

        script.onerror = function () {
            console.error(`Error loading script: ${url}`);
        };

        document.body.appendChild(script); // 将新的 script 标签添加到 head 中
    });
}


function renderProduct(product, container) {
    const productItem = document.createElement('div');
    productItem.classList.add(
        'product-item', 'style-01', 'post-27', 'product', 'type-product',
        'status-publish', 'has-post-thumbnail', 'product_cat-table', 'product_cat-new-arrivals',
        'product_cat-lamp', 'product_tag-table', 'product_tag-sock', 'instock',
        'shipping-taxable', 'purchasable', 'product-type-variable', 'has-default-attributes'
    );
    productItem.innerHTML = `
                 <div class="product-inner tooltip-left">
                                <div class="product-thumb">
                                    <a class="thumb-link" href="single-product.html?product_id=${product.id}" tabindex="0">
                                        <img class="img-responsive" src="${product.images[0]}" alt="${product.name}" width="600" height="778">
                                    </a>
                                    <div class="flash"><span class="onnew"><span class="text">New</span></span>
                                    </div>
                                    <div class="group-button">
                                        <div class="add-to-cart">
                                            <a href="cart.html" class="button product_type_variable add_to_cart_button" data-product-id="${product.id}">Add to
                                            cart</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="product-info equal-elem">
                                    <h3 class="product-name product_title">
                                          <a href="single-product.html?product_id=${product.id}" tabindex="0">${product.name}</a>
                                    </h3>
                                    <div class="rating-wapper nostar">
                                        <div class="star-rating"><span style="width:0%">Rated <strong
                                            class="rating">0</strong> out of 5</span></div>
                                        <span class="review">(0)</span></div>
                                    <span class="price"><span class="rustrot-Price-amount amount"><span
                                        class="rustrot-Price-currencySymbol">$</span>${product.price}</span>
                                    </span>
                                </div>
                            </div>`;
    // 插入到指定的容器
    container.appendChild(productItem);
}

function setupAddToCartButtons() {
    const buttons = document.querySelectorAll('.add_to_cart_button');
    // 为每个按钮绑定点击事件
    buttons.forEach(button => {
        button.addEventListener('click', function (event) {
            // 阻止默认行为，防止页面跳转
            event.preventDefault();
            // 获取产品的 ID
            const productId = button.getAttribute('data-product-id');
            console.log(productId)
            if (!productId) {
                console.error('Product ID not found for button:', button);
                return;
            }
            // 从 LocalStorage 中获取当前的 Map（如果有）
            let cartMap = JSON.parse(localStorage.getItem('cartMap')) || {};
            console.log(cartMap);
            // 更新 Map 数据
            cartMap[productId] = 1;
            // 保存回 LocalStorage
            localStorage.setItem('cartMap', JSON.stringify(cartMap));
            // 跳转到购物车页面
            window.location.href = "cart.html"; // 跳转到 cart.html 页面
        });
    });
}
