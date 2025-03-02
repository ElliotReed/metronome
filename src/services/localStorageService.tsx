export default function createLocalStorageService(key: string) {
    return {
        get() {
            const storage = localStorage.getItem(key);
            return storage ? JSON.parse(storage) : null;
        },
        set(data: any) {
            localStorage.setItem(key, JSON.stringify(data));
        }
    };
}
