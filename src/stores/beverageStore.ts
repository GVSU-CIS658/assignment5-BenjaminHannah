import { defineStore } from "pinia";
import {
  BaseBeverageType,
  CreamerType,
  SyrupType,
  BeverageType,
} from "../types/beverage";
import tempretures from "../data/tempretures.json";
import db from "../firebase.ts";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  QuerySnapshot,
  QueryDocumentSnapshot,
  onSnapshot,
} from "firebase/firestore";

export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    temps: tempretures,
    currentTemp: tempretures[0],
    bases: [] as BaseBeverageType[],
    currentBase: null as BaseBeverageType | null,
    syrups: [] as SyrupType[],
    currentSyrup: null as SyrupType | null,
    creamers: [] as CreamerType[],
    currentCreamer: null as CreamerType | null,
    beverages: [] as BeverageType[],
    currentBeverage: null as BeverageType | null,
    currentName: "",
  }),

  actions: {
    init() {
      onSnapshot(collection(db, "bases"), (snapshot) => {
        this.bases = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            color: data.color,
          };
        });
        if (!this.currentBase && this.bases.length > 0) {
        this.currentBase = this.bases[0];
        }
      });

      onSnapshot(collection(db, "creamers"), (snapshot) => {
        this.creamers = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            color: data.color,
          };
        });
        this.currentCreamer = this.creamers[0];
      });

      onSnapshot(collection(db, "syrups"), (snapshot) => {
        this.syrups = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            color: data.color,
          };
        });
        this.currentSyrup = this.syrups[0];
      });
    },
    
    makeBeverage() {},

    showBeverage() {},
  },
});
