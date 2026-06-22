<template>
  <YlPage title="优选商城" subtitle="商品浏览、购物车和结算订单统一进入商户端处理">
    <template #action>
      <button class="cart-pill" @click="focusCart">
        <text>购物车</text>
        <text class="cart-pill__count">{{ cartCount }}</text>
      </button>
    </template>

    <view class="search-panel">
      <input v-model="keyword" class="search-input" confirm-type="search" placeholder="搜索血压计、拐杖、护理包" />
      <scroll-view class="category-strip" scroll-x>
        <button
          v-for="category in categories"
          :key="category"
          class="category-button"
          :class="{ 'category-button--active': activeCategory === category }"
          @click="activeCategory = category"
        >
          {{ category }}
        </button>
      </scroll-view>
    </view>

    <YlCard title="商品浏览">
      <view class="product-list">
        <view v-for="item in filteredProducts" :key="item.id" class="product-card">
          <view class="product-visual" :class="item.tone">
            <text>{{ item.shortName }}</text>
          </view>
          <view class="product-main">
            <view class="product-head">
              <view class="product-copy">
                <text class="product-title">{{ item.title }}</text>
                <text class="product-desc">{{ item.description }}</text>
              </view>
              <text class="product-price">¥{{ item.price }}</text>
            </view>
            <view class="product-tags">
              <text v-for="tag in item.tags" :key="tag" class="product-tag">{{ tag }}</text>
            </view>
            <view class="product-action">
              <text class="stock-text">{{ item.stock }} 件可售 · {{ item.delivery }}</text>
              <button class="add-button" @click="addToCart(item)">
                {{ quantityOf(item.id) ? `已选 ${quantityOf(item.id)}` : "加入购物车" }}
              </button>
            </view>
          </view>
        </view>
      </view>
      <text v-if="!filteredProducts.length" class="empty">暂无匹配商品</text>
    </YlCard>

    <YlCard title="购物车">
      <view v-if="cartItems.length" class="cart-list">
        <view v-for="item in cartItems" :key="item.productId" class="cart-item">
          <view class="cart-copy">
            <text class="cart-title">{{ item.title }}</text>
            <text class="cart-meta">¥{{ item.price }} x {{ item.quantity }} = ¥{{ item.subtotal }}</text>
          </view>
          <view class="quantity-control">
            <button class="quantity-button" @click="decreaseQuantity(item.productId)">-</button>
            <text class="quantity-value">{{ item.quantity }}</text>
            <button class="quantity-button" @click="increaseQuantity(item.productId)">+</button>
          </view>
          <button class="remove-button" @click="removeFromCart(item.productId)">移除</button>
        </view>
      </view>
      <view v-else class="empty-cart">
        <text class="empty">购物车为空</text>
      </view>
    </YlCard>

    <YlCard title="配送与备注">
      <view class="checkout-form">
        <input v-model="deliveryLocation" class="form-input" placeholder="配送地址" />
        <input v-model="deliveryTime" class="form-input" placeholder="期望送达时间" />
        <input v-model="remark" class="form-input" placeholder="补充说明，如慢病禁忌、联系家属" />
      </view>
    </YlCard>

    <view v-if="lastOrder" class="order-result">
      <view>
        <text class="result-title">订单已提交</text>
        <text class="result-meta">{{ lastOrder.orderNo || lastOrder.id }} · 已同步商户端</text>
      </view>
      <button class="result-link" @click="openOrders">查看订单</button>
    </view>

    <view class="checkout-bar">
      <view class="checkout-total">
        <text class="total-label">{{ cartCount }} 件商品</text>
        <text class="total-price">合计 ¥{{ cartTotal }}</text>
      </view>
      <YlPrimaryButton text="提交结算" loading-text="提交中" :loading="checkingOut" :disabled="!cartItems.length" @click="checkout" />
    </view>
  </YlPage>
</template>

