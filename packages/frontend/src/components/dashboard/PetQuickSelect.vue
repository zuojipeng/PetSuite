<template>
  <div class="glass-card rounded-[3rem] p-10 shadow-2xl">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-3xl font-black text-white flex items-center gap-3">
        <span class="material-symbols-outlined text-4xl text-primary">pets</span>
        选择您的宠物
      </h2>
      <button
        @click="$emit('add')"
        class="size-12 rounded-2xl bg-primary/20 hover:bg-primary flex items-center justify-center text-primary hover:text-black transition-all hover:scale-110 group"
        title="添加新宠物"
      >
        <span class="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform">add</span>
      </button>
    </div>

    <!-- 宠物列表 -->
    <div v-if="pets.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="pet in pets"
        :key="pet.id"
        @click="$emit('select', pet)"
        :class="[
          'relative p-6 rounded-3xl cursor-pointer transition-all duration-300 group border-2',
          selectedPetId === pet.id
            ? 'bg-primary/20 border-primary shadow-lg shadow-primary/30 scale-105'
            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105'
        ]"
      >
        <!-- 选中指示器 -->
        <div
          v-if="selectedPetId === pet.id"
          class="absolute -top-3 -right-3 size-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/50"
        >
          <span class="material-symbols-outlined text-black text-xl font-black">check</span>
        </div>

        <!-- 宠物头像 -->
        <div class="flex items-center gap-4 mb-5">
          <div class="size-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl shadow-lg">
            {{ pet.species === 'cat' ? '🐱' : '🐶' }}
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-black text-white mb-1">{{ pet.name }}</h3>
            <p class="text-xs text-slate-400 uppercase tracking-wider font-bold">
              {{ pet.breed || (pet.species === 'cat' ? '猫咪' : '狗狗') }}
            </p>
          </div>
        </div>

        <!-- 健康评分 -->
        <div class="bg-black/30 rounded-2xl p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-slate-400 font-bold">健康评分</span>
            <span class="text-2xl font-black text-primary">{{ pet.healthScore || 85 }}</span>
          </div>
          <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              :style="{ width: `${pet.healthScore || 85}%` }"
            ></div>
          </div>
        </div>

        <!-- 基本信息 -->
        <div class="mt-4 flex items-center justify-between text-xs">
          <div class="text-slate-400">
            <span class="font-bold">年龄:</span>
            <span class="text-white ml-1 font-black">{{ pet.age || 2 }}岁</span>
          </div>
          <div class="text-slate-400">
            <span class="font-bold">体重:</span>
            <span class="text-white ml-1 font-black">{{ pet.weight || 5 }}kg</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-16">
      <div class="text-8xl mb-6 opacity-50">🐾</div>
      <h3 class="text-2xl font-black text-white mb-3">还没有宠物档案</h3>
      <p class="text-slate-400 mb-8 font-medium">创建您的第一个宠物档案开始使用</p>
      <button
        @click="$emit('add')"
        class="bg-primary hover:bg-white text-black font-black px-8 py-4 rounded-2xl transition-all hover:scale-105 shadow-lg shadow-primary/30"
      >
        <span class="flex items-center gap-2">
          <span class="material-symbols-outlined">add</span>
          添加宠物
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Pet {
  id: string
  name: string
  species: 'cat' | 'dog'
  breed?: string
  age?: number
  weight?: number
  healthScore?: number
}

defineProps<{
  pets: Pet[]
  selectedPetId?: string
}>()

defineEmits<{
  select: [pet: Pet]
  add: []
}>()
</script>
