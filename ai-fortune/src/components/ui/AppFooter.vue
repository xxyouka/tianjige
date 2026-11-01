<script setup>
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="mt-16 py-8 border-t border-border">
    <div class="max-w-4xl mx-auto px-4">
      <!-- 装饰线 -->
      <div class="flex items-center justify-center gap-4 mb-6">
        <span class="h-px w-16 bg-border"></span>
        <span class="text-gold text-lg">☯</span>
        <span class="h-px w-16 bg-border"></span>
      </div>

      <!-- 主要内容 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <!-- 关于 -->
        <div class="text-center md:text-left">
          <h3 class="text-gold font-display text-lg mb-3">天机阁</h3>
          <p class="text-text-muted text-sm leading-relaxed">
            AI 驱动的命理推算平台，<br>
            融合东方传统与西方神秘学，<br>
            为你解读命运的密码。
          </p>
        </div>

        <!-- 功能 -->
        <div class="text-center">
          <h3 class="text-gold font-display text-lg mb-3">命理功能</h3>
          <div class="grid grid-cols-2 gap-2 text-sm text-text-muted">
            <span>八字排盘</span>
            <span>周易占卜</span>
            <span>塔罗牌</span>
            <span>星座运势</span>
            <span>梅花易数</span>
            <span>称骨算命</span>
            <span>测字</span>
            <span>灵签</span>
          </div>
        </div>

        <!-- 声明 -->
        <div class="text-center md:text-right">
          <h3 class="text-gold font-display text-lg mb-3">温馨提示</h3>
          <p class="text-text-muted text-sm leading-relaxed">
            本平台仅供娱乐参考，<br>
            不构成任何决策建议。<br>
            命运掌握在自己手中。
          </p>
        </div>
      </div>

      <!-- 底部 -->
      <div class="text-center text-text-muted text-xs pt-4 border-t border-border">
        <p>© {{ currentYear }} 天机阁 · AI 命理 — 窥探天机，解读命运</p>
      </div>
    </div>
  </footer>
</template>
