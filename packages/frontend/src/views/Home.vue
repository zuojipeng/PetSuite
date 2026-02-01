<template>
  <div>
    <!-- Hero Section -->
    <div class="text-center py-16 px-4">
      <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
        {{ t('home.title') }}
      </h1>
      <p class="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
        {{ t('home.subtitle') }}
      </p>

      <!-- Main CTA -->
      <router-link
        to="/my-pets"
        class="inline-flex items-center gap-3 bg-purple-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-purple-700 hover:scale-105 transition-all shadow-lg"
      >
        <span class="material-symbols-outlined">add_circle</span>
        {{ t('home.cta.addMyPet') }}
      </router-link>

      <!-- Secondary CTA -->
      <div class="mt-6">
        <router-link
          to="/marketplace"
          class="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
        >
          或先逛逛精选好物
          <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </router-link>
      </div>
    </div>

    <!-- Features Section - AI-First -->
    <div class="max-w-6xl mx-auto px-4 py-16">
      <div class="grid md:grid-cols-3 gap-8">
        <!-- Feature 1: AI Expert -->
        <div class="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-center w-16 h-16 bg-purple-600 rounded-xl mb-6 mx-auto">
            <span class="material-symbols-outlined text-white text-3xl">psychology</span>
          </div>
          <h3 class="text-2xl font-bold mb-3 text-center text-gray-900">
            {{ t('home.features.aiExpert.title') }}
          </h3>
          <p class="text-gray-600 text-center leading-relaxed">
            {{ t('home.features.aiExpert.description') }}
          </p>
          <!-- AI Agents Preview -->
          <div class="mt-6 flex items-center justify-center gap-2">
            <div class="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
              营养
            </div>
            <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
              健康
            </div>
            <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
              行为
            </div>
          </div>
        </div>

        <!-- Feature 2: Personalized Care -->
        <div class="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-center w-16 h-16 bg-green-600 rounded-xl mb-6 mx-auto">
            <span class="material-symbols-outlined text-white text-3xl">favorite</span>
          </div>
          <h3 class="text-2xl font-bold mb-3 text-center text-gray-900">
            {{ t('home.features.personalizedCare.title') }}
          </h3>
          <p class="text-gray-600 text-center leading-relaxed">
            {{ t('home.features.personalizedCare.description') }}
          </p>
          <div class="mt-6 space-y-2">
            <div class="flex items-center justify-center gap-2 text-sm text-gray-700">
              <span class="material-symbols-outlined text-green-600">restaurant</span>
              <span>定制饮食方案</span>
            </div>
            <div class="flex items-center justify-center gap-2 text-sm text-gray-700">
              <span class="material-symbols-outlined text-green-600">fitness_center</span>
              <span>运动健康计划</span>
            </div>
          </div>
        </div>

        <!-- Feature 3: Digital Record (Progressive) -->
        <div class="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-center w-16 h-16 bg-amber-600 rounded-xl mb-6 mx-auto">
            <span class="material-symbols-outlined text-white text-3xl">workspace_premium</span>
          </div>
          <h3 class="text-2xl font-bold mb-3 text-center text-gray-900">
            {{ t('home.features.digitalRecord.title') }}
          </h3>
          <p class="text-gray-600 text-center leading-relaxed">
            {{ t('home.features.digitalRecord.description') }}
          </p>
          <div class="mt-6">
            <div class="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">
              <span class="material-symbols-outlined text-sm">stars</span>
              可选增值功能
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- How It Works -->
    <div class="bg-gradient-to-br from-purple-50 to-blue-50 py-16 px-4">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12 text-gray-900">
          {{ t('home.howItWorks.title') }}
        </h2>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Step 1 -->
          <div class="relative">
            <div class="bg-white p-8 rounded-2xl shadow-md h-full">
              <div class="flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-full font-bold text-xl mb-4">
                1
              </div>
              <h4 class="text-xl font-bold mb-3 text-gray-900">
                {{ t('home.howItWorks.step1.title') }}
              </h4>
              <p class="text-gray-600 leading-relaxed">
                {{ t('home.howItWorks.step1.description') }}
              </p>
            </div>
            <!-- Arrow -->
            <div class="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
              <span class="material-symbols-outlined text-purple-300 text-4xl">arrow_forward</span>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="relative">
            <div class="bg-white p-8 rounded-2xl shadow-md h-full">
              <div class="flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-full font-bold text-xl mb-4">
                2
              </div>
              <h4 class="text-xl font-bold mb-3 text-gray-900">
                {{ t('home.howItWorks.step2.title') }}
              </h4>
              <p class="text-gray-600 leading-relaxed">
                {{ t('home.howItWorks.step2.description') }}
              </p>
            </div>
            <!-- Arrow -->
            <div class="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
              <span class="material-symbols-outlined text-purple-300 text-4xl">arrow_forward</span>
            </div>
          </div>

          <!-- Step 3 -->
          <div>
            <div class="bg-white p-8 rounded-2xl shadow-md h-full">
              <div class="flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-full font-bold text-xl mb-4">
                3
              </div>
              <h4 class="text-xl font-bold mb-3 text-gray-900">
                {{ t('home.howItWorks.step3.title') }}
              </h4>
              <p class="text-gray-600 leading-relaxed">
                {{ t('home.howItWorks.step3.description') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Final CTA -->
        <div class="text-center mt-12">
          <router-link
            to="/my-pets"
            class="inline-flex items-center gap-3 bg-purple-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-purple-700 hover:scale-105 transition-all shadow-lg"
          >
            <span class="material-symbols-outlined">pets</span>
            {{ t('home.cta.addMyPet') }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- Trust Indicators (Optional) -->
    <div class="max-w-6xl mx-auto px-4 py-12">
      <div class="grid md:grid-cols-4 gap-8 text-center">
        <div>
          <div class="text-3xl font-bold text-purple-600 mb-2">1000+</div>
          <div class="text-gray-600">宠物档案</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-purple-600 mb-2">5000+</div>
          <div class="text-gray-600">AI 推荐</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-purple-600 mb-2">95%</div>
          <div class="text-gray-600">满意度</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-purple-600 mb-2">24/7</div>
          <div class="text-gray-600">智能服务</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
