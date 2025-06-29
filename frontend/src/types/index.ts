export type ElementType = "text" | "image" | "button";

export interface DraggableElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TextProperties {
  text: string;
  fontSize: number;
  fontFamily: string;
}

export interface ImageProperties {
  src: string;
  alt: string;
}

export interface ButtonProperties {
  text: string;
  onClick: () => void;
}

// Compose types using intersection types
export type TextElement = DraggableElement & TextProperties;
export type ImageElement = DraggableElement & ImageProperties;
export type ButtonElement = DraggableElement & ButtonProperties;

// Union type for all elements
export type Element = TextElement | ImageElement | ButtonElement; 