<script setup>
import { computed, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { api, toastSuccess, toastText } from "../../common/api";
import { navigate } from "../../common/router";

const CART_STORAGE_KEY = "yunlv.user.shop.cart";

const products = [
  {
    id: "shop-bp-001",
    title: "智能血压计",
    shortName: "血压",
    category: "健康设备",
    price: 199,
    stock: 24,
    delivery: "今日可送",
    tone: "tone-blue",
    description: "大字屏、语音播报，适合老人每日健康监测。",
    tags: ["适老", "语音", "健康监测"],
  },
  {
    id: "shop-cane-002",
    title: "防滑助行手杖",
    shortName: "手杖",
    category: "出行辅助",
    price: 89,
    stock: 18,
    delivery: "次日可送",
    tone: "tone-green",
    description: "四脚防滑底座，适合康养社区日常步行辅助。",
    tags: ["防滑", "轻量", "出行"],
  },
  {
    id: "shop-care-003",
    title: "慢病护理包",
    shortName: "护理",
    category: "护理用品",
    price: 128,
    stock: 31,
    delivery: "今日可送",
    tone: "tone-orange",
    description: "血糖记录本、分药盒、消毒湿巾和护理提醒卡。",
    tags: ["慢病", "护理", "家庭"],
  },
  {
    id: "shop-food-004",
    title: "低糖营养早餐",
    shortName: "早餐",
    category: "营养餐食",
    price: 36,
    stock: 40,
    delivery: "明早配送",
    tone: "tone-purple",
    description: "低糖高蛋白搭配，支持旅居公寓按时配送。",
    tags: ["低糖", "营养", "配送"],
  },
];

const categories = ["全部", ...Array.from(new Set(products.map((item) => item.category)))];
const keyword = ref("");
const activeCategory = ref("全部");
const cartItems = ref([]);
const checkingOut = ref(false);
const lastOrder = ref(null);
const deliveryLocation = ref("昆明滇池康养公寓 A座 1208");
const deliveryTime = ref("今日 18:00 前");
const remark = ref("请商户确认库存后电话联系。");

const filteredProducts = computed(() => {
  const term = keyword.value.trim();
  return products.filter((item) => {
    const categoryMatched = activeCategory.value === "全部" || item.category === activeCategory.value;
    const termMatched = !term || `${item.title}${item.description}${item.tags.join("")}`.includes(term);
    return categoryMatched && termMatched;
  });
});

const cartCount = computed(() => cartItems.value.reduce((sum, item) => sum + item.quantity, 0));
const cartTotal = computed(() => cartItems.value.reduce((sum, item) => sum + item.subtotal, 0));

function loadCart() {
  try {
    const saved = uni.getStorageSync(CART_STORAGE_KEY);
    cartItems.value = Array.isArray(saved) ? saved : [];
  } catch (error) {
    cartItems.value = [];
  }
}

function saveCart() {
  try {
    uni.setStorageSync(CART_STORAGE_KEY, cartItems.value);
  } catch (error) {
    // 购物车在当前页面仍可用，存储失败时不阻断结算。
  }
}

function quantityOf(productId) {
  return cartItems.value.find((item) => item.productId === productId)?.quantity || 0;
}

function addToCart(product) {
  const existing = cartItems.value.find((item) => item.productId === product.id);
  if (existing) {
    existing.quantity += 1;
    existing.subtotal = existing.price * existing.quantity;
  } else {
    cartItems.value.push({
      productId: product.id,
      title: product.title,
      category: product.category,
      price: product.price,
      quantity: 1,
      subtotal: product.price,
    });
  }
  saveCart();
  toastSuccess("已加入购物车");
}

function increaseQuantity(productId) {
  const item = cartItems.value.find((entry) => entry.productId === productId);
  if (!item) return;
  item.quantity += 1;
  item.subtotal = item.price * item.quantity;
  saveCart();
}

function decreaseQuantity(productId) {
  const item = cartItems.value.find((entry) => entry.productId === productId);
  if (!item) return;
  item.quantity -= 1;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  item.subtotal = item.price * item.quantity;
  saveCart();
}

function removeFromCart(productId) {
  cartItems.value = cartItems.value.filter((item) => item.productId !== productId);
  saveCart();
}

function focusCart() {
  if (!cartItems.value.length) {
    toastText("请先选择商品");
    return;
  }
  toastText(`购物车已有 ${cartCount.value} 件商品`);
}

async function checkout() {
  if (!cartItems.value.length) {
    toastText("请先选择商品");
    return;
  }
  checkingOut.value = true;
  try {
    const items = cartItems.value.map((item) => ({ ...item }));
    const order = await api.shopCheckout({
      serviceType: "优选商城商品结算",
      providerType: "merchant",
      amount: cartTotal.value,
      time: deliveryTime.value,
      location: deliveryLocation.value,
      source: "用户端优选商城",
      note: `商城结算：${items.map((item) => `${item.title}x${item.quantity}`).join("、")}。${remark.value}`,
      items,
    });
    lastOrder.value = order;
    cartItems.value = [];
    saveCart();
    toastSuccess("商城订单已提交");
  } catch (error) {
    toastText(error.message || "商城结算失败");
  } finally {
    checkingOut.value = false;
  }
}

function openOrders() {
  navigate("/pages/user/orders");
}

onShow(loadCart);
</script>

<style scoped>
.cart-pill {
  display: flex;
  align-items: center;
  gap: 8rpx;
  min-height: 58rpx;
  padding: 0 18rpx;
  border-radius: 999rpx;
  color: #1677ff;
  font-size: 23rpx;
  font-weight: 800;
  background: #eaf5ff;
}

.cart-pill__count {
  min-width: 32rpx;
  height: 32rpx;
  border-radius: 16rpx;
  color: #ffffff;
  font-size: 20rpx;
  line-height: 32rpx;
  text-align: center;
  background: #36c878;
}

.search-panel {
  box-sizing: border-box;
  margin-bottom: 24rpx;
  padding: 22rpx;
  border: 1rpx solid rgba(210, 225, 241, 0.88);
  border-radius: 28rpx;
  background: #ffffff;
}

.search-input {
  box-sizing: border-box;
  width: 100%;
  min-height: 78rpx;
  padding: 0 24rpx;
  border-radius: 20rpx;
  background: #f1f7ff;
  color: #111827;
  font-size: 26rpx;
}

.category-strip {
  width: 100%;
  margin-top: 18rpx;
  white-space: nowrap;
}

.category-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 128rpx;
  min-height: 58rpx;
  margin-right: 12rpx;
  padding: 0 22rpx;
  border-radius: 999rpx;
  color: #64748b;
  font-size: 23rpx;
  font-weight: 800;
  background: #f4f8fc;
}

