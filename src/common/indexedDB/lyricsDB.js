import IDatabase from './IDatabase';

class LyricsDB {
  constructor() {
    this.db = new IDatabase('tsai1247.github.io', 'lyrics',
      'id', [
      {
        key: 'name', unique: false
      },
      {
        key: 'singer', unique: false
      },
      {
        key: 'format', unique: false
      },
      {
        key: 'lyrics', unique: false
      },
      {
        key: 'hiragana', unique: false
      },
      {
        key: 'youtube', unique: false
      },
      {
        key: 'lyricSchedule', unique: false
      },
      {
        key: 'name_singer', unique: true
      }
    ]);

  }

  async add(name, singer, format, lyrics, hiragana, youtube, lyricSchedule = null) {
    await this.db.open();
    const result = await this.db.addData({
      name, singer, format, lyrics, hiragana, youtube, lyricSchedule
    })

    await this.db.close();
    return result;
  }

  async update(id, name, singer, format, lyrics, hiragana, youtube, lyricSchedule = null) {
    await this.db.open();
    const result = await this.db.updateData({
      id, name, singer, format, lyrics, hiragana, youtube, lyricSchedule
    })

    await this.db.close();
    return result;
  }

  async getById(id) {
    await this.db.open();
    const result = await this.db.getData(id);
    await this.db.close();

    return result;
  }

  async delete(id) {
    await this.db.open();
    const result = await this.db.deleteData(id)
    await this.db.close();

    return result;
  }


  async getByName(name, fuzzy = false) {
    if (fuzzy) {
      await this.db.open();
      const result = await this.db.getAllData()
      await this.db.close();
      return result.filter((item) => item.name.includes(name));
    }
    else {
      await this.db.open();
      const result = await this.db.getDataByColumnName('name', name)
      await this.db.close();
      return result;
    }
  }

  async getBySinger(singer, fuzzy = false) {
    if (fuzzy) {
      await this.db.open();
      const result = await this.db.getAllData()
      await this.db.close();
      return result.filter((item) => item.singer.includes(singer));
    }
    else {
      await this.db.open();
      const result = await this.db.getDataByColumnName('singer', nsinger)
      await this.db.close();
      return result;
    }
  }

  async getByLyrics(lyrics) {
    await this.db.open();
    const result = await this.db.getAllData();
    await this.db.close();
    return result.filter((item) => item.lyrics.includes(lyrics));
  }

  async getAll() {
    await this.db.open();
    const result = await this.db.getAllData();
    await this.db.close();
    return result;
  }

  async updatelyricSchedule(id, lyricSchedule) {
    await this.db.open();
    const { name, singer, format, lyrics, hiragana, youtube } = await this.db.getData(id);;
    const result = await this.db.updateData({
      id, name, singer, format, lyrics, hiragana, youtube, lyricSchedule
    })

    await this.db.close();
    return result;
  }
}

const lyricsDB = new LyricsDB();

export default lyricsDB;
