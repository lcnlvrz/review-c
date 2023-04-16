var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var common_exports = {};
__export(common_exports, {
  MAX_FILE_SIZE_IN_BYTES: () => MAX_FILE_SIZE_IN_BYTES
});
module.exports = __toCommonJS(common_exports);

// constants/file.ts
var MAX_FILE_SIZE_IN_BYTES = 2e7;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MAX_FILE_SIZE_IN_BYTES
});
