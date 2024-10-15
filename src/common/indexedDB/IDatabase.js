class IDatabase {
  constructor(dbName, tableName, pk = 'id', columns = [{ key: 'value', unique: false }], version = 1) {
    this.dbName = dbName;
    this.tableName = tableName;
    this.pk = pk
    this.columns = columns
    this.version = version;
    this.db = null;
  }

  // 打開資料庫
  open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        this.db = event.target.result;
        if (!this.db.objectStoreNames.contains(this.tableName)) {
          const objectStore = this.db.createObjectStore(this.tableName, { keyPath: this.pk, autoIncrement: true });

          this.columns.forEach(({ key, unique, multiEntry, locale }) => {
            let keypath;
            if (key.includes('_')) {
              keypath = key.split('_');
            }
            else {
              keypath = key;
            }
            objectStore.createIndex(key, keypath, {
              unique: unique ?? false,
              multiEntry: multiEntry ?? false,
              locale: locale ?? false,
            });
          })
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject(`Failed to open database: ${event.target.errorCode}`);
      };
    });
  }

  // 新增資料
  addData(data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.tableName], 'readwrite');
      const objectStore = transaction.objectStore(this.tableName);
      const request = objectStore.add(data);

      request.onsuccess = () => {
        resolve('Data added successfully');
      };

      request.onerror = (event) => {
        reject(`Failed to add data: ${event.target.errorCode}`);
      };
    });
  }

  // 讀取資料
  getData(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.tableName], 'readonly');
      const objectStore = transaction.objectStore(this.tableName);
      const request = objectStore.get(id);

      request.onsuccess = (event) => {
        resolve(request.result || null);
      };

      request.onerror = (event) => {
        reject(`Failed to retrieve data: ${event.target.errorCode}`);
      };
    });
  }

  getDataByColumnName(columnName, value) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.tableName], 'readonly');
      const objectStore = transaction.objectStore(this.tableName);
      const index = objectStore.index(columnName);
      const request = index.get(value);

      request.onsuccess = (event) => {
        resolve(request.result || null);
      };

      request.onerror = (event) => {
        reject(`Failed to retrieve data by name: ${event.target.errorCode}`);
      };
    });
  }



  // 更新資料
  updateData(data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.tableName], 'readwrite');
      const objectStore = transaction.objectStore(this.tableName);
      const request = objectStore.put(data);

      request.onsuccess = () => {
        resolve('Data updated successfully');
      };

      request.onerror = (event) => {
        reject(`Failed to update data: ${event.target.errorCode}`);
      };
    });
  }

  // 刪除資料
  deleteData(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.tableName], 'readwrite');
      const objectStore = transaction.objectStore(this.tableName);
      const request = objectStore.delete(id);

      request.onsuccess = () => {
        resolve('Data deleted successfully');
      };

      request.onerror = (event) => {
        reject(`Failed to delete data: ${event.target.errorCode}`);
      };
    });
  }

  getAllData() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.tableName], 'readonly');
      const objectStore = transaction.objectStore(this.tableName);
      const request = objectStore.getAll();

      request.onsuccess = (event) => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        reject(`Failed to retrieve all data: ${event.target.errorCode}`);
      };
    });
  }



  // 關閉資料庫
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

export default IDatabase;
