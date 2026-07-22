import { makeObservable, observable } from "mobx";
import { Entity } from "./Entity";

export class TextEntity extends Entity {
  private _text: string;
  private _fontSize: number;
  private _fontFamily: string;
  private _color: string;
  private _textAlign: "left" | "center" | "right";

  public constructor(id: string, text: string = "Sample Text", name: string = "Text Entity") {
    super(id, name);
    this._text = text;
    this._fontSize = 24;
    this._fontFamily = "Outfit";
    this._color = "#ffffff";
    this._textAlign = "center";

    makeObservable<this, "_text" | "_fontSize" | "_fontFamily" | "_color" | "_textAlign">(this, {
      _text: observable,
      _fontSize: observable,
      _fontFamily: observable,
      _color: observable,
      _textAlign: observable,
    });
  }

  public get text(): string {
    return this._text;
  }
  public setText(value: string) {
    this._text = value;
  }

  public get fontSize(): number {
    return this._fontSize;
  }
  public setFontSize(value: number) {
    this._fontSize = value;
  }

  public get fontFamily(): string {
    return this._fontFamily;
  }
  public setFontFamily(value: string) {
    this._fontFamily = value;
  }

  public get color(): string {
    return this._color;
  }
  public setColor(value: string) {
    this._color = value;
  }

  public get textAlign(): "left" | "center" | "right" {
    return this._textAlign;
  }
  public setTextAlign(value: "left" | "center" | "right") {
    this._textAlign = value;
  }
}
