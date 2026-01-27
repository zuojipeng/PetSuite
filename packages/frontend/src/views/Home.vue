<template>
  <div class="text-center py-20">
    <h1 class="text-5xl font-bold text-gray-800 mb-6">
      Welcome to PetSuite 🐾
    </h1>
    <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
      AI-powered pet care platform on Monad blockchain.
      Create personalized pet profiles, get AI recommendations, and mint dynamic NFTs.
    </p>

    <div class="grid md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="text-4xl mb-4">🤖</div>
        <h3 class="text-xl font-semibold mb-2">AI Analysis</h3>
        <p class="text-gray-600">
          Advanced AI agents analyze your pet's profile and provide personalized recommendations
        </p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="text-4xl mb-4">🎨</div>
        <h3 class="text-xl font-semibold mb-2">Dynamic NFTs</h3>
        <p class="text-gray-600">
          Pet profiles as NFTs that evolve with your pet's life stages on Monad blockchain
        </p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="text-4xl mb-4">⚡</div>
        <h3 class="text-xl font-semibold mb-2">Fast & Cheap</h3>
        <p class="text-gray-600">
          Powered by Monad's 10,000 TPS and low gas fees for seamless transactions
        </p>
      </div>
    </div>

    <div class="mt-12 space-x-4">
      <router-link
        to="/create-profile"
        class="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition"
      >
        Create Pet Profile
      </router-link>
      <router-link
        to="/ai-advisor"
        class="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
      >
        AI Advisor
      </router-link>
    </div>

    <div class="mt-16 bg-purple-50 p-8 rounded-lg max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">How It Works</h2>
      <div class="text-left space-y-4">
        <div class="flex items-start">
          <span class="text-2xl mr-4">1️⃣</span>
          <div>
            <h4 class="font-semibold">Create Profile</h4>
            <p class="text-gray-600">Input your pet's information and let AI analyze it</p>
          </div>
        </div>
        <div class="flex items-start">
          <span class="text-2xl mr-4">2️⃣</span>
          <div>
            <h4 class="font-semibold">Get Recommendations</h4>
            <p class="text-gray-600">Ask AI for personalized product and care recommendations</p>
          </div>
        </div>
        <div class="flex items-start">
          <span class="text-2xl mr-4">3️⃣</span>
          <div>
            <h4 class="font-semibold">Mint NFT</h4>
            <p class="text-gray-600">Convert your pet's profile into a dynamic NFT on Monad</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Home page - no additional logic needed
</script>
