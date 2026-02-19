import Renderer from './Renderer';

export function CreateRenderer(renderContainer: HTMLDivElement) {
    return new Renderer(renderContainer);
}

export { default as Renderer } from './Renderer';