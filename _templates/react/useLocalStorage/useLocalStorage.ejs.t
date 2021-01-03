---
path: <%= path %>/useLocalStorage.ts
---
import { useState } from 'react';
import { isFunction } from 'lodash';

const useLocalStorage = <T extends any>(
  key: string,
  initialValue: T
): [T, (value: T | ((value: T) => T)) => void] => {
  let storage: Storage;
  if (!('localStorage' in window)) {
    console.warn('Local storage is not supported');
  } else {
    storage = window.localStorage;
  }

  const [state, setState] = useState<T>(() => {
    try {
      const item = storage.getItem(key);

      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((value: T) => T)) => {
    try {
      const valueToStore = isFunction(value) ? value(state) : value;

      setState(valueToStore);

      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch {
      // Do nothing
    }
  };

  return [state, setValue];
};

export { useLocalStorage };
