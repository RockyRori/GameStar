import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
  state: () => ({
    gold: 1000,
    disciples: [],
    resources: {
      iron: 10,
      wood: 5,
      herbs: 3,
    },
    equipment: [],
  }),
  actions: {
    addGold(amount: number) {
      this.gold += amount;
    },
    recruitDisciple(disciple: any) {
      this.disciples.push(disciple);
    },
    addResource(type: string, amount: number) {
      if (this.resources[type] !== undefined) {
        this.resources[type] += amount;
      }
    },
    craftEquipment(item: any) {
      this.equipment.push(item);
    }
  }
});