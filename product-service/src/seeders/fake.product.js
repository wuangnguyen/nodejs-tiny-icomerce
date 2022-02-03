const faker = require('faker');

class FakeProductBuilder {
  constructor(name) {
    this.name = name;
    this.code = Math.random().toString(36).substr(2, 10).toUpperCase();
    this.description = faker.lorem.sentence();
    this.price = this._randomPrice(1, 1000, 2);
    this.createdAt = Date.now();
    this.updateAt = Date.now();
    this.colors = [];
    this.images = this._randomImages();
  }
  _randomPrice(min, max, decimalPlaces) {
    var random = Math.random() * (max - min) + min;
    var power = Math.pow(10, decimalPlaces);
    return Math.floor(random * power) / power;
  }
  _randomImages() {
    let images = [];
    let numberOfImages = Math.floor(Math.random() * 4 + 1);
    for (var i = 0; i < numberOfImages; i++) {
      images.push(faker.image.image());
    }
    return images;
  }
  addBrand({ id, name }) {
    this.brand = { id: id, name: name };
    return this;
  }
  addColors(color) {
    const { id, name, code } = color;
    const images = this._randomImages();
    this.colors.push({
      id: id,
      name: name,
      code: code,
      images: images
    });
    return this;
  }
  addAttributes() {
    this.attributes = [
      {
        name: 'Has wifi',
        value: Math.floor(Math.random() * 2) == 1 ? true : false
      },
      {
        name: 'Hot sales',
        value: Math.floor(Math.random() * 2) == 1 ? true : false
      },
      {
        name: 'Notes',
        value: faker.lorem.sentence()
      }
    ];
    return this;
  }
  build() {
    this.title = `${this.name} ${faker.commerce.productAdjective()} ${this.brand == null ? '' : this.brand.name}`.trim();
    return this;
  }
}

module.exports = FakeProductBuilder;
