<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ isEdit ? '编辑商品' : '创建商品' }}</h2>
        <button @click="$emit('close')" class="btn-close">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <!-- Basic Info -->
        <div class="form-section">
          <h3 class="section-title">基本信息</h3>

          <div class="form-group">
            <label class="form-label required">商品名称</label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="例如：天然有机猫粮 5kg"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label required">商品描述</label>
            <textarea
              v-model="formData.description"
              rows="3"
              placeholder="详细描述商品特点、用途、规格等..."
              class="form-input"
              required
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label required">分类</label>
              <select v-model="formData.category" class="form-input" required>
                <option value="">请选择</option>
                <option value="food">食品</option>
                <option value="toy">玩具</option>
                <option value="health">健康</option>
                <option value="service">服务</option>
                <option value="accessory">配件</option>
                <option value="other">其他</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label required">价格 (ETH)</label>
              <input
                v-model="formData.price"
                type="number"
                step="0.0001"
                min="0"
                placeholder="0.001"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label required">库存数量</label>
              <input
                v-model.number="formData.inventory"
                type="number"
                min="0"
                placeholder="100"
                class="form-input"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">标签</label>
            <div class="tags-input">
              <span v-for="(tag, index) in formData.tags" :key="index" class="tag">
                {{ tag }}
                <button type="button" @click="removeTag(index)" class="tag-remove">×</button>
              </span>
              <input
                v-model="newTag"
                @keydown.enter.prevent="addTag"
                type="text"
                placeholder="输入标签后按回车"
                class="tag-input"
              />
            </div>
          </div>
        </div>

        <!-- Images -->
        <div class="form-section">
          <h3 class="section-title">商品图片</h3>
          <div class="image-upload">
            <div v-for="(img, index) in formData.images" :key="index" class="image-preview">
              <img :src="img" :alt="`商品图 ${index + 1}`" />
              <button type="button" @click="removeImage(index)" class="image-remove">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="image-upload-btn">
              <input
                type="text"
                v-model="newImageUrl"
                @keydown.enter.prevent="addImage"
                placeholder="输入图片 URL 后按回车"
                class="form-input"
              />
              <p class="image-hint">支持 HTTP/HTTPS URL 或 IPFS 链接</p>
            </div>
          </div>
        </div>

        <!-- NFT Benefits -->
        <div class="form-section">
          <h3 class="section-title">NFT 会员权益</h3>

          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="formData.nftBenefit.enabled" type="checkbox" />
              <span>启用 NFT 会员折扣</span>
            </label>
          </div>

          <div v-if="formData.nftBenefit.enabled" class="nft-benefits-config">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label required">折扣比例 (%)</label>
                <input
                  v-model.number="formData.nftBenefit.discountPercent"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="10"
                  class="form-input"
                  :required="formData.nftBenefit.enabled"
                />
                <p class="field-hint">输入 10 表示九折（10% off）</p>
              </div>

              <div class="form-group">
                <label class="form-label">最低健康分要求</label>
                <input
                  v-model.number="formData.nftBenefit.minHealthScore"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="可选"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label class="form-label">最低宠物等级</label>
                <input
                  v-model.number="formData.nftBenefit.minPetLevel"
                  type="number"
                  min="1"
                  placeholder="可选"
                  class="form-input"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button type="button" @click="$emit('close')" class="btn-secondary">取消</button>
          <button type="submit" :disabled="saving" class="btn-primary">
            <span v-if="saving">保存中...</span>
            <span v-else>{{ isEdit ? '保存修改' : '创建商品' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { Product, CreateProductDto } from '@petsuite/shared/types/product'

const props = defineProps<{
  product?: Product | null
}>()

const emit = defineEmits<{
  close: []
  saved: [product: Product]
}>()

const isEdit = ref(!!props.product)
const saving = ref(false)

const formData = reactive<CreateProductDto>({
  name: '',
  description: '',
  category: 'food',
  price: '',
  images: [],
  inventory: 0,
  nftBenefit: {
    enabled: false,
    discountPercent: 10
  },
  tags: []
})

const newTag = ref('')
const newImageUrl = ref('')

const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !formData.tags.includes(tag)) {
    formData.tags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (index: number) => {
  formData.tags.splice(index, 1)
}

const addImage = () => {
  const url = newImageUrl.value.trim()
  if (url && !formData.images.includes(url)) {
    formData.images.push(url)
    newImageUrl.value = ''
  }
}

const removeImage = (index: number) => {
  formData.images.splice(index, 1)
}

const handleSubmit = async () => {
  saving.value = true
  try {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const savedProduct: Product = {
      _id: props.product?._id || `new-${Date.now()}`,
      merchantAddress: '0x123', // TODO: Get from auth store
      ...formData,
      currency: 'ETH',
      soldCount: props.product?.soldCount || 0,
      status: props.product?.status || 'active',
      createdAt: props.product?.createdAt || new Date(),
      updatedAt: new Date()
    }

    emit('saved', savedProduct)
  } catch (error) {
    console.error('Failed to save product:', error)
    alert('保存失败，请重试')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  if (props.product) {
    Object.assign(formData, {
      name: props.product.name,
      description: props.product.description,
      category: props.product.category,
      price: props.product.price,
      images: [...props.product.images],
      inventory: props.product.inventory,
      nftBenefit: { ...props.product.nftBenefit },
      tags: [...props.product.tags]
    })
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.btn-close {
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #f3f4f6;
  color: #1a1a1a;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.form-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.form-group {
  margin-bottom: 1rem;
  flex: 1;
  min-width: 0;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-label.required::after {
  content: ' *';
  color: #ef4444;
}

.form-input {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
}

.field-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.checkbox-label input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

.nft-benefits-config {
  margin-top: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  min-height: 42px;
  align-items: center;
}

.tags-input:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.tag {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: #e0e7ff;
  color: #3730a3;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.tag-remove {
  background: transparent;
  border: none;
  color: #3730a3;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  padding: 0;
  margin-left: 0.25rem;
}

.tag-input {
  flex: 1;
  min-width: 120px;
  border: none;
  outline: none;
  padding: 0.25rem;
  font-size: 0.875rem;
}

.image-upload {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.image-preview {
  position: relative;
  aspect-ratio: 1;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 2px solid #e5e7eb;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-remove {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.image-remove:hover {
  background: rgba(0, 0, 0, 0.8);
}

.image-upload-btn {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.image-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-secondary {
  padding: 0.625rem 1.25rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-primary {
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.w-6 {
  width: 1.5rem;
}

.h-6 {
  height: 1.5rem;
}

.w-4 {
  width: 1rem;
}

.h-4 {
  height: 1rem;
}
</style>