.category-button--active {
  color: #ffffff;
  background: linear-gradient(135deg, #1677ff, #36c878);
}

.product-list,
.cart-list,
.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.product-card {
  display: flex;
  gap: 18rpx;
  padding: 20rpx;
  border-radius: 26rpx;
  background: #f8fbff;
}

.product-visual {
  display: flex;
  flex: 0 0 116rpx;
  align-items: center;
  justify-content: center;
  width: 116rpx;
  height: 116rpx;
  border-radius: 28rpx;
  color: #ffffff;
  font-size: 26rpx;
  font-weight: 900;
}

.tone-blue {
  background: linear-gradient(135deg, #1677ff, #69b6ff);
}

.tone-green {
  background: linear-gradient(135deg, #26a269, #74d68b);
}

.tone-orange {
  background: linear-gradient(135deg, #ff8a3d, #ffc36d);
}

.tone-purple {
  background: linear-gradient(135deg, #7c5cff, #b39cff);
}

.product-main,
.product-copy,
.cart-copy {
  min-width: 0;
  flex: 1;
}

.product-head,
.product-action,
.cart-item,
.order-result,
.checkout-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.product-title,
.cart-title,
.result-title {
  display: block;
  color: #111827;
  font-size: 29rpx;
  font-weight: 850;
  line-height: 1.3;
}

.product-desc {
  display: block;
  margin-top: 6rpx;
  color: #64748b;
  font-size: 23rpx;
  line-height: 1.45;
}

.product-price {
  flex: 0 0 auto;
  color: #ef6c00;
  font-size: 30rpx;
  font-weight: 900;
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin: 14rpx 0;
}

.product-tag {
  padding: 6rpx 12rpx;
  border-radius: 999rpx;
  color: #1677ff;
  font-size: 20rpx;
  background: #eaf5ff;
}

.stock-text,
.cart-meta,
.result-meta,
.total-label,
.empty {
  color: #64748b;
  font-size: 23rpx;
  line-height: 1.4;
}

.add-button,
.result-link {
  flex: 0 0 auto;
  min-height: 60rpx;
  padding: 0 20rpx;
  border-radius: 18rpx;
  color: #ffffff;
  font-size: 23rpx;
  font-weight: 800;
  background: #1677ff;
}

.cart-item {
  padding: 18rpx 0;
  border-bottom: 1rpx solid #edf2f7;
}

.quantity-control {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 168rpx;
  height: 56rpx;
  overflow: hidden;
  border: 1rpx solid #d6e5f5;
  border-radius: 18rpx;
  background: #ffffff;
}

.quantity-button {
  width: 54rpx;
  height: 54rpx;
  color: #1677ff;
  font-size: 28rpx;
  font-weight: 900;
  line-height: 54rpx;
  background: #ffffff;
}

.quantity-value {
  width: 60rpx;
  color: #111827;
  font-size: 24rpx;
  font-weight: 900;
  text-align: center;
}

.remove-button {
  flex: 0 0 auto;
  color: #ef4444;
  font-size: 22rpx;
  font-weight: 800;
}

.empty-cart {
  padding: 12rpx 0;
}

.form-input {
  box-sizing: border-box;
  width: 100%;
  min-height: 80rpx;
  padding: 0 22rpx;
  border-radius: 20rpx;
  background: #f1f7ff;
  color: #111827;
  font-size: 25rpx;
}

.order-result {
  box-sizing: border-box;
  margin-bottom: 22rpx;
  padding: 22rpx 24rpx;
  border: 1rpx solid rgba(54, 200, 120, 0.28);
  border-radius: 26rpx;
  background: #f0fff7;
}

.checkout-bar {
  position: sticky;
  bottom: calc(142rpx + env(safe-area-inset-bottom));
  z-index: 2;
  box-sizing: border-box;
  margin-bottom: 18rpx;
  padding: 20rpx 22rpx;
  border: 1rpx solid rgba(210, 225, 241, 0.92);
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 14rpx 34rpx rgba(35, 78, 125, 0.12);
}

.checkout-total {
  min-width: 0;
}

.total-label,
.total-price {
  display: block;
}

.total-price {
  color: #ef6c00;
  font-size: 32rpx;
  font-weight: 900;
}
</style>
