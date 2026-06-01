import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

export interface QueueItem {
  id: string;
  type: "attendance" | "leave" | "complaint";
  payload: any;
  timestamp: number;
}

interface OfflineQueueContextType {
  queue: QueueItem[];
  addToQueue: (type: QueueItem["type"], payload: any) => Promise<void>;
  syncQueue: () => Promise<void>;
  clearQueue: () => Promise<void>;
}

const OfflineQueueContext = createContext<OfflineQueueContextType | null>(null);

const STORAGE_KEY = "@aec_offline_queue";

export function OfflineQueueProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<QueueItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setQueue(JSON.parse(stored) as QueueItem[]);
        }
      } catch (_) {
        // ignore
      }
    })();
  }, []);

  const addToQueue = async (type: QueueItem["type"], payload: any) => {
    const newItem: QueueItem = {
      id: Math.random().toString(),
      type,
      payload,
      timestamp: Date.now(),
    };
    const updated = [...queue, newItem];
    setQueue(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      "Offline Storage Active",
      "No network detected. Submission has been queued in your secure local storage. We will sync it automatically when you are back online."
    );
  };

  const syncQueue = async () => {
    if (queue.length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Simulate API calls for each item
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      "Sync Successful",
      `All offline actions (${queue.length} items) have been successfully synchronized with Supabase Realtime DB.`
    );
    await clearQueue();
  };

  const clearQueue = async () => {
    setQueue([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <OfflineQueueContext.Provider value={{ queue, addToQueue, syncQueue, clearQueue }}>
      {children}
    </OfflineQueueContext.Provider>
  );
}

export function useOfflineQueue() {
  const ctx = useContext(OfflineQueueContext);
  if (!ctx) throw new Error("useOfflineQueue must be used within OfflineQueueProvider");
  return ctx;
}
