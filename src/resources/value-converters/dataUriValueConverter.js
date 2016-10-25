export class DataUriValueConverter {
  toView(value, mimeType) {
    return `data:${mimeType};base64,${value}`;
  }
}