import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";

export async function saveSecure(key, value) {
  return await setItemAsync(key, value);
}

export async function getValueSecure(key) {
  return await getItemAsync(key);
}

export async function deleteValueSecure(key) {
  return await deleteItemAsync(key);
}
