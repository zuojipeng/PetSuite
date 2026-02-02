import { http } from '../../utils/http'
import { API_ENDPOINTS } from '../../config/api'
import type { PetProfile } from '@petsuite/shared/types/pet'

/**
 * 宠物 API 服务
 */
export const petApi = {
  /**
   * 创建宠物档案
   */
  async createPet(petData: Omit<PetProfile, '_id'> & { owner: string }) {
    return http.post(API_ENDPOINTS.pets.create, petData)
  },

  /**
   * 获取宠物详情
   */
  async getPetById(id: string) {
    return http.get(API_ENDPOINTS.pets.getById(id))
  },

  /**
   * 获取用户的所有宠物
   */
  async getPetsByOwner(address: string) {
    return http.get(API_ENDPOINTS.pets.getByOwner(address))
  },

  /**
   * 更新宠物信息
   */
  async updatePet(id: string, updates: Partial<PetProfile>) {
    return http.put(API_ENDPOINTS.pets.update(id), updates)
  },

  /**
   * 删除宠物档案
   */
  async deletePet(id: string) {
    return http.delete(API_ENDPOINTS.pets.delete(id))
  },
}
