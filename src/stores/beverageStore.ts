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
  //getDocs,
  setDoc,
  doc,
  //QuerySnapshot,
  //QueryDocumentSnapshot,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { type User } from "firebase/auth";

import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase.ts";

let beverageUnsubscribe: any = null;

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
    user: null as User | null,
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

    async withGoogle() {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        this.setUser(result.user);
      } catch (error) {
        console.error("Login failed:", error);
        return "Login failed. Please try again.";
      }
    },
    
    async logout() {
      await signOut(auth);
      this.setUser(null);
    },

    setUser(user: User | null) {
      this.user = user;

      if (beverageUnsubscribe) {
        beverageUnsubscribe();
        beverageUnsubscribe = null;
      }

      if (!user) {
        this.beverages = [];
        return;
      }
      const q = query(collection(db, "beverages"), where("user", "==", user.uid));
      onSnapshot(q, (snapshot) => {
        this.beverages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as BeverageType));
        this.currentBeverage = this.beverages[0] || null;
      });
    },
    
    async makeBeverage() {
  if (!this.user) {
    return "No user logged in, please sign in first.";
  }

  if (
    !this.currentName.trim() ||
    !this.currentBase ||
    !this.currentSyrup ||
    !this.currentCreamer
  ) {
    return "Please complete all beverage options and the name before making a beverage.";
  }

  const beverageRef = doc(collection(db, "beverages"));

  const newBeverage: BeverageType = {
    id: beverageRef.id,
    name: this.currentName,
    temp: this.currentTemp,
    base: this.currentBase,
    syrup: this.currentSyrup,
    creamer: this.currentCreamer,
    user: this.user.uid,
  };

  await setDoc(beverageRef, newBeverage);

  this.currentBeverage = newBeverage;
  const savedName = this.currentName;
  this.currentName = "";

  return `Beverage ${savedName} made successfully!`;
},

    showBeverage(beverage: BeverageType) {
      this.currentTemp = beverage.temp;
      this.currentBase = beverage.base;
      this.currentSyrup = beverage.syrup;
      this.currentCreamer = beverage.creamer;
      this.currentName = beverage.name;
      this.currentBeverage = beverage;
    }
  },
});
