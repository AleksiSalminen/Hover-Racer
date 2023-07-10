/*
  Loads an image and gives access to pixel data.
  
  @class bkcore.ImageData
  @author Thibaut 'BKcore' Despoulain <http://bkcore.com>
*/


export default class ImageData {

  // ATTRIBUTES

  image;
  pixels;
  canvas;
  loaded;

  // CONSTRUCTORS

  constructor(path, callback) {
    let _this = this;
    this.image = new Image;
    this.pixels = null;
    this.canvas = null;
    this.loaded = false;
    this.image.onload = () => {
      let context;
      _this.canvas = document.createElement('canvas');
      _this.canvas.width = _this.image.width;
      _this.canvas.height = _this.image.height;
      context = _this.canvas.getContext('2d');
      context.drawImage(_this.image, 0, 0);
      _this.pixels = context.getImageData(0, 0, _this.canvas.width, _this.canvas.height);
      _this.loaded = true;
      context = null;
      _this.canvas = null;
      _this.image = null;
      return callback != null ? callback.call(_this) : void 0;
    };
    this.image.crossOrigin = "anonymous";
    this.image.src = path;
  }

  // METHODS

  /*
    Gets pixel RGBA data at given index
    
    @param x int In pixels
    @param y int In pixels
    @return Object{r,g,b,a}
  */
  getPixel(x, y) {
    let i;
    if (!(this.pixels != null) || x < 0 || y < 0 || x >= this.pixels.width || y >= this.pixels.height) {
      return {
        r: 0,
        g: 0,
        b: 0,
        a: 0
      };
    }
    i = (y * this.pixels.width + x) * 4;
    return {
      r: this.pixels.data[i],
      g: this.pixels.data[i + 1],
      b: this.pixels.data[i + 2],
      a: this.pixels.data[i + 3]
    };
  };

  /*
    Gets pixel RGBA data at given float index using bilinear interpolation
    
    @param x float In subpixels
    @param y float In subpixels
    @return Object{r,g,b,a}
  */
  getPixelBilinear(fx, fy) {
    let ax, ay, c, cf1, cf2, cx, cxy, cy, dx, dy, rx, ry, x, y;
    x = Math.floor(fx);
    y = Math.floor(fy);
    rx = fx - x - .5;
    ry = fy - y - .5;
    ax = Math.abs(rx);
    ay = Math.abs(ry);
    dx = rx < 0 ? -1 : 1;
    dy = ry < 0 ? -1 : 1;
    c = this.getPixel(x, y);
    cx = this.getPixel(x + dx, y);
    cy = this.getPixel(x, y + dy);
    cxy = this.getPixel(x + dx, y + dy);
    cf1 = [(1 - ax) * c.r + ax * cx.r, (1 - ax) * c.g + ax * cx.g, (1 - ax) * c.b + ax * cx.b, (1 - ax) * c.a + ax * cx.a];
    cf2 = [(1 - ax) * cy.r + ax * cxy.r, (1 - ax) * cy.g + ax * cxy.g, (1 - ax) * cy.b + ax * cxy.b, (1 - ax) * cy.a + ax * cxy.a];
    return {
      r: (1 - ay) * cf1[0] + ay * cf2[0],
      g: (1 - ay) * cf1[1] + ay * cf2[1],
      b: (1 - ay) * cf1[2] + ay * cf2[2],
      a: (1 - ay) * cf1[3] + ay * cf2[3]
    };
  };

  /*
    Gets pixel data at given index
    as 3-bytes integer (for floating-point textures erzats, from RGB values)
    
    @param x int In pixels
    @param y int In pixels
    @return int (R + G*255 + B*255*255)
  */
  getPixelF(x, y) {
    let c;
    c = this.getPixel(x, y);
    return c.r + c.g * 255 + c.b * 255 * 255;
  };

  /*
    Gets pixel data at given float index using bilinear interpolationas
    as 3-bytes integer (for floating-point textures erzats, from RGB values)
    
    @param x float In subpixels
    @param y float In subpixels
    @return Object{r,g,b,a}
  */
  getPixelFBilinear(fx, fy) {
    let c;
    c = this.getPixelBilinear(fx, fy);
    return c.r + c.g * 255 + c.b * 255 * 255;
  };

}

