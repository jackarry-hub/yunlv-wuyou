<script>
import { bootstrapStore } from "./store/app-store";

export default {
  onLaunch() {
    bootstrapStore();
  },
};
</script>

<style>
page {
  min-height: 100%;
  background: #f4f9ff;
  color: #111827;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  font-size: 28rpx;
  line-height: 1.42;
  -webkit-font-smoothing: antialiased;
}

button {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: 1.2;
}

button::after {
  border: 0;
}
</style>
